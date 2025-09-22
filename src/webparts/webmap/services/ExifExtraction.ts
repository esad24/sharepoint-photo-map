// Image Exif processing currently not production ready
// commented out for future use

/*

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { RateLimiter } from '../utils/RateLimit';
import { updateLoader } from '../utils/loader';


import * as exifr from 'exifr';
import pLimit from 'p-limit';

export interface IGPSCoordinates {
    lat: number;
    lon: number;
}


export class ExifExtraction {
    private readonly LIMIT = pLimit(3); // Limit concurrency
    private readonly BATCH_SIZE = 20; // Process in batches
    private readonly BATCH_DELAY = 1500; // Delay between batches to avoid throttling
    
    private cancelProcessing = false;

    private allItems: any[] = [];
    private context: WebPartContext;
    private rateLimiter: RateLimiter | undefined;
    private loaderId: string;


    private fails = 0;

    constructor(allItems: any[],  context: WebPartContext, loaderId: string, rateLimiter?: RateLimiter) {
        this.context = context;
        this.loaderId = loaderId;
        this.rateLimiter = rateLimiter;
    }

    // Call this when library changes in property pane
    public cancelCurrentProcess() {
    this.cancelProcessing = true;
    }
    
    // Process images with EXIF extraction in parallel
    public async processExifImages(): Promise<{ item: any; gps: IGPSCoordinates | null; fileUrl: string }[]> {
        const site = this.context.pageContext.web.absoluteUrl;
        const siteServerRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
        const searchString = siteServerRelativeUrl === '/' ? '/' : siteServerRelativeUrl + '/';


        const total = this.allItems.length;
        let completed = 0;        // Progress counter



        const allResults: { item: any; gps: IGPSCoordinates | null; fileUrl: string }[] = [];

        for(let i = 0; i < total; i += this.BATCH_SIZE) {
        if (this.cancelProcessing) {
                return allResults; // stop processing if cancelled
        }

        const batch = this.allItems.slice(i, i + this.BATCH_SIZE);

        const tasks = batch.map(item =>
            this.LIMIT(async () => {
            if (this.cancelProcessing) {
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
        //await new Promise(resolve => setTimeout(resolve, this.BATCH_DELAY));
        }
        return allResults;
    }

    // Extract GPS using exifr from binary with throttling handling
    private async extractGPSFromExif(imageUrl: string): Promise<IGPSCoordinates | null> {
        if( this.cancelProcessing) {
        return null; // stop processing if cancelled
        }
        try {
        await this.rateLimiter?.checkRateLimit();
        const response = await fetch(imageUrl, { 
            mode: 'cors',
            headers: {
            Range: 'bytes=0-65535' // Fetch only the first 64KB to reduce data usage
            }
        });

        this.rateLimiter?.incrementRequestCount();
        


        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType?.startsWith('image/')) {
            const text = await response.text();

            if(text.includes('throttleerror')) {
            console.warn('SharePoint throttling detected', await response.text());
            this.fails++;
            await this.rateLimiter?.checkRateLimit(); 
            }

            if(this.fails > 3) {
            this.cancelProcessing = true;
            return null;
            }
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
}

*/