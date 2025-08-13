/* ========================================================================== */
/* ArcGISMapService.ts                                                        */
/* - Service class for handling ArcGIS map layers and operations             */
/* - Now accepts webmap ID as parameter instead of hardcoding                */
/* ========================================================================== */

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT IS ARCGIS?
 * ═══════════════════════════════════════════════════════════════════════════
 * ArcGIS is a mapping platform by Esri that allows organizations to create, 
 * manage, and share interactive maps and spatial data.
 * 
 * KEY CONCEPTS:
 * ────────────────────────────────────────────────────────────────────────────
 * • Webmap    - A saved map configuration that includes layers, styling, and settings
 * • Layer     - A collection of geographic features (like roads, buildings, or boundaries)
 * • Feature   - An individual map element (like a specific road or building)
 * • Tile      - Small square images that make up the map background 
 * • Service   - A web endpoint that provides map data or functionality
 */

// Import Leaflet library for map functionality
// Leaflet is a popular open-source JavaScript library for interactive maps
import * as L from 'leaflet';

// Import modularized services
import { FeatureLayerService } from './services/FeatureLayer';
import { MapServiceLayerService } from './services/MapServiceLayer';
import { WebmapData, LayerConfig } from './types/ArcGISTypes';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service class that encapsulates all ArcGIS-specific map functionality
 * This class acts as a bridge between ArcGIS data and the Leaflet map display
 */
export class ArcGISMapService {
  private map: L.Map; // Reference to the Leaflet map instance
  private featureLayerService: FeatureLayerService;
  private mapServiceLayerService: MapServiceLayerService;

