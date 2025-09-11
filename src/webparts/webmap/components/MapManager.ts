// Handles Leaflet map initialization and management                       
// Manages map layers and base tiles                                        

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IWebmapWebPartProps } from '../types/IWebmapTypes';
import { ArcGISMapService } from '../services/ArcGISMap/ArcGISMapMain';
import { validateArcGISUrl } from '../utils/Security';
import { addWatermark } from '../assets/ViconWatermark';


import { extractArcGISDomain, extractWebmapId } from '../services/ArcGISMap/services/ArcGISUrlService';

import {OPEN_STREET_MAP_TILE, HOCHTIEF_DEFAULT_VIEW } from '../constants/constants';


export class MapManager {
  private map: L.Map | undefined;
  private arcgisMap: ArcGISMapService | undefined;
  private mapId: string;

  constructor(mapId: string) {
    this.mapId = mapId;
  }

  // Initializes or refreshes the Leaflet map instance
  public initializeMap(properties: IWebmapWebPartProps): L.Map {
    if (this.map) {
      this.map.remove(); 
      this.map = undefined;
    }


    // Initialize a new map on the 'map' div, setting an initial view
    this.map = L.map(this.mapId).setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom); // Default view over Hochtief location


    // Add base layer based on map type 
    if (properties.mapType === 'project' && properties.arcgisMapUrl) {
      const mapView = properties.mapView || 'openstreetmap'; // Default to OpenStreetMap if not set
      this.addArcGISLayer(properties.arcgisMapUrl, mapView); // Add ArcGIS layer if map type is 'project'
    } else {
      this.addOpenStreetMapLayer();
    }

    addWatermark(this.map); // Add the Hochtief ViCon watermark to the map

    return this.map;
  }

  
  // Add OpenStreetMap tile layer
  private addOpenStreetMapLayer(): void {
    if (!this.map) return; 

    L.tileLayer(OPEN_STREET_MAP_TILE.url, {
      attribution: OPEN_STREET_MAP_TILE.attribution,
      maxZoom: 19
    }).addTo(this.map);
  }

  private addArcGISLayer(arcgisMapUrl: string, mapView: string): void {
    //  Validate the ArcGIS URL before using it
    const validatedUrl = validateArcGISUrl(arcgisMapUrl);
    
    if (validatedUrl) {
      const webmapId = extractWebmapId(validatedUrl);
      const domain = extractArcGISDomain(validatedUrl);
      
      if (webmapId && domain && this.map) {
        this.arcgisMap = new ArcGISMapService(this.map);
        this.arcgisMap.addArcGISTileLayer(webmapId, domain, mapView);
      } else {
        console.error('Could not extract webmap ID or domain from ArcGIS URL');
        this.addOpenStreetMapLayer();
      }
    } else {
      console.error('Invalid ArcGIS map URL - must be HTTPS and from maps.arcgis.com');
      this.addOpenStreetMapLayer();
    }
  }

  public getMap(): L.Map | undefined {
    return this.map;
  }

  public dispose(): void {
    this.map?.remove();
    this.map = undefined;
    this.arcgisMap = undefined;
  }
}