// Service for fetching data from SharePoint document libraries             
// Handles both manual coordinate and EXIF-based location extraction        

import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as EXIF from 'exif-js';
import { escODataIdentifier, sanitizeUrl } from '../utils/Security';
import { IWebmapWebPartProps } from '../types/IWebmapTypes';

import { MapViewService } from './MapViewService';

import * as L from 'leaflet';

// Interface for GPS coordinates
export interface IGPSCoordinates {
lat: number;
lon: number;
}

// Interface for processed map item
export interface IMapItem {
lat: number;          
lon: number;          
img: string;         
}

// Result of data fetching operations

export interface IDataFetchResult {
items: IMapItem[];    
errors: string[];    
}

const bounds: L.LatLng[] = []; // map boundaries

export class DataService {
  private context: WebPartContext; // SharePoint context for making API calls
  private mapViewService: MapViewService | undefined;


  constructor(context: WebPartContext, mapViewService?: MapViewService) {
    this.context = context;
    this.mapViewService = mapViewService;

  }

  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    return this.fetchDocumentLibraryData(properties);     // Currently only supports document libraries, but could be extended for other data sources (lists, external APIs, etc.)
  }

  // Fetches data from Document Library

  private async fetchDocumentLibraryData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const { libraryName, locationMethod, latField, lonField } = properties;
    const result: IDataFetchResult = { items: [], errors: [] };
    
    if (!libraryName) {
      return result;
    }

    // Validate manual method has required fields
    if (locationMethod === 'manual' && (!latField || !lonField)) {
      result.errors.push('Please select both latitude and longitude fields');
      return result;
    }

    // Get the current SharePoint site URL
    const site = this.context.pageContext.web.absoluteUrl;
    if(!site) {
      return result;
    }

    // Escape the library name to handle special characters safely
    const libraryPart = escODataIdentifier(libraryName);

    try {
      
      const baseFields = ['FileRef', 'FileLeafRef']; // FileRef = full path to file, FileLeafRef = just the filename
      
      if (locationMethod === 'manual' && latField && lonField) {
        baseFields.push(latField);
        baseFields.push(lonField);
      }
      
      // Convert field array to comma separated string for API
      const selectFields = baseFields
        .map(f => escODataIdentifier(f))
        .join(',');
      
      // Build the SharePoint REST API URL
      const url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0&$top=5000`;       // FSObjType eq 0 filters to only files, max 5000 items to fetch

      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value;
      
      // Counter for images without GPS data (for error message)
      let noGpsCount = 0;

      // Process each item returned from SharePoint
      for (const item of items) {
        const fileName = item.FileLeafRef; 
        const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
        const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';
        const relativeFileRef = item.FileRef.replace(searchString, ''); 
        const fileUrl = `${site}/${relativeFileRef}`; // Build full URL to file

        
        // Check if it's an image file based on the file extension
        if (!this.isImageFile(fileUrl)) continue;

        // For document libraries, always use the file URL as the image
        const img = fileUrl;

        // Initialize coordinate variables
        let lat: number | null = null;
        let lon: number | null = null;

        if (locationMethod === 'manual') {
          if (item[latField!] && item[lonField!]) {
            // Parse string values to numbers
            let latString = item[latField!] as string;
            let lonString = item[lonField!] as string;
            
            // Replace comma with period if comma is used as decimal separator
            if (latString.includes(',')) {
              latString = latString.replace(',', '.');
            }
            if (lonString.includes(',')) {
              lonString = lonString.replace(',', '.');
            }
            
            lat = parseFloat(latString);
            lon = parseFloat(lonString);
          }
        } 
        else {
          // Extract from image EXIF data
          const gpsData = await this.extractGPSFromExif(img);
          if (gpsData) {
            lat = gpsData.lat;
            lon = gpsData.lon;
          } else {
            noGpsCount++; 
          }
        }

        if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

        const sanitizedImg = sanitizeUrl(img);
        if (!sanitizedImg) continue;

        // Add to results array
        result.items.push({
          lat,
          lon,
          img: sanitizedImg
        });
      }

      if (locationMethod === 'exif' && noGpsCount === 1) {
        result.errors.push(`1 image has no EXIF GPS data and will not be displayed.`);
      }
      else if (locationMethod === 'exif' && noGpsCount > 1) {
        result.errors.push(`${noGpsCount} images have no EXIF GPS data and will not be displayed.`);
      }

    } catch (err) {

      console.error('Webmap: document library fetch failed:', err);
      result.errors.push('Failed to load images from document library');
    }

    this.getBounds(result.items); // Collect all coordinates for map bounds
    return result;
  }

  // Extracts GPS coordinates from image EXIF data

  private extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
    return new Promise((resolve) => {

      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS to allow reading image data
      
      // Handler for when image loads successfully
      img.onload = function() {
        EXIF.getData(img as any, function() {
          const lat = EXIF.getTag(this, 'GPSLatitude');      // Latitude array [degrees, minutes, seconds]
          const lon = EXIF.getTag(this, 'GPSLongitude');     // Longitude array [degrees, minutes, seconds]
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef'); // N or S (North/South)
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef'); // E or W (East/West)
          
          if (lat && lon) {
            // Convert GPS coordinates from degrees/minutes/seconds to decimal
            const decimalLat = DataService.convertDMSToDD(lat, latRef);
            const decimalLon = DataService.convertDMSToDD(lon, lonRef);
            
            // Return coordinates if conversion was successful
            if (decimalLat !== null && decimalLon !== null) {
              resolve({ lat: decimalLat, lon: decimalLon });
            } else {
              resolve(null); // Conversion failed
            }
          } else {
            resolve(null); // No GPS data in EXIF
          }
        });
      };
      
      // Handler for image load errors
      img.onerror = () => {
        resolve(null);
      };      
      img.src = imageUrl;      // Start loading the image

    });
  }

  // Converts GPS coordinates from degrees/minutes/seconds to decimal degrees

  private static convertDMSToDD(dms: number[], ref: string): number | null {
    if (!dms || dms.length !== 3) return null;
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    
    // Southern and Western coordinates are negative
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  }

  // Checks if a file is an image based on its extension
  private isImageFile(fileUrl: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileName = fileUrl.split('/').pop() || fileUrl;
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  // Collect all coordinates and call MapViewService to set bounds

  private getBounds(items: IMapItem[]): void {
    const bounds: L.LatLng[] = [];
    for (const item of items) {
      bounds.push(L.latLng(item.lat, item.lon));
    }
    if (this.mapViewService) {
      this.mapViewService.setImageBounds(bounds);
    }
  }
}

