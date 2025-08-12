/* ========================================================================== */
/* ArcGISMapService.ts                                                        */
/* - Service class for handling ArcGIS map layers and operations             */
/* - Now uses basemap from webmap JSON instead of hardcoded World Imagery    */
/* ========================================================================== */

/*
 * WHAT IS ARCGIS?
 * ArcGIS is a mapping platform by Esri that allows organizations to create, manage, 
 * and share interactive maps and spatial data. 
 * 
 * KEY CONCEPTS:
 * - Webmap: A saved map configuration that includes layers, styling, and settings
 * - Layer: A collection of geographic features (like roads, buildings, or boundaries)
 * - Feature: An individual map element (like a specific road or building)
 * - Tile: Small square images that make up the map background 
 * - Service: A web endpoint that provides map data or functionality
 */

// Import Leaflet library for map functionality
// Leaflet is a popular open-source JavaScript library for interactive maps
import * as L from 'leaflet';

import * as esri from 'esri-leaflet';
import * as esriVector from 'esri-leaflet-vector';

// Service class that encapsulates all ArcGIS-specific map functionality
// This class acts as a bridge between ArcGIS data and the Leaflet map display
export class ArcGISMapService {
  private map: L.Map; // Reference to the Leaflet map instance

  constructor(map: L.Map) {
    this.map = map; // Store map reference for use in methods
  }

