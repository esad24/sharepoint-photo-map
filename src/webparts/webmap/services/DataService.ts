// Optimized Service for fetching data from SharePoint document libraries
// Handles both manual coordinate and EXIF-based location extraction with performance optimizations

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as exifr from 'exifr';
import pLimit from 'p-limit';
import { escODataIdentifier, sanitizeUrl } from '../utils/Security';
import { IWebmapWebPartProps } from '../types/IWebmapTypes';
import { MapViewService } from './MapViewService';
import { updateLoader } from '../utils/loader';

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

export class DataService {
  private context: WebPartContext;
  private loaderId: string;
  private loader: HTMLElement | null;
  private mapViewService: MapViewService | undefined;

  private cancelProcessing = false;
  
  private readonly LIMIT = pLimit(3); // Limit concurrency
  private readonly BATCH_SIZE = 20; // Process in batches
  private readonly BATCH_DELAY = 1000; // Delay between batches to avoid throttling
  private fails = 0; // Track failed attempts due to throttling

  // Sharepoint API Limit: 3000 calls per 5 minutes
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly WINDOW_SIZE = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_REQUESTS_PER_WINDOW = 2800; // Buffer below 3000 limit

  constructor(context: WebPartContext, loaderId: string, mapViewService?: MapViewService) {
    this.context = context;
    this.loaderId = loaderId;
    this.loader= document.getElementById(this.loaderId);
    this.mapViewService = mapViewService;
  }

  // Call this when library changes in property pane
  public cancelCurrentProcess() {
    this.cancelProcessing = true;
  }

