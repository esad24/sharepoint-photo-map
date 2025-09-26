// Optimized Service for fetching data from SharePoint document libraries
// Handles both manual coordinate and EXIF-based location extraction with performance optimizations

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { escODataIdentifier, sanitizeUrl } from '../utils/Security';
import { IWebmapWebPartProps } from '../types/IWebmapTypes';
import { MapViewService } from './MapViewService';
import { RateLimiter } from '../utils/RateLimit';

import { libraries } from '../cache/SPLibraryItems';


// import { ExifExtraction } from './ExifExtraction';

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
  private mapViewService: MapViewService | undefined;
  //private exifExtraction: ExifExtraction | undefined;
  private rateLimiter: RateLimiter | undefined;
  private cancelProcessing = false;

  constructor(context: WebPartContext, loaderId: string, mapViewService?: MapViewService, rateLimiter?: RateLimiter) {
    this.context = context;
    this.loaderId = loaderId;
    this.mapViewService = mapViewService;
    this.rateLimiter = rateLimiter;
  }

  // Call this when library changes in property pane
  public cancelCurrentProcess(): void {
    this.cancelProcessing = true;
  }

  

  public async fetchMapData(properties: IWebmapWebPartProps): Promise<IDataFetchResult> {
    const result =  await this.fetchDocumentLibraryData(properties);
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


    // fetching from Cache instead of reloading -> currently doesnt work somehow
    
    // if (libraries[properties.libraryName] && libraries[properties.libraryName].items.length > 0) {
    //   console.log(`${properties.libraryName} already loaded, skipping fetch.`);
    //   console.log(libraries[properties.libraryName]);
    //   await new Promise(resolve => setTimeout(resolve, 5000)); // pause 500ms
    //   return libraries[properties.libraryName];
    // }



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
        
        await this.rateLimiter?.checkRateLimit();

        const response: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
        this.rateLimiter?.incrementRequestCount();
        if (!response.ok) throw new Error(`Error fetching items: ${response.statusText}`);

        const json = await response.json();
        allItems = allItems.concat(json.value);
        url = json['@odata.nextLink'] || null;
      }

      const noGpsCount = 0;

      if (locationMethod === 'manual') {
        // Manual coordinates from fields
        for (const item of allItems) {
          const img = this.buildFileUrl(item.FileRef, site);
          if (!this.isImageFile(img)) continue;

          const lat = parseFloat((item[latField!] as string).replace(',', '.'));
          const lon = parseFloat((item[lonField!] as string).replace(',', '.'));

          if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

          const sanitizedImg = sanitizeUrl(img);
          if (!sanitizedImg) continue;

          result.items.push({ 
            lat, 
            lon, 
            img: sanitizedImg 
          });
        }
      } 

      /*
      // Image Exif processing currently not production ready

      else {
        this.exifExtraction = new ExifExtraction(allItems, this.context, this.loaderId, this.rateLimiter);
        const processed = await this.exifExtraction.processExifImages();

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
      */

    } catch (err) {
      //result.errors.push('Failed to load images from document library');
    }

    this.getBounds(result.items);
    libraries[libraryName] = result;
    return result;
  }

  

  // build full file URL
  private buildFileUrl(fileRef: string, site: string): string {
    const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
    const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';
    const relativeFileRef = fileRef.replace(searchString, '');
    return `${site}/${relativeFileRef}`;
  }

  // Checks if a file is an image
  private isImageFile(fileUrl: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
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
