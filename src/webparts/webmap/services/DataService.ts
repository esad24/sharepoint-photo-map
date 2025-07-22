/* ========================================================================== */
/* DataService.ts                                                             */
/* - Service for fetching data from SharePoint document libraries             */
/* - Handles both manual coordinate and EXIF-based location extraction        */
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
    return this.fetchDocumentLibraryData(properties);
  }

  /**
   * Fetches data from Document Library
   */
  private async fetchDocumentLibraryData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const { libraryName, locationMethod, latField, lonField } = properties;
    const result: IDataFetchResult = { items: [], errors: [] };
    
    if (!libraryName) {
      //result.errors.push('Missing library name');
      return result;
    }

    // Validate manual method has required fields
    if (locationMethod === 'manual' && (!latField || !lonField)) {
      result.errors.push('Please select both latitude and longitude fields');
      return result;
    }

    const site = this.context.pageContext.web.absoluteUrl;
    const libraryPart = escODataIdentifier(libraryName);

    try {
      // Build select fields - always include FileRef and FileLeafRef
      const baseFields = ['FileRef', 'FileLeafRef'];
      
      // Add lat/lon fields if using manual method
      if (locationMethod === 'manual' && latField && lonField) {
        baseFields.push(latField);
        baseFields.push(lonField);
      }
      
      const selectFields = baseFields
        .map(f => escODataIdentifier(f))
        .join(',');
      
      const url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0`;

      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value;
      
      let noGpsCount = 0;

      for (const item of items) {
        const fileName = item.FileLeafRef;
        const fileUrl = `${site}${item.FileRef}`;
        
        // Check if it's an image file based on the file extension
        if (!this.isImageFile(fileUrl)) continue;

        // For document libraries, always use the file URL as the image
        const img = fileUrl;

        let lat: number | null = null;
        let lon: number | null = null;

        if (locationMethod === 'manual') {
          // Manual method: Get coordinates from specified fields
          if (item[latField!] && item[lonField!]) {
            lat = parseFloat(item[latField!] as string);
            lon = parseFloat(item[lonField!] as string);
          }
        } else {
          // EXIF method: Extract from image EXIF data
          const gpsData = await this.extractGPSFromExif(img);
          if (gpsData) {
            lat = gpsData.lat;
            lon = gpsData.lon;
          } else {
            noGpsCount++;
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
      if (locationMethod === 'exif' && noGpsCount > 0) {
        result.errors.push(`Some images have no EXIF GPS data and will not be displayed.`);
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