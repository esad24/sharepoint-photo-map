/* ========================================================================== */
/* DataService.ts                                                             */
/* - Service for fetching data from SharePoint document libraries             */
/* - Handles both manual coordinate and EXIF-based location extraction        */
/* ========================================================================== */

// Import necessary SharePoint and web part libraries
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
// EXIF-js library for reading GPS data from image metadata
import * as EXIF from 'exif-js';
// Security utilities for safely handling user input and URLs
import { escODataIdentifier, sanitizeUrl } from '../utils/Security';
// Import interfaces from the main web part file
import { IWebmapListItem, IWebmapWebPartProps } from '../types/IWebmapTypes';

import { MapViewService } from './MapViewService';

import * as L from 'leaflet';

/**
 * Interface for GPS coordinates
 * Simple structure to hold latitude and longitude values
 */
export interface IGPSCoordinates {
lat: number; // Latitude in decimal degrees (e.g., 51.4239)
lon: number; // Longitude in decimal degrees (e.g., 6.9985)
}

/**
 * Interface for processed map item
 * This represents a single image ready to be displayed on the map
 */
export interface IMapItem {
lat: number;          // Latitude coordinate for marker placement
lon: number;          // Longitude coordinate for marker placement
img: string;          // URL to the image file
data: IWebmapListItem; // Full SharePoint item data (for additional properties)
}

/**
 * Result of data fetching operations
 * Contains both successful items and any errors that occurred
 */
export interface IDataFetchResult {
items: IMapItem[];    // Array of successfully processed map items
errors: string[];     // Array of error messages to display to user
}

const bounds: L.LatLng[] = [];
/**
 * Service class for handling all data fetching operations
 */
export class DataService {
private context: WebPartContext; // SharePoint context for making API calls
private mapViewService: MapViewService | undefined;


constructor(context: WebPartContext, mapViewService?: MapViewService) {
  this.context = context; // Store context for later use
  this.mapViewService = mapViewService;

}

/**
 * Main method to fetch data based on configured properties
 * This is the entry point that other classes call
 */
public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
  // Currently only supports document libraries, but could be extended
  // for other data sources (lists, external APIs, etc.)
  return this.fetchDocumentLibraryData(properties);

}

/**
 * Fetches data from Document Library
 * This method handles the entire process of getting images and their locations
 */