  // Check if we're approaching rate limits
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset window if 5 minutes have passed
    if (now - this.windowStart >= this.WINDOW_SIZE) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    // If we're approaching the limit, wait until next window
    if (this.requestCount >= this.MAX_REQUESTS_PER_WINDOW) {
      const timeToWait = this.WINDOW_SIZE - (now - this.windowStart);
      if (timeToWait > 0) {
        updateLoader(this.loaderId, `Rate limit reached. Waiting ${Math.ceil(timeToWait / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, timeToWait));
        this.requestCount = 0;
        this.windowStart = Date.now();
      }
    }
  }

  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    let result =  await this.fetchDocumentLibraryData(properties);
    if(this.cancelProcessing || this.fails >= 3) {
      return { items: [], errors: [] };
    }
    return result;
  }

  // Fetch data from a SharePoint Document Library
  private async fetchDocumentLibraryData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const { libraryName, locationMethod, latField, lonField } = properties;
    const result: IDataFetchResult = { items: [], errors: [] };

    if (!libraryName) return result;



    if (locationMethod === 'manual' && (!latField || !lonField)) {
      result.errors.push('Please select both latitude and longitude fields');
      return result;
    }

    const site = this.context.pageContext.web.absoluteUrl;
    if (!site) return result;

    const libraryPart = escODataIdentifier(libraryName);

    try {
      const baseFields = ['FileRef', 'FileLeafRef'];
      if (locationMethod === 'manual' && latField && lonField) {
        baseFields.push(latField, lonField);
      }

      const selectFields = baseFields.map(f => escODataIdentifier(f)).join(',');

      let allItems: any[] = [];
      let url: string | null = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$top=500`;

      // Handle pagination
      while (url) {
        if (this.cancelProcessing || this.fails >= 3) {
          return result; // stop processing if cancelled
        }
        
        await this.checkRateLimit();

        const response: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
        this.requestCount++;
        if (!response.ok) throw new Error(`Error fetching items: ${response.statusText}`);

        const json = await response.json();
        allItems = allItems.concat(json.value);
        url = json['@odata.nextLink'] || null;
      }

      let noGpsCount = 0;

      if (locationMethod === 'manual') {
        // Manual coordinates from fields
        for (const item of allItems) {
          const img = this.buildFileUrl(item.FileRef, site);
          if (!this.isImageFile(img)) continue;

          let lat = parseFloat((item[latField!] as string).replace(',', '.'));
          let lon = parseFloat((item[lonField!] as string).replace(',', '.'));

          if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

          const sanitizedImg = sanitizeUrl(img);
          if (!sanitizedImg) continue;

          result.items.push({ lat, lon, img: sanitizedImg });
        }
      } else {
        // Extract GPS from EXIF metadata in parallel
        const processed = await this.processExifImages(allItems);

        for (const { item, gps, fileUrl } of processed) {
          if (!gps) {
            noGpsCount++;
            continue;
          }

          const sanitizedImg = sanitizeUrl(fileUrl);
          if (!sanitizedImg) continue;

          result.items.push({
            lat: gps.lat,
            lon: gps.lon,
            img: sanitizedImg
          });
        }

        if (noGpsCount === 1) {
          result.errors.push(`1 image has no EXIF GPS data and will not be displayed.`);
        } else if (noGpsCount > 1) {
          result.errors.push(`${noGpsCount} images have no EXIF GPS data and will not be displayed.`);
        }
      }
    } catch (err) {
      console.error('Webmap: document library fetch failed:', err);
      result.errors.push('Failed to load images from document library');
    }

    this.getBounds(result.items);
    return result;
  }

  // Process images with EXIF extraction in parallel
  private async processExifImages(allItems: any[]): Promise<{ item: any; gps: IGPSCoordinates | null; fileUrl: string }[]> {
    const site = this.context.pageContext.web.absoluteUrl;
    const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
    const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';


    const total = allItems.length;
    let completed = 0;        // Progress counter



    const allResults: { item: any; gps: IGPSCoordinates | null; fileUrl: string }[] = [];

    for(let i = 0; i < total; i += this.BATCH_SIZE) {
      if (this.cancelProcessing || this.fails >= 3) {
            return allResults; // stop processing if cancelled
      }

      const batch = allItems.slice(i, i + this.BATCH_SIZE);

      const tasks = batch.map(item =>
        this.LIMIT(async () => {
          if (this.cancelProcessing || this.fails >= 3) {
            return { item, gps: null, fileUrl: this.buildFileUrl(item.FileRef, site) };
          }

          const relativeFileRef = item.FileRef.replace(searchString, '');
          const fileUrl = `${site}/${relativeFileRef}`;
          if (!this.isImageFile(fileUrl)) return { item, gps: null, fileUrl };

          const gps = await this.extractGPSFromExif(fileUrl);

          completed++;
          updateLoader(this.loaderId, `Processing images: ${completed}/${total}`);
          return { item, gps, fileUrl };
        })
      );

      const results = await Promise.all(tasks);
      allResults.push(...results);

      // Small pause between batches to avoid SharePoint throttling
      await new Promise(resolve => setTimeout(resolve, this.BATCH_DELAY));
    }
    return allResults;
  }

  // Extract GPS using exifr from binary with throttling handling
  private async extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
    if( this.cancelProcessing || this.fails >= 3) {
      return null; // stop processing if cancelled
    }
    try {
      await this.checkRateLimit();
      const response = await fetch(imageUrl, { 
        mode: 'cors',
        headers: {
          Range: 'bytes=0-65535' // Fetch only the first 64KB to reduce data usage
        }
      });

      this.requestCount++;
      

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.startsWith('image/')) {
        console.warn('Not an image response:', await response.text());
        this.cancelProcessing = true;
        return null;
      }

      const buffer = await response.arrayBuffer();
      const gps = await exifr.gps(buffer);

      if (gps?.latitude && gps?.longitude) {
        return { lat: gps.latitude, lon: gps.longitude };
      }

      return null; // no GPS data
    } catch (err) {
      console.warn(`EXIF parse failed:`, imageUrl, err);
      return null;
    }
  }

  // Utility: build full file URL
  private buildFileUrl(fileRef: string, site: string): string {
    const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
    const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';
    const relativeFileRef = fileRef.replace(searchString, '');
    return `${site}/${relativeFileRef}`;
  }

  // Checks if a file is an image
  private isImageFile(fileUrl: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileName = fileUrl.split('/').pop() || fileUrl;
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  // Collect coordinates and set bounds
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
