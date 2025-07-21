/* ========================================================================== */
/* ArcGISMapService.ts                                                        */
/* - Service class for handling ArcGIS map layers and operations             */
/* - Extracted from WebmapWebPart for better code organization               */
/* ========================================================================== */

import * as L from 'leaflet';

export class ArcGISMapService {
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
  }

  /**
   * Add ArcGIS tile layer to the map -> loading many little image tiles and putting them together on the screen.
   */
  public addArcGISTileLayer(): void {
    if (!this.map) return;

    // ArcGIS webmap ID extracted from the URL
    const webmapId = '37606acca6044778bd937f21303a4503';
    
    // ArcGIS Online tile service URL pattern
    const arcgisTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    try {
      L.tileLayer(arcgisTileUrl, {
        maxZoom: 18,
        id: 'arcgis-tiles'
      }).addTo(this.map);



      // Add vector tile layer with proper styling
      this.addArcGISVectorLayer(webmapId);
    } catch (error) {
      console.error('Failed to add ArcGIS tile layer:', error);
      this.addFallbackTileLayer();
    }
  }

  /**
   * Fallback tile layer in case ArcGIS fails
   */
  private addFallbackTileLayer(): void {
    if (!this.map) return;

    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  /**
   * Add ArcGIS vector layer (webmap content)
   */
  private addArcGISVectorLayer(webmapId: string): void {
    if (!this.map) return;

    const webmapUrl = `https://hochtiefinfra.maps.arcgis.com/sharing/rest/content/items/${webmapId}/data?f=json`;
    
    // Fetch webmap definition
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
          
          // Process operational layers from the webmap
          if (webmapData.operationalLayers && Array.isArray(webmapData.operationalLayers)) {
            webmapData.operationalLayers.forEach((layer: any) => {
              console.log('Processing layer:', layer.title, layer.layerType);
              
              // Handle Group Layers (like BR_Leverkusen_01)
              if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
                console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
                
                layer.layers.forEach((sublayer: any) => {
                  console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
                  
                  if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
                    // Remove the visibility check - load all layers
                    this.addArcGISFeatureLayer(sublayer);
                  }
                });
              }
              // Handle direct ArcGIS Feature Layers (vector features (lines,polygons,etc))
              else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
                this.addArcGISFeatureLayer(layer);
              }
              // Handle direct ArcGIS Map Service Layers (raster tile(images of the map))
              else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
                this.addArcGISMapServiceLayer(layer);
              }
            });
          }
          
          // Also check for baseMap layers
          if (webmapData.baseMap && webmapData.baseMap.baseMapLayers && Array.isArray(webmapData.baseMap.baseMapLayers)) {
            webmapData.baseMap.baseMapLayers.forEach((layer: any) => {
              if (layer && layer.url) {
                this.addArcGISMapServiceLayer(layer);
              }
            });
          }
        }
      })
      .catch(error => {
        console.warn('Could not load webmap data:', error);
      });
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
      // Ensure we're getting the correct layer info URL
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
      
      // Handle unique value renderer (most common for your data)
      if (renderer.type === 'uniqueValue') {
        const fieldValue = feature.properties[renderer.field1];
        
        // Find matching unique value info
        const matchingInfo = renderer.uniqueValueInfos?.find((info: any) => 
          info.value === fieldValue || info.value === String(fieldValue)
        );
        
        if (matchingInfo && matchingInfo.symbol) {
          return this.convertEsriSymbolToLeafletStyle(matchingInfo.symbol);
        }
        
        // Use default symbol if no match found
        if (renderer.defaultSymbol) {
          return this.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
        }
      }
      
      // Handle simple renderer
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
    
    if (symbol.type === 'esriSLS') { // Simple Line Symbol
      style.color = this.esriColorToCSS(symbol.color);
      style.weight = symbol.width || 2;
      style.opacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
      
      // Handle line style
      if (symbol.style === 'esriSLSDash') {
        style.dashArray = '5,5';
      } else if (symbol.style === 'esriSLSDot') {
        style.dashArray = '2,2';
      } else if (symbol.style === 'esriSLSDashDot') {
        style.dashArray = '5,2,2,2';
      }
    } else if (symbol.type === 'esriSFS') { // Simple Fill Symbol
      style.fillColor = this.esriColorToCSS(symbol.color);
      style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
      
      // Handle outline
      if (symbol.outline) {
        style.color = this.esriColorToCSS(symbol.outline.color);
        style.weight = symbol.outline.width || 1;
        style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
          symbol.outline.color[3] / 255 : 1;
      }
    } else if (symbol.type === 'esriSMS') { // Simple Marker Symbol
      style.radius = symbol.size || 6;
      style.fillColor = this.esriColorToCSS(symbol.color);
      style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
      
      // Handle outline
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
        // First, get the layer info to understand the data
        const layerInfoUrl = `${featureServiceUrl}?f=json`;
        const infoResponse = await fetch(layerInfoUrl);
        const layerInfo = await infoResponse.json();
      
        // Get the maximum record count from layer info
        const maxRecordCount = layerInfo.maxRecordCount || 1000;
      
        // Get drawing info for styling
        const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);
        
        // Query all features - handle pagination if needed
        // This block is responsible for fetching all features from an ArcGIS Feature Service.
        // Since ArcGIS servers limit the number of results per request, we use a loop to fetch data in chunks (pagination).

        let allFeatures: any[] = [];         // Array to store all fetched features across multiple pages
        let resultOffset = 0;                // Starting offset for the current query – initially 0
        let hasMore = true;                  // Boolean flag to control the pagination loop

        while (hasMore) {
            // Create query parameters for the current request
            const queryParams = new URLSearchParams({
                'where': '1=1',                  // SQL-like query: 1=1 means "select all features"
                'outFields': 'Layer,RefName,Entity', // Limit returned fields to only what's needed for styling (performance optimization)
                'f': 'geojson',                  // Response format = GeoJSON (easier to work with in JavaScript/Leaflet)
                'outSR': '4326',                 // Output spatial reference = WGS 84 (standard lat/lon format)
                'returnGeometry': 'true',       // Request the geometry of features (not just attributes)
                'resultOffset': resultOffset.toString(),  // Offset tells the server where to start returning records from
                'resultRecordCount': maxRecordCount.toString(), // Maximum number of records per page/request
                'geometryPrecision': '6'        // Reduces decimal precision of coordinates to save bandwidth and improve performance
            });

            // Construct the full query URL with all parameters
            const queryUrl = `${featureServiceUrl}/query?${queryParams.toString()}`;

            // Send the HTTP GET request to the ArcGIS Feature Service
            const response = await fetch(queryUrl);
            if (!response.ok) {
                // If the request fails, throw an error with the status code
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the response as JSON (GeoJSON format)
            const geojsonData = await response.json();

            // Check if the response has features and add them to the collection
            if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
                // Add current batch of features to the master list
                allFeatures = allFeatures.concat(geojsonData.features);

                // Update the offset for the next request
                resultOffset += geojsonData.features.length;

                // If we received a full batch (max count), assume there may be more features to load
                hasMore = geojsonData.features.length === maxRecordCount;
            } else {
                // If no more features returned, exit the loop
                hasMore = false;
            }
        }

        console.log(`Total features fetched for ${layerConfig.title}: ${allFeatures.length}`);
        
        if (allFeatures.length > 0) {
            // Create the complete GeoJSON object
            const completeGeoJSON = {
                type: 'FeatureCollection' as const,
                features: allFeatures
            } as any;
            
            // Create style function based on drawing info
            const styleFunction = this.createStyleFunction(drawingInfo);
            
            // Create a GeoJSON layer optimized for performance
            const geoJsonLayer = L.geoJSON(completeGeoJSON, {
            style: (feature) => {
                const style = styleFunction(feature);
                // Ensure polygon visibility
                if (layerConfig.title && layerConfig.title.includes('Polys')) {
                style.fillOpacity = style.fillOpacity || 0.6;
                style.weight = style.weight || 1; // Reduce line weight for performance
                }
                return style;
            },
            pointToLayer: (feature, latlng) => {
                const style = styleFunction(feature);
                return L.circleMarker(latlng, style);
            },
            // Disable all interactivity for better performance
            interactive: false,
            bubblingMouseEvents: false
            });

            // Add the layer to the map
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
    
    // For each sublayer, add as a tile layer
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
      // If no sublayers, try to add the service directly
      const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`;
      
      L.tileLayer(tileUrl, {
        opacity: layerConfig.opacity || 1,
        attribution: 'ArcGIS Map Service'
      }).addTo(this.map!);
      
      console.log(`Added map service as tile layer: ${layerConfig.title}`);
    }
  }
}