private async fetchDocumentLibraryData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
  // Destructure properties for easier access
  const { libraryName, locationMethod, latField, lonField } = properties;
  // Initialize result object with empty arrays
  const result: IDataFetchResult = { items: [], errors: [] };
  
  // Check if library name is provided
  if (!libraryName) {
    return result;
  }

  // Validate manual method has required fields
  // If user selected manual coordinate entry, both fields must be specified
  if (locationMethod === 'manual' && (!latField || !lonField)) {
    result.errors.push('Please select both latitude and longitude fields');
    return result;
  }

  // Get the current SharePoint site URL
  const site = this.context.pageContext.web.absoluteUrl;
  // Escape the library name to handle special characters safely
  const libraryPart = escODataIdentifier(libraryName);

  try {
    // Build select fields - always include FileRef and FileLeafRef
    // FileRef = full path to file, FileLeafRef = just the filename
    const baseFields = ['FileRef', 'FileLeafRef'];
    
    // Add lat/lon fields if using manual method
    // This ensures we fetch the coordinate data from SharePoint
    if (locationMethod === 'manual' && latField && lonField) {
      baseFields.push(latField);
      baseFields.push(lonField);
    }
    
    // Convert field array to comma-separated string for API
    // Also escape each field name for safety
    const selectFields = baseFields
      .map(f => escODataIdentifier(f))
      .join(',');
    
    // Build the SharePoint REST API URL
    // FSObjType eq 0 filters to only files (not folders)
    const url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0`;

    // Make the API call to SharePoint
    const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    const json = await response.json();
    const items = json.value; // Extract the array of items
    
    // Counter for images without GPS data (for error message)
    let noGpsCount = 0;

    // Process each item returned from SharePoint
    for (const item of items) {
      const fileName = item.FileLeafRef; // Get the filename
      const fileUrl = `${site}${item.FileRef}`; // Build full URL to file
      
      // Check if it's an image file based on the file extension
      if (!this.isImageFile(fileUrl)) continue; // Skip non-image files

      // For document libraries, always use the file URL as the image
      const img = fileUrl;

      // Initialize coordinate variables
      let lat: number | null = null;
      let lon: number | null = null;

      if (locationMethod === 'manual') {
        // Manual method: Get coordinates from specified fields
        // Check if both fields have values
        if (item[latField!] && item[lonField!]) {
          // Parse string values to numbers
          lat = parseFloat(item[latField!] as string);
          lon = parseFloat(item[lonField!] as string);
        }
      } else {
        // EXIF method: Extract from image EXIF data
        // This is asynchronous as it needs to load the image
        const gpsData = await this.extractGPSFromExif(img);
        if (gpsData) {
          lat = gpsData.lat;
          lon = gpsData.lon;
        } else {
          noGpsCount++; // Increment counter for error message
        }
      }

      // Skip if no valid coordinates
      // Check for null, undefined, or NaN values
      if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

      // Create marker data
      // Sanitize the image URL for security
      const sanitizedImg = sanitizeUrl(img);
      if (!sanitizedImg) continue; // Skip if URL is invalid

      // Create enriched object with all item data plus image URL
      const enriched = { 
        ...item,          // Spread all original SharePoint fields
        img: sanitizedImg, // Add sanitized image URL
        fileName          // Add filename for convenience
      };

      // Add to results array
      result.items.push({
        lat,
        lon,
        img: sanitizedImg,
        data: enriched
      });
    }

    // Add appropriate error messages
    // Only show EXIF error if some images were missing GPS data
    if (locationMethod === 'exif' && noGpsCount === 1) {
      result.errors.push(`1 image has no EXIF GPS data and will not be displayed.`);
    }
    else if (locationMethod === 'exif' && noGpsCount > 1) {
      result.errors.push(`${noGpsCount} images have no EXIF GPS data and will not be displayed.`);
    }

  } catch (err) {
    // Log detailed error for developers
    console.error('Webmap → document library fetch failed:', err);
    // Show user-friendly error message
    result.errors.push('Failed to load images from document library');
  }

  this.getBounds(result.items); // Collect all coordinates for map bounds
  return result;
}

/**
 * Extracts GPS coordinates from image EXIF data
 * EXIF (Exchangeable Image File Format) data contains metadata embedded in images
 * This includes camera settings, date/time, and sometimes GPS location
 */
private extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
  return new Promise((resolve) => {
    // Create a new Image object to load the image
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS to allow reading image data
    
    // Handler for when image loads successfully
    img.onload = function() {
      // Use EXIF library to extract metadata
      // 'this' refers to the image element
      EXIF.getData(img as any, function() {
        // Extract GPS-related tags from EXIF data
        const lat = EXIF.getTag(this, 'GPSLatitude');      // Latitude array [degrees, minutes, seconds]
        const lon = EXIF.getTag(this, 'GPSLongitude');     // Longitude array [degrees, minutes, seconds]
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef'); // N or S (North/South)
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef'); // E or W (East/West)
        
        // Check if we have both latitude and longitude
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
      resolve(null); // Return null if image fails to load
    };
    
    // Start loading the image
    img.src = imageUrl;
  });
}

/**
 * Converts GPS coordinates from degrees/minutes/seconds to decimal degrees
 * GPS coordinates in EXIF are stored as [degrees, minutes, seconds]
 * Map libraries expect decimal degrees (e.g., 51.4239 instead of 51° 25' 26.04")
 */
private static convertDMSToDD(dms: number[], ref: string): number | null {
  // Validate input array has all three components
  if (!dms || dms.length !== 3) return null;
  
  // Convert using the formula: decimal = degrees + (minutes/60) + (seconds/3600)
  let dd = dms[0] + dms[1]/60 + dms[2]/3600;
  
  // Apply hemisphere correction
  // Southern and Western coordinates are negative
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  
  return dd;
}

/**
 * Checks if a file is an image based on its extension
 * This is a simple check that looks at the file extension
 */
private isImageFile(fileUrl: string): boolean {
  // List of common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  // Extract filename from URL (everything after last /)
  const fileName = fileUrl.split('/').pop() || fileUrl;
  // Get the file extension (everything after last .)
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  // Check if extension is in our list
  return imageExtensions.indexOf(ext) !== -1;
}

/**
 * Collect all coordinates and call MapViewService to set bounds
 */
private getBounds(items: IMapItem[]): void {
  const bounds: L.LatLng[] = [];
  for (const item of items) {
    bounds.push(L.latLng(item.lat, item.lon));
  }
  
  // Pass bounds to MapViewService
  if (this.mapViewService) {
    this.mapViewService.setImageBounds(bounds);
  }
}
}