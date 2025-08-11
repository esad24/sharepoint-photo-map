/* ========================================================================== */
/* ArcGISMapService.ts - FIXED VERSION                                       */
/* - Added support for Vector Tile Layers                                    */
/* - Fixed basemap processing logic                                           */
/* ========================================================================== */

import * as L from 'leaflet';



export class ArcGISMapService {
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
  }

  public addArcGISTileLayer(webmapId: string, domain: string): void {
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
          
          // First, add the basemap from webmap configuration
          this.addBasemapFromWebmap(webmapData);
          
          // Then, add operational layers
          this.processOperationalLayers(webmapData);
        }
      })
      .catch(error => {
        console.error('Failed to load webmap:', error);
        console.warn(`Please check if the domain '${domain}' and webmap ID '${webmapId}' are correct.`);
        this.addFallbackTileLayer();
      });
  }

  /**
   * FIXED: Auto-detect and add basemap with Vector Tile support
   */
  private addBasemapFromWebmap(webmapData: any): void {
    if (!this.map) return;

    try {
      if (webmapData.baseMap && webmapData.baseMap.baseMapLayers && Array.isArray(webmapData.baseMap.baseMapLayers)) {
        console.log('Found basemap configuration in webmap');
        
        // Process each basemap layer in order (hillshade first, then vector tiles)
        webmapData.baseMap.baseMapLayers.forEach((basemapLayer: any, index: number) => {
          this.addBasemapLayer(basemapLayer, index);
        });
        
        return;
      }
      
      // Fallback to default basemap
      console.log('No basemap configuration found, using default');
      this.addDefaultBasemap();
      
    } catch (error) {
      console.error('Error processing basemap from webmap:', error);
      this.addUnifiedFallback();
    }
  }

  /**
   * NEW: Add individual basemap layer with support for different types
   */
  private addBasemapLayer(basemapLayer: any, index: number): void {
    if (!basemapLayer || !basemapLayer.visibility) {
      console.log(`Skipping invisible basemap layer ${index}`);
      return;
    }

    console.log(`Processing basemap layer ${index + 1}:`, basemapLayer);

    // Handle Vector Tile Layers (like topographic map)
    if (basemapLayer.layerType === 'VectorTileLayer') {
      this.addVectorTileLayer(basemapLayer, index);
    }
    // Handle traditional raster tile layers (like World Hillshade)
    else if (basemapLayer.layerType === 'ArcGISTiledMapServiceLayer' && basemapLayer.url) {
      this.addRasterTileLayer(basemapLayer, index);
    }
    // Handle other tile layer types
    else if (basemapLayer.url) {
      this.addRasterTileLayer(basemapLayer, index);
    }
    else {
      console.warn(`Unknown basemap layer type: ${basemapLayer.layerType}`);
    }
  }

  /**
   * NEW: Add Vector Tile Layer (for topographic maps)
   */
  private addVectorTileLayer(layerConfig: any, index: number): void {
    console.log(`Adding Vector Tile Layer: ${layerConfig.title}`);
    
    // For vector tiles, we need to use a different approach
    // Since Leaflet doesn't natively support Esri vector tiles, 
    // we'll try to use a raster equivalent or fallback to OSM
    
    // Option 1: Use Esri's REST API to get a raster version
    if (layerConfig.styleUrl) {
      // Extract the item ID from the style URL
      const itemIdMatch = layerConfig.styleUrl.match(/\/items\/([a-f0-9]+)\//);
      if (itemIdMatch) {
        //const itemId = itemIdMatch[1];
        // Use Esri's tile service that renders the vector tiles as raster
        const rasterUrl = `https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`;
        
        const tileLayer = L.tileLayer(rasterUrl, {
          maxZoom: 18,
          opacity: layerConfig.opacity || 1,
          attribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community',
          id: `vector-basemap-${index}`
        });

        // Add error handling for vector tile layer
        tileLayer.on('tileerror', (e: any) => {
          console.warn(`Vector tile layer failed for ${layerConfig.title}:`, e);
          console.log('Removing failed vector layer and adding fallback...');
          tileLayer.remove();
          this.addUnifiedFallback();
        });

        tileLayer.addTo(this.map);
        console.log(`✓ Added vector tile layer as raster: ${layerConfig.title}`);
        return;
      }
    }
    
    // Option 2: If styleUrl parsing failed, fallback to OSM immediately
    console.log('Vector tile processing failed, using OpenStreetMap fallback');
    this.addUnifiedFallback();
  }

  /**
   * IMPROVED: Add Raster Tile Layer with better error handling
   */
  private addRasterTileLayer(layerConfig: any, index: number): void {
    console.log(`Adding Raster Tile Layer: ${layerConfig.title} from ${layerConfig.url}`);
    
    const tileUrl = this.convertToTileUrl(layerConfig.url);
    
    if (tileUrl) {
      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 18,
        opacity: layerConfig.opacity || 1,
        attribution: '© Esri',
        id: `raster-basemap-${index}`,
        // Add error handling
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      });
      
      // Add error handling
      tileLayer.on('tileerror', (e: any) => {
        console.warn(`Tile load error for ${layerConfig.title}:`, e);
        console.log('Removing failed layer and adding fallback...');
        tileLayer.remove();
        this.addUnifiedFallback();
      });
      
      tileLayer.on('tileload', (e: any) => {
        console.log(`Tile loaded successfully for ${layerConfig.title}`);
      });
      
      tileLayer.addTo(this.map);
      console.log(`✓ Successfully added raster basemap: ${layerConfig.title}`);
    } else {
      console.error(`Failed to convert URL to tile format: ${layerConfig.url}`);
    }
  }

  /**
   * IMPROVED: Better URL conversion with more patterns
   */
  private convertToTileUrl(serviceUrl: string): string | null {
    if (!serviceUrl) return null;
    
    try {
      let url = serviceUrl.replace(/\/$/, '');
      
      // Handle different ArcGIS URL patterns
      if (url.indexOf('/tile/') !== -1) {
        return url.replace(/\/tile\/.*$/, '/tile/{z}/{y}/{x}');
      }
      
      if (url.indexOf('/MapServer') !== -1) {
        url = url.replace(/\/MapServer\/\d+$/, '/MapServer');
        return url + '/tile/{z}/{y}/{x}';
      }
      
      if (url.indexOf('/FeatureServer') !== -1) {
        url = url.replace('/FeatureServer', '/MapServer');
        return url + '/tile/{z}/{y}/{x}';
      }
      
      if (url.indexOf('/services/') !== -1 && url.indexOf('/MapServer') === -1) {
        return url + '/MapServer/tile/{z}/{y}/{x}';
      }
      
      return url + '/tile/{z}/{y}/{x}';
      
    } catch (error) {
      console.error('Error converting URL to tile format:', error);
      return null;
    }
  }

  /**
   * IMPROVED: Better default basemap
   */
  private addDefaultBasemap(): void {
    if (!this.map) return;
    
    // Use unified fallback instead
    this.addUnifiedFallback();
  }

  /**
   * UNIFIED: Single fallback method - only OpenStreetMap
   */
  private addUnifiedFallback(): void {
    if (!this.map) return;

    console.log('Adding OpenStreetMap fallback...');
    
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      id: 'fallback-osm'
    }).addTo(this.map);
    
    console.log('✓ Added OpenStreetMap as fallback');
  }

  /**
   * Process operational layers from webmap
   */
private processOperationalLayers(webmapData: any): void {
  if (webmapData.operationalLayers && Array.isArray(webmapData.operationalLayers)) {
    webmapData.operationalLayers.forEach((layer: any) => {
      console.log('Processing layer:', layer.title, layer.layerType);
      
      if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
        console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
        
        layer.layers.forEach((sublayer: any) => {
          console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
          
          if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
            this.addArcGISFeatureLayer(sublayer);
          }
        });
      }
      else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
        this.addArcGISFeatureLayer(layer);
      }
      else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
        this.addArcGISMapServiceLayer(layer);
      }
    });
  }
}
private addFallbackTileLayer(): void {
  if (!this.map) return;
  
  // Use the unified fallback method instead of directly adding OSM
  this.addUnifiedFallback();
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
      
      // Handle unique value renderer
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
    
    // Handle Simple Line Symbol
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
    // Handle Simple Fill Symbol
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
    // Handle Simple Marker Symbol
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