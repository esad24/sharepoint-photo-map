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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service class that encapsulates all ArcGIS-specific map functionality
 * This class acts as a bridge between ArcGIS data and the Leaflet map display
 */
export class ArcGISMapService {
  private map: L.Map; // Reference to the Leaflet map instance

  constructor(map: L.Map) {
    this.map = map; // Store map reference for use in methods
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
  private processOperationalLayers(webmapData: any): void {
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
        this.addArcGISFeatureLayer(layer);
      }
      // Handle direct ArcGIS Map Service Layers
      else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
        this.addArcGISMapServiceLayer(layer);
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
        this.addArcGISFeatureLayer(sublayer);
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
  private processBasemapLayers(webmapData: any): void {
    if (!webmapData.baseMap || !webmapData.baseMap.baseMapLayers || !Array.isArray(webmapData.baseMap.baseMapLayers)) {
      return;
    }

    webmapData.baseMap.baseMapLayers.forEach((layer: any) => {
      if (layer && layer.url) {
        this.addArcGISMapServiceLayer(layer);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STYLING AND SYMBOL CONVERSION METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Convert ESRI color array to CSS color string
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ COLOR FORMATS:                                                          │
   * │ • ESRI uses arrays like [255, 0, 0, 128] for red with 50% transparency │
   * │ • CSS uses strings like "rgba(255, 0, 0, 0.5)" for the same color     │
   * │ • We need to convert between these formats                             │
   * └─────────────────────────────────────────────────────────────────────────┘
   * 
   * @param esriColor - Array of [Red, Green, Blue, Alpha] values (0-255 each)
   * @returns CSS color string
   */
  private esriColorToCSS(esriColor: number[]): string {
    // Default to blue if color is invalid
    if (!esriColor || esriColor.length < 3) return '#3388ff';
    
    // Destructure color components, default alpha to 255 (fully opaque)
    const [r, g, b, a = 255] = esriColor;
    
    // Use rgba if transparency is specified
    if (a < 255) {
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`; // Convert alpha from 0-255 to 0-1 scale
    }
    // Use rgb for fully opaque colors (slightly more efficient)
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Get layer styling information from ArcGIS service
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS DRAWING INFO?                                                   │
   * │                                                                         │
   * │ Drawing info contains the "styling rules" for a layer - it tells us:   │
   * │ • What color should roads be?                                          │
   * │ • How thick should boundary lines be?                                  │
   * │ • What symbols should represent different types of buildings?          │
   * │                                                                         │
   * │ This method fetches these styling rules from the ArcGIS server.        │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private async getLayerDrawingInfo(serviceUrl: string): Promise<any> {
    try {
      // Ensure we're getting the correct layer info URL
      const url = String(serviceUrl);
      // Add JSON format parameter to the URL (?f=json tells ArcGIS to return JSON data)
      const layerInfoUrl = url.indexOf('?') !== -1 ? `${url}&f=json` : `${url}?f=json`;
      console.log('Fetching layer info from:', layerInfoUrl);
      
      // Fetch layer metadata (information about the layer)
      const response = await fetch(layerInfoUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch layer info: ${response.status}`);
        return null;
      }
      
      // Parse JSON response
      const layerInfo = await response.json();
      console.log('Layer info:', layerInfo);
      
      // Return drawing info if available, otherwise null
      return layerInfo.drawingInfo || null;
    } catch (error) {
      console.error('Failed to get layer drawing info:', error);
      return null;
    }
  }

  /**
   * Create style function for GeoJSON layer based on ArcGIS renderer
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS A RENDERER?                                                     │
   * │                                                                         │
   * │ A renderer is a set of rules that determines how features should look: │
   * │ • "All highways should be thick red lines"                            │
   * │ • "Residential areas should be light green polygons"                  │
   * │ • "Schools should be blue circle markers"                             │
   * │                                                                         │
   * │ This method converts ArcGIS renderer rules into Leaflet styling        │
   * │ functions.                                                             │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private createStyleFunction(drawingInfo: any): (feature: any) => any {
    // Return a function that takes a feature and returns its style
    return (feature: any) => {
      // Default style if no drawing info is available
      // This ensures features are visible even if styling fails
      const defaultStyle = {
        color: '#3388ff',      // Line/border color (blue)
        weight: 2,             // Line width in pixels
        opacity: 0.8,          // Line opacity (0 = invisible, 1 = fully opaque)
        fillOpacity: 0.4,      // Fill opacity for polygons
        fillColor: '#3388ff'   // Fill color for polygons
      };

      // Return default if no drawing info
      if (!drawingInfo || !drawingInfo.renderer) {
        return defaultStyle;
      }

      const renderer = drawingInfo.renderer;
      
      // Handle unique value renderer (most common for categorical data)
      if (renderer.type === 'uniqueValue') {
        return this.handleUniqueValueRenderer(renderer, feature, defaultStyle);
      }
      
      // Handle simple renderer
      if (renderer.type === 'simple' && renderer.symbol) {
        return this.convertEsriSymbolToLeafletStyle(renderer.symbol);
      }
      
      return defaultStyle; // Fallback to default style if nothing else works
    };
  }

  /**
   * Handle unique value renderer styling
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ UNIQUE VALUE RENDERER example:                                          │
   * │ • If feature.type = "highway"     → use thick red line                 │
   * │ • If feature.type = "local_road"  → use thin gray line                 │
   * │ • If feature.type = "bike_path"   → use dashed green line              │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private handleUniqueValueRenderer(renderer: any, feature: any, defaultStyle: any): any {
    // Get the value of the field used for rendering (e.g., "highway", "local_road")
    const fieldValue = feature.properties[renderer.field1];
    
    // Find matching unique value info
    // Look for a styling rule that matches this feature's field value
    const matchingInfo = renderer.uniqueValueInfos?.find((info: any) => 
      info.value === fieldValue || info.value === String(fieldValue) // Check both exact and string match
    );
    
    // If found, convert the ESRI symbol to Leaflet style
    if (matchingInfo && matchingInfo.symbol) {
      return this.convertEsriSymbolToLeafletStyle(matchingInfo.symbol);
    }
    
    // Use default symbol if no specific match found
    if (renderer.defaultSymbol) {
      return this.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
    }

    return defaultStyle;
  }

  /**
   * Convert ESRI symbol to Leaflet style
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ SYMBOL CONVERSION:                                                      │
   * │                                                                         │
   * │ ESRI and Leaflet use different formats for describing how features     │
   * │ should look. This is like translating between two different languages  │
   * │ that describe the same thing.                                          │
   * │                                                                         │
   * │ ESRI might say:   "esriSLS with color [255,0,0] and width 3"          │
   * │ Leaflet wants:    "{ color: 'rgb(255,0,0)', weight: 3 }"              │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private convertEsriSymbolToLeafletStyle(symbol: any): any {
    const style: any = {}; // Initialize empty style object
    
    // Handle Simple Line Symbol (for roads, boundaries, etc.)
    if (symbol.type === 'esriSLS') {
      this.convertLineSymbol(symbol, style);
    } 
    // Handle Simple Fill Symbol (for areas like buildings, zones, etc.)
    else if (symbol.type === 'esriSFS') {
      this.convertFillSymbol(symbol, style);
    } 
    // Handle Simple Marker Symbol (for point locations like buildings, landmarks, etc.)
    else if (symbol.type === 'esriSMS') {
      this.convertMarkerSymbol(symbol, style);
    }
    
    return style; // Return the converted style object for Leaflet to use
  }

  /**
   * Convert ESRI Simple Line Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Line Symbol (esriSLS)
   * @param style  - Style object to populate
   */
  private convertLineSymbol(symbol: any, style: any): void {
    style.color = this.esriColorToCSS(symbol.color); // Convert color format
    style.weight = symbol.width || 2; // Line width in pixels, default to 2
    // Calculate opacity from alpha channel if present
    style.opacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
    
    // Handle line style patterns (solid, dashed, dotted, etc.)
    if (symbol.style === 'esriSLSDash') {
      style.dashArray = '5,5'; // 5 pixels line, 5 pixels gap, repeat
    } else if (symbol.style === 'esriSLSDot') {
      style.dashArray = '2,2'; // 2 pixels dot, 2 pixels gap, repeat
    } else if (symbol.style === 'esriSLSDashDot') {
      style.dashArray = '5,2,2,2'; // Dash-dot-dash-dot pattern
    }
  }

  /**
   * Convert ESRI Simple Fill Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Fill Symbol (esriSFS)  
   * @param style  - Style object to populate
   */
  private convertFillSymbol(symbol: any, style: any): void {
    style.fillColor = this.esriColorToCSS(symbol.color); // Interior color of the polygon
    // Calculate fill opacity from alpha channel
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
    
    // Handle outline (border) of polygon
    if (symbol.outline) {
      style.color = this.esriColorToCSS(symbol.outline.color); // Border color
      style.weight = symbol.outline.width || 1; // Border width in pixels
      // Calculate border opacity
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }

  /**
   * Convert ESRI Simple Marker Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Marker Symbol (esriSMS)
   * @param style  - Style object to populate  
   */
  private convertMarkerSymbol(symbol: any, style: any): void {
    style.radius = symbol.size || 6; // Circle radius in pixels
    style.fillColor = this.esriColorToCSS(symbol.color); // Fill color of the circle
    // Calculate fill opacity
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
    
    // Handle outline (border) of point marker
    if (symbol.outline) {
      style.color = this.esriColorToCSS(symbol.outline.color); // Border color
      style.weight = symbol.outline.width || 1; // Border width
      // Calculate border opacity
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER LOADING METHODS - Feature and Service Layers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Add an ArcGIS Feature Layer with proper styling (Optimized for performance)
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS A FEATURE LAYER?                                                │
   * │                                                                         │
   * │ A feature layer contains individual geographic features (vector data):  │
   * │ • Each road segment, building outline, or property boundary is a        │
   * │   separate "feature"                                                    │
   * │ • Features have both geometry (shape/location) and attributes          │
   * │   (properties/data)                                                     │
   * │ • Example: A building feature might have geometry (rectangle outline)  │
   * │   and attributes (address, owner, year built, etc.)                    │
   * │                                                                         │
   * │ PERFORMANCE CONSIDERATIONS:                                             │
   * │ Feature layers can contain thousands of individual features. Loading   │
   * │ and rendering all of them can be slow, so this method includes several │
   * │ optimizations.                                                          │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
   private async addArcGISFeatureLayer(layerConfig: any): Promise<void> {
    // Safety checks - make sure we have everything we need
    if (!this.map || !layerConfig || !layerConfig.url) return;

    const featureServiceUrl = layerConfig.url;
    console.log(`Loading feature layer: ${layerConfig.title} from ${featureServiceUrl}`);
    
    try {
        // First, get the layer info to understand the data structure
        const layerInfo = await this.getFeatureLayerInfo(featureServiceUrl);
        if (!layerInfo) return;

        // Get the maximum record count from layer info
        const maxRecordCount = layerInfo.maxRecordCount || 1000;
      
        // Get drawing info for styling
        const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);
        
        // Query all features - handle pagination if needed
        const allFeatures = await this.queryAllFeatures(featureServiceUrl, maxRecordCount);
        
        if (allFeatures.length > 0) {
            // Create and add the complete GeoJSON layer
            this.createAndAddGeoJSONLayer(allFeatures, layerConfig, drawingInfo);
        }
    } 
    catch (error) {
            // Log errors but don't crash the entire map
            // This ensures that if one layer fails, other layers can still load
            console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
    }
  }

  /**
   * Get feature layer information from ArcGIS service
   */
  private async getFeatureLayerInfo(featureServiceUrl: string): Promise<any> {
    const layerInfoUrl = `${featureServiceUrl}?f=json`;
    const infoResponse = await fetch(layerInfoUrl);
    return await infoResponse.json();
  }

  /**
   * Query all features with pagination support
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ PAGINATION EXPLAINED:                                                   │
   * │                                                                         │
   * │ If a layer has 5,000 features but the server only allows 1,000 per     │
   * │ request, we need to make 5 separate requests:                          │
   * │ • Request 1: features 0-999                                            │
   * │ • Request 2: features 1000-1999                                        │
   * │ • Request 3: features 2000-2999                                        │
   * │ • etc.                                                                 │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private async queryAllFeatures(featureServiceUrl: string, maxRecordCount: number): Promise<any[]> {
    let allFeatures: any[] = [];         // Array to store all fetched features across multiple pages
    let resultOffset = 0;                // Starting position for the current request (initially 0)
    let hasMore = true;                  // Boolean flag to control the pagination loop

    while (hasMore) {
        // Create query parameters for the current request
        const queryParams = new URLSearchParams({
            'where': '1=1',                  // SQL-like query: "1=1" means "select all features" (always true condition)
            'outFields': 'Layer,RefName,Entity', // Limit returned fields to only what's needed for styling (performance optimization)
            'f': 'geojson',                  // Response format: GeoJSON (standardized geographic data format)
            'outSR': '4326',                 // Output spatial reference: WGS 84 (standard latitude/longitude coordinate system)
            'returnGeometry': 'true',        // Include the shape/location data of features (not just attributes)
            'resultOffset': resultOffset.toString(),  // Tell the server where to start returning records from
            'resultRecordCount': maxRecordCount.toString(), // Maximum number of records to return in this request
            'geometryPrecision': '6'         // Limit coordinate decimal places (reduces file size and improves performance)
        });

        // Construct the full query URL with all parameters
        const queryUrl = `${featureServiceUrl}/query?${queryParams.toString()}`;

        // Send the HTTP GET request to the ArcGIS Feature Service
        const response = await fetch(queryUrl);
        if (!response.ok) {
            // If the request fails, throw an error with the HTTP status code
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON (GeoJSON format)
        const geojsonData = await response.json();

        // Check if the response has features and add them to our collection
        if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
            // Add current batch of features to the master list
            allFeatures = allFeatures.concat(geojsonData.features);

            // Update the offset for the next request (move to the next "page")
            resultOffset += geojsonData.features.length;

            // If we received a full batch (max count), assume there may be more features to load
            // If we got fewer than the maximum, we've probably reached the end
            hasMore = geojsonData.features.length === maxRecordCount;
        } else {
            // If no features returned, we've reached the end
            hasMore = false;
        }
    }

    console.log(`Total features fetched: ${allFeatures.length}`);
    return allFeatures;
  }

  /**
   * Create and add GeoJSON layer to the map with proper styling
   */
  private createAndAddGeoJSONLayer(allFeatures: any[], layerConfig: any, drawingInfo: any): void {
    // Create the complete GeoJSON object
    // GeoJSON is a standard format for representing geographic features
    // It wraps all features in a "FeatureCollection" structure
    const completeGeoJSON = {
        type: 'FeatureCollection' as const,
        features: allFeatures
    } as any;
    
    // Create style function based on drawing info
    const styleFunction = this.createStyleFunction(drawingInfo);
    
    
    // Create a GeoJSON layer optimized for performance
    const geoJsonLayer = L.geoJSON(completeGeoJSON, {
        // Style function for lines and polygons
        // This function is called for each feature to determine its appearance
        style: (feature) => {
            const style = styleFunction(feature);
            // Ensure polygon visibility
            // Special handling for polygon layers to make sure they're visible
            if (layerConfig.title && layerConfig.title.includes('Polys')) {
                style.fillOpacity = style.fillOpacity || 0.6; // Make sure polygons have some transparency
                style.weight = style.weight || 1; // Keep border lines thin for performance
            }
            return style;
        },
        // Function to create markers for point features
        // Instead of default markers (which can be slow), use simple circles
        pointToLayer: (feature, latlng) => {
            const style = styleFunction(feature);
            // Use circle markers instead of default markers for better performance
            return L.circleMarker(latlng, style);
        },
        
        // Disable all interactivity for better performance
        // PERFORMANCE OPTIMIZATION:
        // Interactive features (hover effects, click events) require more processing
        // For layers with thousands of features, this can make the map slow
        // If you need interactivity, you can enable it, but expect slower performance
        interactive: false,
        bubblingMouseEvents: false
    });

    // Add the layer to the map
    geoJsonLayer.addTo(this.map!);
    
    console.log(`✓ Successfully added feature layer: ${layerConfig.title} with ${allFeatures.length} features`);
  }

  /**
   * Add an ArcGIS Map Service Layer
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ WHAT IS A MAP SERVICE LAYER?                                            │
   * │                                                                         │
   * │ Unlike feature layers (which send individual features), map service    │
   * │ layers provide pre-rendered images (tiles) of the map data. This is    │
   * │ like the difference between:                                           │
   * │ • Feature Layer: Sending you the blueprints to draw a house           │
   * │ • Map Service:   Sending you a photograph of the house                │
   * │                                                                         │
   * │ WHEN TO USE MAP SERVICES:                                              │
   * │ • When you have complex data that would be slow to render as          │
   * │   individual features                                                  │
   * │ • When you don't need to interact with individual features            │
   * │ • When you want consistent styling that matches the original ArcGIS   │
   * │   map                                                                  │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  private addArcGISMapServiceLayer(layerConfig: any): void {
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
  private addMapServiceSublayers(layerConfig: any, baseUrl: string): void {
    layerConfig.layers.forEach((sublayer: any) => {
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
  private addSingleMapServiceLayer(layerConfig: any, baseUrl: string): void {
    // Some map services are simple and don't have multiple sublayers
    const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`;
    
    L.tileLayer(tileUrl, {
      opacity: layerConfig.opacity || 1,
      attribution: 'ArcGIS Map Service'
    }).addTo(this.map!);
    
    console.log(`Added map service as tile layer: ${layerConfig.title}`);
  }
}