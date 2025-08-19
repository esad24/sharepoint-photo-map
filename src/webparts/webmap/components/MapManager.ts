/* ========================================================================== */
/* MapManager.ts                                                              */
/* - Handles Leaflet map initialization and management                        */
/* - Manages map layers and base tiles                                        */
/* ========================================================================== */

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IWebmapWebPartProps } from '../types/IWebmapTypes';
import { ArcGISMapService } from '../services/ArcGISMap/ArcGISMapMain';
import { validateArcGISUrl } from '../utils/Security';
import { addWatermark } from '../assets/ViconWatermark';

import { MapViewService } from '../services/MapViewService';

const HOCHTIEF_DEFAULT_VIEW = {
  lat: 51.4239,    // Hochtief headquarters latitude
  lon: 6.9985,     // Hochtief headquarters longitude
  zoom: 15         // Default zoom level
};

const OPEN_STREET_MAP_TILE_URL = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'; // OpenStreetMap tile URL

export class MapManager {
  private map: L.Map | undefined;
  private arcgisMap: ArcGISMapService | undefined;
  private mapId: string;

  constructor(mapId: string) {
    this.mapId = mapId;
  }

  /**
   * Initializes or refreshes the Leaflet map instance. This method handles
   * cleanup of old instances and setup of the map, layers, and events.
   */
  public initializeMap(properties: IWebmapWebPartProps): L.Map {
    /* 1. Dispose previous instance (avoid "Map container is already initialized") */
    if (this.map) {
      this.map.remove(); // Clean up all map resources and event listeners
      this.map = undefined; // Clear the reference
    }

    /* 2. Create fresh map */
    // Initialize a new map on the 'map' div, setting an initial view (coordinates and zoom level).
    this.map = L.map(this.mapId).setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom); // Default view over Hochtief location


    /* 3. Add base layer based on map type */
    if (properties.mapType === 'arcgis' && properties.arcgisMapUrl) {
      this.addArcGISLayer(properties.arcgisMapUrl);
    } else {
      this.addOpenStreetMapLayer();
    }

    /* 4. Add watermark */
    addWatermark(this.map); // Add the ViCon watermark to the map

    return this.map;
  }

  /**
   * Add OpenStreetMap tile layer
   * OpenStreetMap is a free, community-driven mapping service
   * It's very reliable and doesn't require any API keys or authentication
   */
  private addOpenStreetMapLayer(): void {
    if (!this.map) return; // Safety check - exit if map doesn't exist
    
    // Add OpenStreetMap tiles to the map
    // {s} is replaced by a, b, or c for load balancing across servers
    // {z}/{x}/{y} are replaced by zoom level and tile coordinates
    L.tileLayer(OPEN_STREET_MAP_TILE_URL, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors', // Legal attribution required by OSM
    }).addTo(this.map);
  }

  private addArcGISLayer(arcgisMapUrl: string): void {
    //  Validate the ArcGIS URL before using it
    const validatedUrl = validateArcGISUrl(arcgisMapUrl);
    
    if (validatedUrl) {
      // Use your existing extraction methods (they're fine)
      const webmapId = this.extractWebmapId(validatedUrl);
      const domain = this.extractArcGISDomain(validatedUrl);
      
      if (webmapId && domain && this.map) {
        this.arcgisMap = new ArcGISMapService(this.map);
        this.arcgisMap.addArcGISTileLayer(webmapId, domain);
      } else {
        console.error('Could not extract webmap ID or domain from ArcGIS URL');
        this.addOpenStreetMapLayer();
      }
    } else {
      console.error('Invalid ArcGIS map URL - must be HTTPS and from maps.arcgis.com');
      this.addOpenStreetMapLayer();
    }
  }

  // Add a method to set MapViewService on the ArcGIS service after creation
  public setMapViewService(mapViewService: MapViewService): void {
    if (this.arcgisMap) {
      this.arcgisMap.setMapViewService(mapViewService);
    }
  }

  /**
   * Extract webmap ID from ArcGIS URL
   */
  private extractWebmapId(url: string): string | null {
    if (!url) return null; // Return null if no URL provided
    
    // Pattern: https://{domain}.maps.arcgis.com/apps/mapviewer/index.html?webmap={webmap_id}
    // This regex pattern matches the standard ArcGIS web map URL format
    const urlPattern = /https?:\/\/[^\/]+\.maps\.arcgis\.com\/apps\/mapviewer\/index\.html\?webmap=([a-zA-Z0-9]+)/;
    const match = url.match(urlPattern);
    
    if (match && match[1]) {
      return match[1]; // Return the captured webmap ID
    }
    
    // Also check for webmap ID in other common ArcGIS URL formats
    // Sometimes the URL might be formatted differently
    const webmapPattern = /webmap=([a-zA-Z0-9]+)/;
    const webmapMatch = url.match(webmapPattern);
    
    if (webmapMatch && webmapMatch[1]) {
      return webmapMatch[1]; // Return the captured webmap ID
    }
    
    return null; // No valid webmap ID found
  }

  /**
   * Extract domain from ArcGIS URL
   */
  private extractArcGISDomain(url: string): string | null {
    if (!url) return null; // Return null if no URL provided
    
    // Pattern to extract the domain part (e.g., "hochtiefinfra" from "hochtiefinfra.maps.arcgis.com")
    // This captures the subdomain before .maps.arcgis.com
    const domainPattern = /https?:\/\/([^\/]+)\.maps\.arcgis\.com/;
    const match = url.match(domainPattern);
    
    if (match && match[1]) {
      return match[1]; // Return the captured domain
    }
    
    return null; // No valid domain found
  }

  public getMap(): L.Map | undefined {
    return this.map;
  }

  public dispose(): void {
    // Completely remove the map instance and its event listeners.
    // The ?. operator safely calls remove() only if map exists
    this.map?.remove();
    this.map = undefined;
    this.arcgisMap = undefined;
  }
}