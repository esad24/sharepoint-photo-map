/* ========================================================================== */
/* DataService.ts                                                             */
/* - Service for fetching data from SharePoint lists and document libraries   */
/* - Handles both column-based and EXIF-based location extraction             */
/* ========================================================================== */

import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as EXIF from 'exif-js';
import { escODataIdentifier, sanitizeUrl } from '../utils/security';
import { IWebmapListItem, IWebmapWebPartProps } from '../WebmapWebPart';

/**
 * Interface for GPS coordinates
 */
export interface IGPSCoordinates {
  lat: number;
  lon: number;
}

/**
 * Interface for processed map item
 */
export interface IMapItem {
  lat: number;
  lon: number;
  img: string;
  data: IWebmapListItem;
}

/**
 * Result of data fetching operations
 */
export interface IDataFetchResult {
  items: IMapItem[];
  errors: string[];
}

/**
 * Service class for handling all data fetching operations
 */
export class DataService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  /**
   * Main method to fetch data based on configured properties
   */
  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    // Handle different data source types
    if (properties.dataSourceType === 'List') {
      return this.fetchListData(properties);
    } else if (properties.dataSourceType === 'DocumentLibrary') {
      return this.fetchDocumentLibraryData(properties);
    }
    
    return { items: [], errors: [] };
  }

  /**
   * Fetches data from SharePoint list
   */
  private async fetchListData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const { listName, latField, lonField, imgField } = properties;
    const result: IDataFetchResult = { items: [], errors: [] };
    
    // Guard clause: do nothing if essential properties are not configured.
    if (!listName || !latField || !lonField || !imgField) {
      result.errors.push('Missing required list configuration');
      return result;
    }

    // Construct the SharePoint REST API URL.
    const site = this.context.pageContext.web.absoluteUrl;
    const listPart = escODataIdentifier(listName); // Safely escape list name.
    // Select only the columns we need, escaping each field name for security.
    const selectFields = [latField, lonField, imgField]
      .map(f => escODataIdentifier(f)) // Security
      .join(',');

    const url =
      `${site}/_api/web/lists/getByTitle('${listPart}')/items` +
      `?$select=${selectFields}`;

    try {
      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value as IWebmapListItem[];

      items.forEach(item => {
        // FIX: Add type assertions when accessing properties from an 'unknown' type.
        const imgData = item[imgField] as { Url: string };
        // Ensure the item has the necessary data. The image is often in a sub-property like 'Url'.
        if (!item[latField] || !item[lonField] || !imgData?.Url) return;

        const rawImg = imgData.Url;
        const img = sanitizeUrl(rawImg); // Sanitize the URL before use.
        if (!img) return; // Skip if the URL is invalid.

        // Parse coordinates.
        const lat = parseFloat(item[latField] as string);
        const lon = parseFloat(item[lonField] as string);

        // Check if coordinates are valid numbers before using them
        if (isNaN(lat) || isNaN(lon)) return;

        // Create an "enriched" version of the item with the sanitized img URL for easy access.
        const enriched = { ...item, img };  // copy all properties of item and add sanitized img url

        result.items.push({
          lat,
          lon,
          img,
          data: enriched
        });
      });
    } catch (err) {
      console.error('Webmap → list fetch failed:', err);
      result.errors.push('Failed to fetch list data');
    }

    return result;
  }

  /**
   * Fetches data from Document Library
   */
  private async fetchDocumentLibraryData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const { libraryName, latField, lonField } = properties;
    const result: IDataFetchResult = { items: [], errors: [] };
    
    if (!libraryName) {
      //result.errors.push('Missing library name');
      return result;
    }

    const site = this.context.pageContext.web.absoluteUrl;
    const libraryPart = escODataIdentifier(libraryName);

    try {
      // Build select fields - always include FileRef and FileLeafRef
      const baseFields = ['FileRef', 'FileLeafRef'];
      
      // Add lat/lon fields if they are specified
      if (latField) baseFields.push(latField);
      if (lonField) baseFields.push(lonField);
      
      const selectFields = baseFields
        .map(f => escODataIdentifier(f))
        .join(',');
      
      const url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0`;

      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value;
      
      let noGpsCount = 0;
      let missingExifNoManualCoords = 0;

      for (const item of items) {
        const fileName = item.FileLeafRef;
        const fileUrl = `${site}${item.FileRef}`;
        
        // Check if it's an image file based on the file extension
        if (!this.isImageFile(fileUrl)) continue;

        // For document libraries, always use the file URL as the image
        const img = fileUrl;

        let lat: number | null = null;
        let lon: number | null = null;

        // First priority: Check if manual lat/lon fields are specified and have values
        if (latField && lonField && item[latField] && item[lonField]) {
          lat = parseFloat(item[latField] as string);
          lon = parseFloat(item[lonField] as string);
        } else {
          // Second priority: Try to extract from EXIF
          const gpsData = await this.extractGPSFromExif(img);
          if (gpsData) {
            lat = gpsData.lat;
            lon = gpsData.lon;
          } else {
            noGpsCount++;
            // If no EXIF data and no manual coordinates specified
            if (!latField || !lonField) {
              missingExifNoManualCoords++;
            }
          }
        }

        // Skip if no valid coordinates
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

        // Create marker data
        const sanitizedImg = sanitizeUrl(img);
        if (!sanitizedImg) continue;

        const enriched = { 
          ...item, 
          img: sanitizedImg, 
          fileName
        };

        result.items.push({
          lat,
          lon,
          img: sanitizedImg,
          data: enriched
        });
      }

      // Add appropriate error messages
      if (missingExifNoManualCoords > 0) {
        result.errors.push(`Not all images have GPS coordinates. Please choose latitude and longitude fields manually.`);
      //} else if (noGpsCount > 0 && (!latField || !lonField)) {
      //  result.errors.push(`${noGpsCount} image(s) have no EXIF GPS data and will not be displayed.`);
      }

    } catch (err) {
      console.error('Webmap → document library fetch failed:', err);
      result.errors.push('Failed to load images from document library');
    }

    return result;
  }

  /**
   * Extracts GPS coordinates from image EXIF data
   */
  private extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      
      img.onload = function() {
        EXIF.getData(img as any, function() {
          const lat = EXIF.getTag(this, 'GPSLatitude');
          const lon = EXIF.getTag(this, 'GPSLongitude');
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');
          
          if (lat && lon) {
            // Convert GPS coordinates from degrees/minutes/seconds to decimal
            const decimalLat = DataService.convertDMSToDD(lat, latRef);
            const decimalLon = DataService.convertDMSToDD(lon, lonRef);
            
            if (decimalLat !== null && decimalLon !== null) {
              resolve({ lat: decimalLat, lon: decimalLon });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  }

  /**
   * Converts GPS coordinates from degrees/minutes/seconds to decimal degrees
   */
  private static convertDMSToDD(dms: number[], ref: string): number | null {
    if (!dms || dms.length !== 3) return null;
    
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    
    return dd;
  }

  /**
   * Checks if a file is an image based on its extension
   */
  private isImageFile(fileUrl: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileName = fileUrl.split('/').pop() || fileUrl;
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.indexOf(ext) !== -1;
  }
}