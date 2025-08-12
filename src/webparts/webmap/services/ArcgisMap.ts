/* ========================================================================== */
/* ArcGISMapService.ts - Enhanced with Vector Tile Layer Support              */
/* - Service class for handling ArcGIS map layers and operations             */
/* - Now supports Vector Tile Layers in addition to Feature and Map Service  */
/* ========================================================================== */

/*
 * WHAT ARE VECTOR TILE LAYERS?
 * Vector Tile Layers are a modern approach that combines the best of both worlds:
 * - Performance: Data is pre-packaged into tiles (like Map Services)
 * - Flexibility: Contains actual vector data that can be styled dynamically (like Feature Layers)
 * - Efficiency: Only loads the data needed for the current view
 * 
 * Vector tiles are becoming the standard for modern web mapping applications.
 */

// Import Leaflet library for map functionality
import * as L from 'leaflet';

// Service class that encapsulates all ArcGIS-specific map functionality
export class ArcGISMapService {
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
  }

  public addArcGISTileLayer(webmapId: string, domain: string): void {
    if (!this.map || !webmapId || !domain) return;

    const arcgisTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    try {
      L.tileLayer(arcgisTileUrl, {
        maxZoom: 18,
        id: 'arcgis-tiles'
      }).addTo(this.map);

      this.addArcGISVectorLayer(webmapId, domain);
    } catch (error) {
      console.error('Failed to add ArcGIS tile layer:', error);
      this.addFallbackTileLayer();
    }
  }

  private addFallbackTileLayer(): void {
    if (!this.map) return;

    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private addArcGISVectorLayer(webmapId: string, domain: string): void {
    if (!this.map || !webmapId || !domain) return;

    const webmapUrl = `https://${domain}.maps.arcgis.com/sharing/rest/content/items/${webmapId}/data?f=json`;
    
    console.log(`Fetching webmap from: ${webmapUrl}`);
    
    fetch(webmapUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(webmapData => {
        if (webmapData && typeof webmapData === 'object') {
          console.log('Webmap data:', webmapData);
          
          if (webmapData.operationalLayers && Array.isArray(webmapData.operationalLayers)) {
            webmapData.operationalLayers.forEach((layer: any) => {
              console.log('Processing layer:', layer.title, layer.layerType);
              
              // Handle Group Layers
              if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
                console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
                
                layer.layers.forEach((sublayer: any) => {
                  console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
                  
                  // Handle different layer types
                  this.processLayerByType(sublayer);
                });
              }
              // Handle direct layers
              else {
                this.processLayerByType(layer);
              }
            });
          }
          
          // Handle baseMap layers
          if (webmapData.baseMap && webmapData.baseMap.baseMapLayers && Array.isArray(webmapData.baseMap.baseMapLayers)) {
            webmapData.baseMap.baseMapLayers.forEach((layer: any) => {
              this.processLayerByType(layer);
            });
          }
        }
      })
      .catch(error => {
        console.warn('Could not load webmap data:', error);
        console.warn(`Please check if the domain '${domain}' and webmap ID '${webmapId}' are correct.`);
      });
  }

  /**
   * Process layer based on its type
   * This centralizes the layer type detection and routing logic
   */
  private processLayerByType(layer: any): void {
    if (!layer || !layer.url) return;

    switch (layer.layerType) {
      case 'ArcGISFeatureLayer':
        this.addArcGISFeatureLayer(layer);
        break;
      
      case 'ArcGISMapServiceLayer':
        this.addArcGISMapServiceLayer(layer);
        break;
      
      case 'VectorTileLayer':
      case 'ArcGISVectorTileLayer':
        this.addArcGISVectorTileLayer(layer);
        break;
      
      default:
        // Try to determine layer type from URL if not explicitly specified
        this.addLayerByUrlPattern(layer);
        break;
    }
  }

  /**
   * Fallback method to determine layer type from URL patterns
   * Sometimes the layerType field is missing or incorrect
   */
  private addLayerByUrlPattern(layer: any): void {
    if (!layer.url) return;

    const url = layer.url.toLowerCase();
    
    if (url.includes('featureserver')) {
      console.log(`Detected FeatureServer from URL: ${layer.title}`);
      this.addArcGISFeatureLayer(layer);
    } else if (url.includes('mapserver') && !url.includes('vectortileserver')) {
      console.log(`Detected MapServer from URL: ${layer.title}`);
      this.addArcGISMapServiceLayer(layer);
    } else if (url.includes('vectortileserver')) {
      console.log(`Detected VectorTileServer from URL: ${layer.title}`);
      this.addArcGISVectorTileLayer(layer);
    } else {
      console.warn(`Unknown layer type for: ${layer.title} (${layer.url})`);
      // Default to trying as a tile layer
      this.addGenericTileLayer(layer);
    }
  }

  /**
   * Add ArcGIS Vector Tile Layer
   * 
   * WHAT ARE VECTOR TILES?
   * Vector tiles contain vector data (points, lines, polygons) but packaged into
   * tiles for efficient delivery. Unlike raster tiles (images), vector tiles:
   * - Can be styled dynamically on the client
   * - Allow for smooth zooming (no pixelation)
   * - Support interaction and data queries
   * - Have smaller file sizes for sparse data
   * 
   * VECTOR TILE FORMATS:
   * - Mapbox Vector Tiles (MVT) - industry standard
   * - ArcGIS Vector Tiles - Esri's format (similar to MVT)
   */
  private addArcGISVectorTileLayer(layerConfig: any): void {
    if (!this.map || !layerConfig || !layerConfig.url) return;

    console.log(`Adding vector tile layer: ${layerConfig.title} from ${layerConfig.url}`);

    // Check if we have Leaflet plugins for vector tiles
    // Note: You'll need to include additional libraries for full vector tile support
    if (typeof (L as any).vectorGrid !== 'undefined') {
      // Use Leaflet.VectorGrid if available (recommended plugin)
      this.addVectorTileLayerWithVectorGrid(layerConfig);
    } else {
      // Fallback: Try to use as regular tile layer
      console.warn('VectorGrid plugin not found. Falling back to raster tiles.');
      this.addVectorTileLayerAsTiles(layerConfig);
    }
  }

  /**
   * Add vector tile layer using Leaflet.VectorGrid plugin
   * This provides full vector tile functionality
   */
  private addVectorTileLayerWithVectorGrid(layerConfig: any): void {
    try {
      // Construct vector tile URL template
      // Vector tiles use {z}/{y}/{x} pattern like regular tiles
      const vectorTileUrl = `${layerConfig.url}tile/{z}/{y}/{x}.pbf`;
      
      // Create vector tile layer with styling
      const vectorTileLayer = (L as any).vectorGrid.protobuf(vectorTileUrl, {
        // Default styling for all features
        vectorTileLayerStyles: {
          // Style all layers in the vector tile
          [layerConfig.title || 'default']: {
            weight: 2,
            color: '#3388ff',
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.4
          }
        },
        // Interaction settings
        interactive: layerConfig.interactive !== false,
        // Performance settings
        rendererFactory: (L as any).svg.tile,
        maxZoom: 18,
        attribution: 'Vector Tiles by Esri'
      });

      // Add click handler if interactive
      if (layerConfig.interactive !== false) {
        vectorTileLayer.on('click', (e: any) => {
          console.log('Vector tile feature clicked:', e.layer.properties);
        });
      }

      vectorTileLayer.addTo(this.map);
      console.log(`✓ Added vector tile layer: ${layerConfig.title}`);
      
    } catch (error) {
      console.error('Failed to add vector tile layer:', error);
      // Fallback to raster tiles
      this.addVectorTileLayerAsTiles(layerConfig);
    }
  }

  /**
   * Fallback: Add vector tile layer as raster tiles
   * This loses vector functionality but ensures something displays
   */
  private addVectorTileLayerAsTiles(layerConfig: any): void {
    try {
      // Many vector tile services also provide raster tile versions
      let tileUrl = layerConfig.url;
      
      // Convert vector tile URL to raster tile URL if needed
      if (tileUrl.includes('VectorTileServer')) {
        // Try to find a corresponding MapServer
        tileUrl = tileUrl.replace('VectorTileServer', 'MapServer');
      }
      
      // Add tile pattern if not present
      if (!tileUrl.includes('{z}')) {
        tileUrl = `${tileUrl}/tile/{z}/{y}/{x}`;
      }

      const tileLayer = L.tileLayer(tileUrl, {
        opacity: layerConfig.opacity || 1,
        maxZoom: 18,
        attribution: 'ArcGIS Vector Tiles (Raster Fallback)'
      });

      tileLayer.addTo(this.map);
      console.log(`✓ Added vector tile layer as raster tiles: ${layerConfig.title}`);
      
    } catch (error) {
      console.error('Failed to add vector tile layer as raster tiles:', error);
    }
  }

  /**
   * Generic tile layer for unknown types
   */
  private addGenericTileLayer(layerConfig: any): void {
    try {
      let tileUrl = layerConfig.url;
      
      // Add tile pattern if not present
      if (!tileUrl.includes('{z}')) {
        tileUrl = `${tileUrl}/tile/{z}/{y}/{x}`;
      }

      const tileLayer = L.tileLayer(tileUrl, {
        opacity: layerConfig.opacity || 1,
        maxZoom: 18,
        attribution: 'ArcGIS Layer'
      });

      tileLayer.addTo(this.map);
      console.log(`✓ Added generic tile layer: ${layerConfig.title}`);
      
    } catch (error) {
      console.error('Failed to add generic tile layer:', error);
    }
  }

  // ... (rest of your existing methods remain the same)
  
  private esriColorToCSS(esriColor: number[]): string {
    if (!esriColor || esriColor.length < 3) return '#3388ff';
    
    const [r, g, b, a = 255] = esriColor;
    
    if (a < 255) {
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

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