  constructor(map: L.Map) {
    this.map = map; // Store map reference for use in methods
    this.featureLayerService = new FeatureLayerService(map);
    this.mapServiceLayerService = new MapServiceLayerService(map);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS - Main entry points for map functionality
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Add ArcGIS tile layer to the map
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT ARE TILES?                                                         │
   * │                                                                         │
   * │ Maps are made up of small square images called "tiles" (usually        │
   * │ 256x256 pixels). When you zoom or pan a map, your browser downloads    │
   * │ the specific tiles needed for that view.                               │
   * └─────────────────────────────────────────────────────────────────────────┘
   * 
   * @param webmapId - The ArcGIS webmap ID extracted from the URL (unique identifier for a saved map)
   * @param domain   - The ArcGIS domain (e.g., 'hochtiefinfra' from 'hochtiefinfra.maps.arcgis.com')
   */
  public addArcGISTileLayer(webmapId: string, domain: string): void {
    // Safety check - ensure all required parameters exist
    if (!this.map || !webmapId || !domain) return;

    // ArcGIS Online tile service URL pattern
    // This uses the standard ArcGIS world topographic basemap 
    // {z} = zoom level (higher numbers = more zoomed in)
    // {y} = tile row (north-south position)  
    // {x} = tile column (east-west position)
    // Leaflet automatically replaces these placeholders with actual values
    const arcgisTileUrl = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';

    try {
      // Add the tile layer to the map
      // This creates the base satellite imagery that other layers will be drawn on top of
      L.tileLayer(arcgisTileUrl, {
        maxZoom: 19,        // Maximum zoom level supported by this tile service
        id: 'arcgis-tiles'  // Identifier for this layer (useful for debugging)
      }).addTo(this.map);

      // Add vector tile layer with proper styling
      // This adds the actual webmap content (roads, buildings, etc.) on top of the base imagery
      this.addArcGISVectorLayer(webmapId, domain);
    } catch (error) {
      // If adding ArcGIS tiles fails, fall back to OpenStreetMap
      console.error('Failed to add ArcGIS tile layer:', error);
      this.addFallbackTileLayer();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS - Internal functionality and utilities
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Fallback tile layer in case ArcGIS fails
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ REDUNDANCY AND RELIABILITY:                                             │
   * │                                                                         │
   * │ Sometimes external services fail or are temporarily unavailable.       │
   * │ This method ensures users always see a map, even if ArcGIS is down.    │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private addFallbackTileLayer(): void {
    if (!this.map) return; // Safety check

    // Add OpenStreetMap as fallback
    // OpenStreetMap is a free, community-driven mapping service
    // It's very reliable and doesn't require any API keys or authentication
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  /**
   * Add ArcGIS vector layer (webmap content)
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS A VECTOR LAYER?                                                 │
   * │                                                                         │
   * │ Unlike tiles (which are images), vector layers contain actual          │
   * │ geometric data:                                                         │
   * │ • Points   (like building locations)                                   │
   * │ • Lines    (like roads or pipelines)                                   │
   * │ • Polygons (like property boundaries or zones)                         │
   * │                                                                         │
   * │ This data can be styled, queried, and interacted with programmatically.│
   * └─────────────────────────────────────────────────────────────────────────┘
   * 
   * @param webmapId - The ArcGIS webmap ID
   * @param domain   - The ArcGIS domain (e.g., 'hochtiefinfra')
   */
  private addArcGISVectorLayer(webmapId: string, domain: string): void {
    // Safety check for required parameters
    if (!this.map || !webmapId || !domain) return;

    // Construct the webmap URL using the provided domain
    // This URL returns JSON data describing the webmap configuration
    const webmapUrl = `https://${domain}.maps.arcgis.com/sharing/rest/content/items/${webmapId}/data?f=json`;
    
    console.log(`Fetching webmap from: ${webmapUrl}`);
    
    // Fetch webmap definition
    fetch(webmapUrl)
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON response
      })
      .then(webmapData => {
        // Validate that we received a valid object
        if (webmapData && typeof webmapData === 'object') {
          console.log('Webmap data:', webmapData);
          
          // Process operational layers from the webmap
          this.processOperationalLayers(webmapData);
          
          // Also check for baseMap layers
          //this.processBasemapLayers(webmapData);
        }
      })
      .catch(error => {
        // Handle errors gracefully - don't crash the entire application
        console.warn('Could not load webmap data:', error);
        console.warn(`Please check if the domain '${domain}' and webmap ID '${webmapId}' are correct.`);
      });
  }

  /**
   * Process operational layers from webmap data
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ OPERATIONAL LAYERS vs BASEMAPS:                                        │
   * │                                                                         │
   * │ • Basemap           - Background imagery (satellite photos, street maps)│
   * │ • Operational layers - The actual data/content you want to display     │
   * │                       (like property boundaries, infrastructure, or    │
   * │                       business locations)                              │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private processOperationalLayers(webmapData: WebmapData): void {
    if (!webmapData.operationalLayers || !Array.isArray(webmapData.operationalLayers)) {
      return;
    }

    // Loop through each layer defined in the webmap
    webmapData.operationalLayers.forEach((layer: any) => {
      console.log('Processing layer:', layer.title, layer.layerType);
      
      // Handle Group Layers (like BR_Leverkusen_01)
      if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
        this.processGroupLayer(layer);
      }
      // Handle direct ArcGIS Feature Layers
      else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
        this.featureLayerService.addArcGISFeatureLayer(layer);
      }
      // Handle direct ArcGIS Map Service Layers
      else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
        this.mapServiceLayerService.addArcGISMapServiceLayer(layer);
      }
    });
  }

  /**
   * Process group layers and their sublayers
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ GROUP LAYERS are like folders that contain multiple related layers      │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private processGroupLayer(layer: any): void {
    console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
    
    // Process each sublayer within the group
    layer.layers.forEach((sublayer: any) => {
      console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
      
      // Feature layers contain vector data (points, lines, polygons)
      // These are individual geographic features that can be styled and queried
      if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
        // Remove the visibility check - load all layers
        // This ensures all layers are loaded regardless of their default visibility
        // (Users can turn layers on/off later if needed)
        this.featureLayerService.addArcGISFeatureLayer(sublayer);
      }
    });
  }

  /**
   * Process basemap layers from webmap data
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ Basemaps provide the background imagery or reference layers             │
   * │ (like satellite imagery, street maps, or topographic maps)             │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private processBasemapLayers(webmapData: WebmapData): void {
    if (!webmapData.baseMap || !webmapData.baseMap.baseMapLayers || !Array.isArray(webmapData.baseMap.baseMapLayers)) {
      return;
    }

    webmapData.baseMap.baseMapLayers.forEach((layer: any) => {
      if (layer && layer.url) {
        this.mapServiceLayerService.addArcGISMapServiceLayer(layer);
      }
    });
  }
}