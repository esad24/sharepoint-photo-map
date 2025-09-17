// Optimized Service for fetching data from SharePoint document libraries
// Handles both manual coordinate and EXIF-based location extraction with performance optimizations

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as exifr from 'exifr';
import pLimit from 'p-limit';
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

export class DataService {
  private context: WebPartContext;
  private mapViewService: MapViewService | undefined;

  private cancelProcessing = false;
  

  constructor(context: WebPartContext, mapViewService?: MapViewService) {
    this.context = context;
    this.mapViewService = mapViewService;
  }

  // Call this when library changes in property pane
  public cancelCurrentProcess() {
    this.cancelProcessing = true;
  }

  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    let result =  await this.fetchDocumentLibraryData(properties);
    if(this.cancelProcessing) {
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
        if (this.cancelProcessing) {
          return result; // stop processing if cancelled
        } 

        const response: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
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

    const LIMIT = pLimit(3); // Limit concurrency
    const BATCH_SIZE = 20; // Process in batches
    const BATCH_DELAY = 1000; // Delay between batches to avoid throttling
    const total = allItems.length;
    let completed = 0;        // Progress counter


    const allResults: { item: any; gps: IGPSCoordinates | null; fileUrl: string }[] = [];

    for(let i = 0; i < total; i += BATCH_SIZE) {
      if (this.cancelProcessing) {
        break; // stop processing if cancelled
      }

      const batch = allItems.slice(i, i + BATCH_SIZE);

      const tasks = batch.map(item =>
        LIMIT(async () => {
          if (this.cancelProcessing) {
            return { item, gps: null, fileUrl: this.buildFileUrl(item.FileRef, site) };
          }

          const relativeFileRef = item.FileRef.replace(searchString, '');
          const fileUrl = `${site}/${relativeFileRef}`;
          if (!this.isImageFile(fileUrl)) return { item, gps: null, fileUrl };

          const gps = await this.extractGPSFromExif(fileUrl);

          completed++;
          if (completed % 100 === 0 || completed === total) {
            console.log(`${completed}/${total} images processed`);
          }
          return { item, gps, fileUrl };
        })
      );

      const results = await Promise.all(tasks);
      allResults.push(...results);

      // Small pause between batches to avoid SharePoint throttling
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
    return allResults;
  }

  // Extract GPS using exifr from binary
  private async extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const contentType = response.headers.get('content-type');

      if (!response.ok || !contentType?.startsWith('image/')) {
        console.warn('Not an image response:', await response.text());
        return null;
      }

      if (!response.ok) return null;

      const buffer = await response.arrayBuffer();
      const gps = await exifr.gps(buffer);

      if (gps?.latitude && gps?.longitude) {
        return { lat: gps.latitude, lon: gps.longitude };
      }
    } catch (err) {
      console.warn('EXIF parse failed for:', imageUrl, err);
    }
    return null;
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
