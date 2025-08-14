/* ========================================================================== */
/* services/MapServiceLayerService.ts                                         */
/* - Service for handling ArcGIS map service layer operations                 */
/* ========================================================================== */

import * as L from 'leaflet';
import { LayerConfig } from '../../types/ArcGISTypes';

export class MapServiceLayerService {
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
  }

  /**
   * Add an ArcGIS Map Service Layer
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS A MAP SERVICE LAYER?                                            │
   * │                                                                         │
   * │ Unlike feature layers (which send individual features), map service     │
   * │ layers provide pre-rendered images (tiles) of the map data. This is     │
   * │ like the difference between:                                            │
   * │ • Feature Layer: Sending you the blueprints to draw a house             │
   * │ • Map Service:   Sending you a photograph of the house                  │
   * │                                                                         │
   * │ WHEN TO USE MAP SERVICES:                                               │
   * │ • When you have complex data that would be slow to render as            │
   * │   individual features                                                   │
   * │ • When you don't need to interact with individual features              │
   * │ • When you want consistent styling that matches the original ArcGIS     │
   * │   map                                                                   │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  public addArcGISMapServiceLayer(layerConfig: LayerConfig): void {
    // Safety checks
    if (!this.map || !layerConfig) return;

    const baseUrl = layerConfig.url;
    if (!baseUrl) return;
    
    console.log(`Adding map service layer: ${layerConfig.title} from ${baseUrl}`);
    
    // For each sublayer, add as a tile layer
    // Map services can contain multiple sublayers (like separate layers for roads, labels, boundaries)
    if (layerConfig.layers && Array.isArray(layerConfig.layers)) {
      this.addMapServiceSublayers(layerConfig, baseUrl);
    } else {
      // If no sublayers defined, try to add the entire service as one tile layer
      this.addSingleMapServiceLayer(layerConfig, baseUrl);
    }
  }

  /**
   * Add sublayers from a map service
   */
  private addMapServiceSublayers(layerConfig: LayerConfig, baseUrl: string): void {
    layerConfig.layers!.forEach((sublayer: any) => {
      // Only add sublayers that are visible by default and have a valid ID
      if (sublayer && sublayer.defaultVisibility && typeof sublayer.id !== 'undefined') {
        // Construct tile URL pattern for this specific sublayer
        // The server will generate tiles on-demand for this sublayer
        // {z}/{y}/{x} will be replaced by Leaflet with actual tile coordinates
        const tileUrl = `${baseUrl}/${sublayer.id}/tile/{z}/{y}/{x}`;
        
        // Create and add tile layer to the map
        L.tileLayer(tileUrl, {
          opacity: layerConfig.opacity || 1, // Layer transparency (0 = invisible, 1 = fully opaque)
          attribution: 'ArcGIS Map Service'  // Credit text shown in map corner
        }).addTo(this.map!);
        
        console.log(`Added sublayer ${sublayer.id} as tile layer`);
      }
    });
  }

  /**
   * Add a single map service layer (no sublayers)
   */
  private addSingleMapServiceLayer(layerConfig: LayerConfig, baseUrl: string): void {
    // Some map services are simple and don't have multiple sublayers
    const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`;
    
    L.tileLayer(tileUrl, {
      opacity: layerConfig.opacity || 1,
      attribution: 'ArcGIS Map Service'
    }).addTo(this.map!);
    
    console.log(`Added map service as tile layer: ${layerConfig.title}`);
  }
}