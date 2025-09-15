// Optimized Service for fetching data from SharePoint document libraries             
// Handles both manual coordinate and EXIF-based location extraction with performance optimizations

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
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
  private context: WebPartContext;
  private mapViewService: MapViewService | undefined;
  
  // Performance configuration
  private readonly BATCH_SIZE = 20; // Process images in batches
  private readonly MAX_CONCURRENT = 3; // Maximum concurrent image loads
  private readonly BATCH_DELAY = 500; // Delay between batches (ms)

  constructor(context: WebPartContext, mapViewService?: MapViewService) {
    this.context = context;
    this.mapViewService = mapViewService;
  }

  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    return this.fetchDocumentLibraryData(properties);
  }

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

    const site = this.context.pageContext.web.absoluteUrl;
    if (!site) {
      return result;
    }

    const libraryPart = escODataIdentifier(libraryName);

    try {
      // Get all items from SharePoint
      const allItems = await this.fetchAllSharePointItems(site, libraryPart, locationMethod, latField, lonField);
      
      if (locationMethod === 'manual') {
        // Process manual coordinates (fast)
        result.items = await this.processManualCoordinates(allItems, site, latField!, lonField!);
      } else {
        // Process EXIF coordinates with optimizations (slower but optimized)
        const processResult = await this.processEXIFCoordinatesOptimized(allItems, site);
        result.items = processResult.items;
        result.errors = processResult.errors;
      }

    } catch (err) {
      console.error('Webmap: document library fetch failed:', err);
      result.errors.push('Failed to load images from document library');
    }

    this.getBounds(result.items);
    return result;
  }

  // Fetch all items from SharePoint with pagination
  private async fetchAllSharePointItems(
    site: string, 
    libraryPart: string, 
    locationMethod: string, 
    latField?: string, 
    lonField?: string
  ): Promise<any[]> {
    const baseFields = ['FileRef', 'FileLeafRef'];
    
    if (locationMethod === 'manual' && latField && lonField) {
      baseFields.push(latField, lonField);
    }
    
    const selectFields = baseFields.map(f => escODataIdentifier(f)).join(',');
    let allItems: any[] = [];
    let url: string | null = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$top=500`;

    while (url) {
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      
      if (!response.ok) {
        throw new Error(`Error fetching items: ${response.statusText}`);
      }
      
      const json = await response.json();
      allItems = allItems.concat(json.value);
      url = json['@odata.nextLink'] || null;
    }

    return allItems;
  }

  // Process manual coordinates (original logic)
  private async processManualCoordinates(
    items: any[], 
    site: string, 
    latField: string, 
    lonField: string
  ): Promise<IMapItem[]> {
    const results: IMapItem[] = [];
    const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
    const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';

    for (const item of items) {
      const relativeFileRef = item.FileRef.replace(searchString, '');
      const fileUrl = `${site}/${relativeFileRef}`;

      if (!this.isImageFile(fileUrl)) continue;

      if (item[latField] && item[lonField]) {
        let latString = item[latField] as string;
        let lonString = item[lonField] as string;
        
        if (latString.includes(',')) latString = latString.replace(',', '.');
        if (lonString.includes(',')) lonString = lonString.replace(',', '.');
        
        const lat = parseFloat(latString);
        const lon = parseFloat(lonString);

        if (!isNaN(lat) && !isNaN(lon)) {
          const sanitizedImg = sanitizeUrl(fileUrl);
          if (sanitizedImg) {
            results.push({ lat, lon, img: sanitizedImg });
          }
        }
      }
    }

    return results;
  }

  // Process EXIF coordinates with batching
  private async processEXIFCoordinatesOptimized(
    items: any[], 
    site: string
  ): Promise<{ items: IMapItem[], errors: string[] }> {
    const results: IMapItem[] = [];
    const errors: string[] = [];
    const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
    const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';

    // Filter to image files only first
    const imageItems = items.filter(item => {
      const relativeFileRef = item.FileRef.replace(searchString, '');
      const fileUrl = `${site}/${relativeFileRef}`;
      return this.isImageFile(fileUrl);
    });

    console.log(`Processing ${imageItems.length} images for EXIF data...`);

    let processedCount = 0;
    let noGpsCount = 0;

    // Process images in batches
    for (let i = 0; i < imageItems.length; i += this.BATCH_SIZE) {
      const batch = imageItems.slice(i, i + this.BATCH_SIZE);
      
      // Process batch with concurrency limit
      const batchResults = await this.processBatchWithConcurrency(batch, site, searchString);
      
      for (const result of batchResults) {
        if (result.coordinates) {
          const sanitizedImg = sanitizeUrl(result.fileUrl);
          if (sanitizedImg) {
            results.push({
              lat: result.coordinates.lat,
              lon: result.coordinates.lon,
              img: sanitizedImg
            });
          }
        } else {
          noGpsCount++;
        }
        processedCount++;
      }

      // Progress logging
      if (processedCount % 100 === 0 || processedCount === imageItems.length) {
        console.log(`Processed ${processedCount}/${imageItems.length} images`);
      }

      // Small delay between batches to prevent overwhelming the browser
      if (i + this.BATCH_SIZE < imageItems.length) {
        await this.delay(this.BATCH_DELAY);
      }
    }

    // Add error messages
    if (noGpsCount === 1) {
      errors.push(`1 image has no EXIF GPS data and will not be displayed.`);
    } else if (noGpsCount > 1) {
      errors.push(`${noGpsCount} images have no EXIF GPS data and will not be displayed.`);
    }

    console.log(`EXIF processing complete. Processed: ${processedCount} images`);

    return { items: results, errors };
  }

  // Process a batch of images with concurrency control
  private async processBatchWithConcurrency(
    batch: any[], 
    site: string, 
    searchString: string
  ): Promise<Array<{ coordinates: IGPSCoordinates | null, fileUrl: string }>> {
    const results: Array<{ coordinates: IGPSCoordinates | null, fileUrl: string }> = [];
    
    // Process items in smaller concurrent groups
    for (let i = 0; i < batch.length; i += this.MAX_CONCURRENT) {
      const concurrentBatch = batch.slice(i, i + this.MAX_CONCURRENT);
      
      const promises = concurrentBatch.map(async (item) => {
        const relativeFileRef = item.FileRef.replace(searchString, '');
        const fileUrl = `${site}/${relativeFileRef}`;
        
        // Extract from EXIF
        const coordinates = await this.extractGPSFromExifOptimized(fileUrl);
        
        return { coordinates, fileUrl };
      });

      const concurrentResults = await Promise.all(promises);
      results.push(...concurrentResults);
    }

    return results;
  }

  // Extract GPS from EXIF with better error handling and timeouts
  private extractGPSFromExifOptimized(imageUrl: string): Promise<IGPSCoordinates | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Set timeout to prevent hanging on slow images
      const timeout = setTimeout(() => {
        resolve(null);
      }, 15000); // 10 second timeout

      img.onload = function() {
        clearTimeout(timeout);
        
        try {
          EXIF.getData(img as any, function() {
            const lat = EXIF.getTag(this, 'GPSLatitude');
            const lon = EXIF.getTag(this, 'GPSLongitude');
            const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
            const lonRef = EXIF.getTag(this, 'GPSLongitudeRef')
            
            if (lat && lon) {
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
        } catch (error) {
          console.warn(`EXIF extraction failed for ${imageUrl}:`, error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  }

  // Utility methods
  private static convertDMSToDD(dms: number[], ref: string): number | null {
    if (!dms || dms.length !== 3) return null;
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  }

  private isImageFile(fileUrl: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileName = fileUrl.split('/').pop() || fileUrl;
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  private getBounds(items: IMapItem[]): void {
    const bounds: L.LatLng[] = [];
    for (const item of items) {
      bounds.push(L.latLng(item.lat, item.lon));
    }
    if (this.mapViewService) {
      this.mapViewService.setImageBounds(bounds);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}