  /**
   * Load ArcGIS webmap with proper basemap and operational layers
   * 
   * CHANGED APPROACH:
   * Instead of adding hardcoded World Imagery first, we now:
   * 1. Fetch the webmap JSON data first
   * 2. Add the basemap defined in the JSON
   * 3. Then add operational layers on top
   * 
   * @param webmapId The ArcGIS webmap ID extracted from the URL (unique identifier for a saved map)
   * @param domain The ArcGIS domain (e.g., 'hochtiefinfra' from 'hochtiefinfra.maps.arcgis.com')
   */
  public loadArcGISWebmap(webmapId: string, domain: string): void {
    // Safety check - ensure all required parameters exist
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
          
          // STEP 1: Add basemap layers first (these go on the bottom)
          this.addBasemapLayers(webmapData);
          
          // STEP 2: Add operational layers on top of the basemap
          this.addOperationalLayers(webmapData);
        }
      })
      .catch(error => {
        // Handle errors gracefully - don't crash the entire application
        console.warn('Could not load webmap data:', error);
        console.warn(`Please check if the domain '${domain}' and webmap ID '${webmapId}' are correct.`);
        // Fallback to OpenStreetMap if webmap loading fails
        this.addFallbackTileLayer();
      });
  }

  /**
   * Add basemap layers from webmap JSON data
   * 
   * BASEMAP PRIORITY:
   * Basemaps provide the background imagery or reference layers and should be added first.
   * They typically include satellite imagery, street maps, or topographic maps.
   */
  private addBasemapLayers(webmapData: any): void {
    if (!webmapData.baseMap) {
      console.log('No basemap found in webmap data, using fallback');
      this.addFallbackTileLayer();
      return;
    }

    const baseMap = webmapData.baseMap;
    console.log('Found basemap:', baseMap.title || 'Unnamed basemap');

    // Handle baseMapLayers array
    if (baseMap.baseMapLayers && Array.isArray(baseMap.baseMapLayers)) {
      let basemapAdded = false;
      
      baseMap.baseMapLayers.forEach((layer: any, index: number) => {
        console.log(`Processing basemap layer ${index + 1}:`, layer.title || 'Unnamed', layer.layerType);
        
        if (layer && ( layer.url || layer.styleUrl)) {
          // Handle different types of basemap layers
          if (layer.layerType === 'ArcGISTiledMapServiceLayer') {
            this.addArcGISTiledLayer(layer);
            basemapAdded = true;
          } 
          else if (layer.layerType === 'VectorTileLayer') {
            try {
              console.log(`Adding vector tile layer: ${layer.title || 'Unnamed'} from ${layer.styleUrl}`);
              this.addVectorTileLayer(layer);
              basemapAdded = true;
            }
            catch (error) {
              console.error('Failed to add vector tile layer:', error);

            }


          } else {
            // Try to add as a generic map service layer
            this.addArcGISMapServiceLayer(layer);
            basemapAdded = true;
          }
        }
      });

      // If no basemap layers were successfully added, use fallback
      if (!basemapAdded) {
        console.log('No valid basemap layers found, using fallback');
        this.addFallbackTileLayer();
      }
    } else {
      // No basemap layers array found
      console.log('No baseMapLayers array found, using fallback');
      this.addFallbackTileLayer();
    }
  }

  /**
   * Add operational layers from webmap JSON data
   * 
   * OPERATIONAL LAYERS:
   * These contain the actual data/content you want to display on top of the basemap
   * (like property boundaries, infrastructure, or business locations)
   */
  private addOperationalLayers(webmapData: any): void {
    // Process operational layers from the webmap
    if (webmapData.operationalLayers && Array.isArray(webmapData.operationalLayers)) {
      // Loop through each layer defined in the webmap
      webmapData.operationalLayers.forEach((layer: any) => {
        console.log('Processing operational layer:', layer.title, layer.layerType);
        
        // Handle Group Layers (like BR_Leverkusen_01)
        if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
          console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
          
          // Process each sublayer within the group
          layer.layers.forEach((sublayer: any) => {
            console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
            
            if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
              this.addArcGISFeatureLayer(sublayer);
            }
          });
        }
        // Handle direct ArcGIS Feature Layers
        else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
          this.addArcGISFeatureLayer(layer);
        }
        // Handle direct ArcGIS Map Service Layers
        else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
          this.addArcGISMapServiceLayer(layer);
        }
      });
    }
  }

  /**
   * Add ArcGIS Tiled Map Service Layer (common basemap type)
   * 
   * TILED MAP SERVICES:
   * These are pre-rendered tile caches that provide fast loading basemaps
   * Common examples: World Imagery, World Street Map, World Topographic Map
   */
  private addArcGISTiledLayer(layerConfig: any): void {
    if (!this.map || !layerConfig || !layerConfig.url) return;

    console.log(`Adding tiled basemap layer: ${layerConfig.title || 'Unnamed'} from ${layerConfig.url}`);

    try {
      // Construct tile URL pattern
      // Some services use /tile/{z}/{y}/{x}, others might use different patterns
      let tileUrl = layerConfig.url;
      
      // Ensure the URL ends with the proper tile pattern
      if (!tileUrl.includes('/tile/{z}')) {
        // Remove trailing slash if present
        tileUrl = tileUrl.replace(/\/$/, '');
        // Add tile pattern
        tileUrl = `${tileUrl}/tile/{z}/{y}/{x}`;
      }

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 18,
        opacity: layerConfig.opacity !== undefined ? layerConfig.opacity : 1,
        attribution: layerConfig.title || 'ArcGIS Basemap'
      });

      tileLayer.addTo(this.map);
      console.log(`✓ Successfully added tiled basemap: ${layerConfig.title || 'Unnamed'}`);
      
    } catch (error) {
      console.error('Failed to add tiled basemap layer:', error);
      // Don't add fallback here - let the parent method handle it
    }
  }

/**
 * Add ArcGIS Vector Tile Layer
 * 
 * VECTOR TILE LAYERS:
 * These are modern basemaps that use vector data instead of raster tiles
 * They provide crisp rendering at any zoom level and support dynamic styling
 */
private addVectorTileLayer(layerConfig: any): void {
  if (!this.map || !layerConfig) {
    console.warn('No map or layer configuration provided for vector tile layer.');
    return;
  }

  // Vector tile layers can have either styleUrl or url
  const styleUrl = layerConfig.styleUrl || layerConfig.url;
  
  if (!styleUrl) {
    console.warn('Vector tile layer has no styleUrl or url:', layerConfig.title || 'Unnamed');
    return;
  }

  console.log(`Adding vector tile layer: ${layerConfig.title || 'Unnamed'} from ${styleUrl}`);

  try {
    // Use esri-leaflet-vector to add the vector tile layer
    const vectorTileLayer = esriVector.vectorTileLayer(styleUrl, {
      opacity: layerConfig.opacity !== undefined ? layerConfig.opacity : 1,
      pane: 'tilePane'
    });

    vectorTileLayer.addTo(this.map);
    console.log(`✓ Successfully added vector tile layer: ${layerConfig.title || 'Unnamed'}`);
    
  } catch (error) {
    console.error('Failed to add vector tile layer:', error);
    
    // Fallback to trying it as a regular tile layer
    try {
      // If vector tiles fail, try as a regular tiled layer
      const tiledLayer = esri.tiledMapLayer({
        url: styleUrl.replace('/resources/styles/root.json', ''),
        opacity: layerConfig.opacity !== undefined ? layerConfig.opacity : 1
      });
      
      tiledLayer.addTo(this.map);
      console.log(`✓ Added as tiled layer instead: ${layerConfig.title || 'Unnamed'}`);
    } catch (fallbackError) {
      console.error('Failed to add as tiled layer:', fallbackError);
    }
  }
}


  /**
   * Fallback tile layer in case basemap loading fails
   */
  private addFallbackTileLayer(): void {
    if (!this.map) return;

    console.log('Adding fallback OpenStreetMap layer');

    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  /**
   * Convert ESRI color array to CSS color string
   */
  private esriColorToCSS(esriColor: number[]): string {
    if (!esriColor || esriColor.length < 3) return '#3388ff';
    
    const [r, g, b, a = 255] = esriColor;
    
    if (a < 255) {
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Get layer styling information from ArcGIS service
   */
  private async getLayerDrawingInfo(serviceUrl: string): Promise<any> {
    try {
      const url = String(serviceUrl);
      const layerInfoUrl = url.indexOf('?') !== -1 ? `${url}&f=json` : `${url}?f=json`;
      console.log('Fetching layer info from:', layerInfoUrl);
      
      const response = await fetch(layerInfoUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch layer info: ${response.status}`);
        return null;
      }
      
      const layerInfo = await response.json();
      console.log('Layer info:', layerInfo);
      
      return layerInfo.drawingInfo || null;
    } catch (error) {
      console.error('Failed to get layer drawing info:', error);
      return null;
    }
  }

  /**
   * Create style function for GeoJSON layer based on ArcGIS renderer
   */
  private createStyleFunction(drawingInfo: any): (feature: any) => any {
    return (feature: any) => {
      const defaultStyle = {
        color: '#3388ff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4,
        fillColor: '#3388ff'
      };

      if (!drawingInfo || !drawingInfo.renderer) {
        return defaultStyle;
      }

      const renderer = drawingInfo.renderer;
      
      if (renderer.type === 'uniqueValue') {
        const fieldValue = feature.properties[renderer.field1];
        
        const matchingInfo = renderer.uniqueValueInfos?.find((info: any) => 
          info.value === fieldValue || info.value === String(fieldValue)
        );
        
        if (matchingInfo && matchingInfo.symbol) {
          return this.convertEsriSymbolToLeafletStyle(matchingInfo.symbol);
        }
        
        if (renderer.defaultSymbol) {
          return this.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
        }
      }
      
      if (renderer.type === 'simple' && renderer.symbol) {
        return this.convertEsriSymbolToLeafletStyle(renderer.symbol);
      }
      
      return defaultStyle;
    };
  }

  /**
   * Convert ESRI symbol to Leaflet style
   */
  private convertEsriSymbolToLeafletStyle(symbol: any): any {
    const style: any = {};
    
    if (symbol.type === 'esriSLS') {
      style.color = this.esriColorToCSS(symbol.color);
      style.weight = symbol.width || 2;
      style.opacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
      
      if (symbol.style === 'esriSLSDash') {
        style.dashArray = '5,5';
      } else if (symbol.style === 'esriSLSDot') {
        style.dashArray = '2,2';
      } else if (symbol.style === 'esriSLSDashDot') {
        style.dashArray = '5,2,2,2';
      }
    } 
    else if (symbol.type === 'esriSFS') {
      style.fillColor = this.esriColorToCSS(symbol.color);
      style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
      
      if (symbol.outline) {
        style.color = this.esriColorToCSS(symbol.outline.color);
        style.weight = symbol.outline.width || 1;
        style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
          symbol.outline.color[3] / 255 : 1;
      }
    } 
    else if (symbol.type === 'esriSMS') {
      style.radius = symbol.size || 6;
      style.fillColor = this.esriColorToCSS(symbol.color);
      style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
      
      if (symbol.outline) {
        style.color = this.esriColorToCSS(symbol.outline.color);
        style.weight = symbol.outline.width || 1;
        style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
          symbol.outline.color[3] / 255 : 1;
      }
    }
    
    return style;
  }

  /**
   * Add an ArcGIS Feature Layer with proper styling (Optimized for performance)
   */
   private async addArcGISFeatureLayer(layerConfig: any): Promise<void> {
    if (!this.map || !layerConfig || !layerConfig.url) return;

    const featureServiceUrl = layerConfig.url;
    console.log(`Loading feature layer: ${layerConfig.title} from ${featureServiceUrl}`);
    
    try {
        const layerInfoUrl = `${featureServiceUrl}?f=json`;
        const infoResponse = await fetch(layerInfoUrl);
        const layerInfo = await infoResponse.json();
      
        const maxRecordCount = layerInfo.maxRecordCount || 1000;
        const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);
        
        let allFeatures: any[] = [];
        let resultOffset = 0;
        let hasMore = true;

        while (hasMore) {
            const queryParams = new URLSearchParams({
                'where': '1=1',
                'outFields': 'Layer,RefName,Entity',
                'f': 'geojson',
                'outSR': '4326',
                'returnGeometry': 'true',
                'resultOffset': resultOffset.toString(),
                'resultRecordCount': maxRecordCount.toString(),
                'geometryPrecision': '6'
            });

            const queryUrl = `${featureServiceUrl}/query?${queryParams.toString()}`;
            const response = await fetch(queryUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const geojsonData = await response.json();

            if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
                allFeatures = allFeatures.concat(geojsonData.features);
                resultOffset += geojsonData.features.length;
                hasMore = geojsonData.features.length === maxRecordCount;
            } else {
                hasMore = false;
            }
        }

        console.log(`Total features fetched for ${layerConfig.title}: ${allFeatures.length}`);
        
        if (allFeatures.length > 0) {
            const completeGeoJSON = {
                type: 'FeatureCollection' as const,
                features: allFeatures
            } as any;
            
            const styleFunction = this.createStyleFunction(drawingInfo);
            
            const geoJsonLayer = L.geoJSON(completeGeoJSON, {
                style: (feature) => {
                    const style = styleFunction(feature);
                    if (layerConfig.title && layerConfig.title.includes('Polys')) {
                        style.fillOpacity = style.fillOpacity || 0.6;
                        style.weight = style.weight || 1;
                    }
                    return style;
                },
                pointToLayer: (feature, latlng) => {
                    const style = styleFunction(feature);
                    return L.circleMarker(latlng, style);
                },
                interactive: false,
                bubblingMouseEvents: false
            });

            geoJsonLayer.addTo(this.map!);
            console.log(`✓ Successfully added feature layer: ${layerConfig.title} with ${allFeatures.length} features`);
        }
    } 
    catch (error) {
            console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
    }
  }

  /**
   * Add an ArcGIS Map Service Layer
   */
  private addArcGISMapServiceLayer(layerConfig: any): void {
    if (!this.map || !layerConfig) return;

    const baseUrl = layerConfig.url;
    if (!baseUrl) return;
    
    console.log(`Adding map service layer: ${layerConfig.title} from ${baseUrl}`);
    
    if (layerConfig.layers && Array.isArray(layerConfig.layers)) {
      layerConfig.layers.forEach((sublayer: any) => {
        if (sublayer && sublayer.defaultVisibility && typeof sublayer.id !== 'undefined') {
          const tileUrl = `${baseUrl}/${sublayer.id}/tile/{z}/{y}/{x}`;
          
          L.tileLayer(tileUrl, {
            opacity: layerConfig.opacity || 1,
            attribution: 'ArcGIS Map Service'
          }).addTo(this.map!);
          
          console.log(`Added sublayer ${sublayer.id} as tile layer`);
        }
      });
    } else {
      const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`;
      
      L.tileLayer(tileUrl, {
        opacity: layerConfig.opacity || 1,
        attribution: 'ArcGIS Map Service'
      }).addTo(this.map!);
      
      console.log(`Added map service as tile layer: ${layerConfig.title}`);
    }
  }
}