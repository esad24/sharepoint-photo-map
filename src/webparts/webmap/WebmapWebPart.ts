/* ========================================================================== */
/* WebmapWebPart.ts                                                           */
/* - SPFx client-side web-part                                                */
/* - Leaflet map with clustered picture markers                               */
/* - Fully configurable in the property-pane:                                 */
/* - Site URL                                                                 */
/* - List                                                                     */
/* - Latitude column                                                          */
/* - Longitude column                                                         */
/* - Image column                                                             */
/* ========================================================================== */

// Imports from the SharePoint Framework (SPFx) libraries.
import { Version } from '@microsoft/sp-core-library'; // Used for versioning the web part.
import {
  IPropertyPaneConfiguration,     // Interface for defining the entire property pane's structure.
  PropertyPaneDropdown,           // A dropdown control for the property pane.
  IPropertyPaneDropdownOption,    // Interface for the options within a dropdown control.
  IPropertyPaneGroup
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; // The base class for all client-side web parts.
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'; // Used for making REST API calls to SharePoint.




// Imports for the Leaflet mapping library and its marker cluster plugin.
import * as L from 'leaflet';               // The core Leaflet library.
import 'leaflet/dist/leaflet.css';       // Default CSS for Leaflet for proper rendering of map controls, etc.
import 'leaflet.markercluster';            // The marker cluster plugin logic.
import 'leaflet.markercluster/dist/MarkerCluster.css';       // Main CSS for the cluster plugin.
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Default theme for the cluster icons.

//import 'esri-leaflet'; // This import makes L.esri available



// Imports the web part's specific styles defined in a SASS module.
import styles from './WebmapWebPart.module.scss';

// Impoer security functions
import { escODataIdentifier, sanitizeUrl, escAttr } from './utils/security'; // Security helpers for escaping identifiers and URLs.

/* ------------------------------------------------------------------ */
/* Helpers & typings                                                  */
/* ------------------------------------------------------------------ */

// FIX: Define types for SharePoint objects to avoid using 'any'.
interface ISPList { Title: string; }
interface ISPField { TypeAsString: string; InternalName: string; Title: string; }
interface IClusterClickEvent extends L.LeafletEvent { layer: L.MarkerCluster; latlng: L.LatLng; }

/**
 * This is a TypeScript feature called "module augmentation".
 * We are extending the original 'leaflet' module to add a custom 'data' property
 * to the MarkerOptions interface. This allows us to attach the raw SharePoint list item
 * object directly to a Leaflet marker, making it easy to access later (e.g., in popups).
 */
declare module 'leaflet' {
  interface MarkerOptions {
    data?: IWebmapListItem; // FIX: Use the specific item interface instead of 'any'.
  }
}

/**
 * Defines the structure for a SharePoint list item that will be used for mapping.
 * It uses an index signature [key: string]: any to allow for dynamic property access,
 * since the actual names for latitude, longitude, and image columns are determined at
 * run-time from the web part properties.
 */
export interface IWebmapListItem {
  [key: string]: unknown;  // FIX: Use 'unknown' instead of 'any' for better type safety.
  img?: string; // alias image URL
}

/**
 * Defines the properties of the web part that can be configured by the user
 * in the property pane. These properties are saved with the web part instance.
 */
export interface IWebmapWebPartProps {
  dataSourceType: 'List' | 'DocumentLibrary' | '';  // property to select data source type
  listName: string; // The title of the SharePoint list to fetch data from.
  latField: string; // The internal name of the column containing the latitude.
  lonField: string; // The internal name of the column containing the longitude.
  imgField: string; // The internal name of the column containing the image.
  libraryName?: string; // for document library
}

/* ------------------------------------------------------------------ */
/* Web-part                                                           */
/* ------------------------------------------------------------------ */

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  /* ––– Members that survive re-renders ––––––––––––––––––––––––––– */
  // These class members hold state that should persist across web part re-renders.
  private map: L.Map | undefined;                       // Holds the Leaflet map instance.
  private markerCluster: L.MarkerClusterGroup | undefined; // Holds the marker cluster layer instance.
  private dataTimer: number | undefined;                   // Holds the ID of the setInterval timer for data refreshes.

  // Caching for property pane dropdown options to avoid redundant API calls.
  private _lists: IPropertyPaneDropdownOption[] = [];  // Cached list of SharePoint lists.
  private _fields: IPropertyPaneDropdownOption[] = []; // Cached list of fields for the selected list.

  // Keys to check if the cache is still valid.
  private _siteForLists: string | null = null;   // The site URL for which the `_lists` cache is valid.
  private _listForFields: string | null = null;  // The list name for which the `_fields` cache is valid.




  /* ------------------------------------------------------------- */
  /* RENDER                                                        */
  /* ------------------------------------------------------------- */
  /**
   * The main render method called by the SPFx framework to display the web part.
   */
  private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;

  public render(): void {
    // Sets the basic HTML structure for the web part.
    // It creates a container `div` with a unique ID ('map') that Leaflet will use to initialize the map.
    this.domElement.innerHTML = `
      <div>
        <div id="${this.mapId}" class="${styles.mapContainer}"></div>
      </div>
    `;

    // Calls the method to initialize the Leaflet map logic.
    this.renderMap();
  }

  /* ------------------------------------------------------------- */
  /* Map creation / refresh                                        */
  /* ------------------------------------------------------------- */
  /**
   * Initializes or refreshes the Leaflet map instance. This method handles
   * cleanup of old instances and setup of the map, layers, and events.
   */
  private renderMap(): void {
    /* 1. Dispose previous instance (avoid “Map container is already initialized”) */
    // If a map instance already exists, remove it to prevent errors on re-render.
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    // If a data refresh timer is running, clear it.
    // if (this.dataTimer) {
    //   window.clearInterval(this.dataTimer);
    //   this.dataTimer = undefined;
    // }

    /* 2. Create fresh map */
    // Initialize a new map on the 'map' div, setting an initial view (coordinates and zoom level).
    this.map = L.map(this.mapId).setView([51.4239, 6.9985], 10); // Default view over Hochtief location

    // Add the base tile layer to the map. This provides the visual map background (roads, etc.).
    // We use OpenStreetMap here, which requires attribution.

    // L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    // }).addTo(this.map);

    
    /* 3. Add ArcGIS tile layer instead of OpenStreetMap */
    this.addArcGISTileLayer();

    

    /* 3. Cluster layer */
    // Initialize the marker cluster group.
    this.markerCluster = L.markerClusterGroup({
      // `iconCreateFunction` is a customization that defines how a cluster icon looks.
      iconCreateFunction: (cluster) => {
        // Get the first marker in the cluster to use its image for the cluster icon.
        const first: L.Marker = cluster.getAllChildMarkers()[0]; // FIX: Use the specific L.Marker type instead of 'any'.
        const img = sanitizeUrl(first?.options.data?.img as string);

        const count  = cluster.getChildCount(); // How many markers are in this cluster.
        const digits = String(count).length;     // Number of digits in the count.
        const badgeH = 22; // Height of the count badge.
        // Dynamically calculate the width of the badge to fit the count number.
        const badgeW = digits === 1 ? badgeH : badgeH + (digits - 1) * 10;

        // The HTML for the custom cluster icon.
        // Note the use of `escAttr` for security when inserting the image URL.
        const html = `
          <div style="position:relative;width:60px;height:60px;display:inline-block;">
            <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;">
              <img src="${escAttr(img)}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div style="
              position:absolute;top:-8px;right:-8px;width:${badgeW}px;height:${badgeH}px;
              background:#007AFF;color:#fff;font:700 12px/1 'Segoe UI',sans-serif;
              padding:0 4px;border-radius:9999px;display:flex;align-items:center;
              justify-content:center;box-shadow:0 0 2px rgba(0,0,0,.25);">
              ${count}
            </div>
          </div>
        `;

        return L.divIcon({ html, className: '', iconSize: [60, 60] });

      },
      zoomToBoundsOnClick: false // Disable the default behavior of zooming in when a cluster is clicked.
    });

    // Add the newly created cluster layer to the map.
    this.map.addLayer(this.markerCluster);

    /* 4. Gallery popup on cluster click */
    // Since zoomToBoundsOnClick is false, we can define our own click behavior.
    this.markerCluster.on('clusterclick', (e: IClusterClickEvent) => { // FIX: Use a specific event type instead of 'any'.
      const markers = e.layer.getAllChildMarkers(); // FIX: Removed unnecessary cast to 'L.Marker<any>[]'.
      if (!markers.length) return;

      // Create a simple image gallery from all the images within the cluster.
      const imgList = markers.map(m => sanitizeUrl(m.options.data?.img as string));
      let current = 0; // Index of the currently displayed image.

      // Programmatically create the HTML elements for the gallery popup using Leaflet's DOM utilities.
      const container = L.DomUtil.create('div', styles.galleryContainer);

      const imgEl = L.DomUtil.create('img', styles.popupImg, container) as HTMLImageElement;
      imgEl.src = imgList[0];

      const nav = L.DomUtil.create('div', styles.galleryNav, container);

      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '◀';
      prevBtn.onclick = () => {
        current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
        imgEl.src = imgList[current];
      };

      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = '▶';
      nextBtn.onclick = () => {
        current = (current + 1) % imgList.length; // Cycle forwards.
        imgEl.src = imgList[current];
      };

      // Create and open the Leaflet popup at the cluster's location, containing the gallery.
      L.popup({ className: 'photoGalleryPopup', maxWidth: 300 })
        .setLatLng(e.latlng)
        .setContent(container)
        .openOn(this.map!);
    });

    /* 5. First data load + 30-sec interval */
    this.loadMapData(); // Load the data immediately.
    //this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000); // And then reload every 30 seconds.
  }














/**
 * Add ArcGIS tile layer to the map
 */
private addArcGISTileLayer(): void {
  if (!this.map) return;

  // Your ArcGIS webmap ID extracted from the URL
  const webmapId = '37606acca6044778bd937f21303a4503';
  
  // ArcGIS Online tile service URL pattern
  const arcgisTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  try {
    L.tileLayer(arcgisTileUrl, {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
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
    let allFeatures: any[] = [];
    let resultOffset = 0;
    let hasMore = true;
    
    while (hasMore) {
      const queryParams = new URLSearchParams({
        'where': '1=1',
        'outFields': 'Layer,RefName,Entity', // Only request fields needed for styling
        'f': 'geojson',
        'outSR': '4326',
        'returnGeometry': 'true',
        'resultOffset': resultOffset.toString(),
        'resultRecordCount': maxRecordCount.toString(),
        'geometryPrecision': '6' // Reduce precision for better performance
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
      
      // Zoom to the layer bounds if it's the BR_Leverkusen layer
      if (layerConfig.title && layerConfig.title.includes('Leverkusen') && allFeatures.length > 0) {
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          this.map!.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  } catch (error) {
    console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
  }
}

/**
 * Create popup content for features
 */

/*
private createPopupContent(properties: any, layerConfig: any): string {
  let content = `<div style="max-width: 300px;">`;
  content += `<h4>${layerConfig.title || 'Feature'}</h4>`;
  
  // Show key properties
  const keyFields = ['RefName', 'Layer', 'Entity', 'DocName', 'Color'];
  
  keyFields.forEach(field => {
    if (properties[field] !== undefined && properties[field] !== null && properties[field] !== '') {
      content += `<strong>${field}:</strong> ${properties[field]}<br>`;
    }
  });
  
  // Add a "Show all" details section
  content += `<details style="margin-top: 10px;">`;
  content += `<summary>Show all properties</summary>`;
  
  Object.keys(properties).forEach(key => {
    if (keyFields.indexOf(key) === -1 && properties[key] !== undefined && properties[key] !== null && properties[key] !== '') {
      content += `<strong>${key}:</strong> ${properties[key]}<br>`;
    }
  });
  
  content += `</details>`;
  content += `</div>`;
  
  return content;
}
*/

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














  /* ------------------------------------------------------------- */
  /* List→markers                                                  */
  /* ------------------------------------------------------------- */
  /**
   * Fetches data from the configured SharePoint list and populates the map with markers.
   */
  private loadMapData(): void {
    // Guard clause: do nothing if the cluster layer isn't ready.
    if (!this.markerCluster) return;

    // Get the configured properties.
    const { listName, latField, lonField, imgField } = this.properties;
    // Guard clause: do nothing if essential properties are not configured.
    if (!listName || !latField || !lonField || !imgField) return;

    // Construct the SharePoint REST API URL.
    const site = this.context.pageContext.web.absoluteUrl;
    const listPart = escODataIdentifier(listName); // Safely escape list name.
    // Select only the columns we need, escaping each field name for security.
    const selectFields = [latField, lonField, imgField]
      .map(f => escODataIdentifier(f)) // Security
      .join(',');

    const url =
      `${site}/_api/web/lists/getByTitle('${listPart}')/items` +
      `?$select=${selectFields}`;

    // Use spHttpClient to make the GET request to SharePoint.
    this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((r: SPHttpClientResponse) => r.json())
      .then(json => {
        const items = json.value as IWebmapListItem[];
        this.markerCluster!.clearLayers(); // Clear all old markers before adding new ones.

        // NEW: Create an array to hold all valid coordinates
        const allLatLngs: L.LatLng[] = [];

        items.forEach(item => {
          // FIX: Add type assertions when accessing properties from an 'unknown' type.
          const imgData = item[imgField] as { Url: string };
          // Ensure the item has the necessary data. The image is often in a sub-property like 'Url'.
          if (!item[latField] || !item[lonField] || !imgData?.Url) return;

          const rawImg = imgData.Url;
          const img = sanitizeUrl(rawImg); // Sanitize the URL before use.
          if (!img) return; // Skip if the URL is invalid.

          // Parse coordinates.
          const lat = parseFloat(item[latField] as string);
          const lon = parseFloat(item[lonField] as string);

          // NEW: Check if coordinates are valid numbers before using them
          if (isNaN(lat) || isNaN(lon)) return;

          // NEW: Add the valid coordinates to our array
          allLatLngs.push(L.latLng(lat, lon));

          // Create an "enriched" version of the item with the sanitized img URL for easy access.
          const enriched = { ...item, img };  // copy all properties of item and add sanitized img url

          // Create a custom icon for the individual marker (not a cluster).
          const icon = L.divIcon({
            html: `<img src="${img}" style="width:40px;height:40px;border-radius:5px;" />`,
            className: '',
            iconSize: [40, 40]
          });

          // Create the Leaflet marker with coordinates, the custom icon, and our enriched data payload.
          const marker = L.marker([lat, lon], { icon, data: enriched });

          // Bind a simple popup to the individual marker, showing its image.
          marker.bindPopup(`
          <div>
            <img src="${img}" class="${styles.popupImg}" />
          </div>
          `);

          // Add the final marker to the cluster layer.
          this.markerCluster!.addLayer(marker);
        });


        // NEW: After processing all items, check if we have any coordinates
        if (allLatLngs.length > 0 && this.map) {
          // Create a bounding box around all points
          const bounds = L.latLngBounds(allLatLngs);
          // Tell the map to fit itself to these bounds, with a little padding
          this.map.fitBounds(bounds.pad(0.1));
        }


      })
      .catch(err => console.error('Webmap → list fetch failed:', err));
  }

  /* ------------------------------------------------------------- */
  /* Property-pane                                                 */
  /* ------------------------------------------------------------- */
  /**
   * Defines the configuration for the web part's property pane (the settings panel).
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Start with the base group that is always visible
    const groups: IPropertyPaneGroup[] = [
      {
        groupName: 'Choose Data Source Type',
        groupFields: [
          PropertyPaneDropdown('dataSourceType', {
            label: 'Source Type',
            options: [
              // Add a placeholder option for the unselected state
              { key: '', text: ' ' },
              { key: 'List', text: 'SharePoint List' },
              { key: 'DocumentLibrary', text: 'Document Library' }
            ],
            // Default to the empty string key
            selectedKey: this.properties.dataSourceType || '',
          })
        ]
      }
    ];

    // --- Conditionally add the next group based on the selection ---

    // If 'SharePoint List' is selected, push its configuration group
    if (this.properties.dataSourceType === 'List') {
      groups.push({
        groupName: 'Select List and Fields',
        groupFields: [
          PropertyPaneDropdown('listName', {
            label: 'List',
            options: this._lists,
            disabled: !this._lists.length
          }),
          PropertyPaneDropdown('latField', {
            label: 'Latitude Field',
            options: this._fields,
            disabled: !this._fields.length
          }),
          PropertyPaneDropdown('lonField', {
            label: 'Longitude Field',
            options: this._fields,
            disabled: !this._fields.length
          }),
          PropertyPaneDropdown('imgField', {
            label: 'Image Field',
            options: this._fields,
            disabled: !this._fields.length
          }),
        ]
      });
    }
    // Else if 'Document Library' is selected, push its group
    else if (this.properties.dataSourceType === 'DocumentLibrary') {
      groups.push({
        groupName: 'Select Document Library',
        groupFields: [
          PropertyPaneDropdown('libraryName', {
            label: 'Document Library',
            options: this._lists,
            disabled: !this._lists.length
          })
        ]
      });
    }

    return {
      pages: [
        {
          header: { description: '' },
          // Use the dynamically constructed groups array
          groups: groups
        }
      ]
    };
  }

  /* ------------------------------------------------------------- */
  /* Dynamic options loader                                        */
  /* ------------------------------------------------------------- */
  /**
   * This SPFx lifecycle method is called when the property pane is opened.
   * It's used here to dynamically load the list of available SharePoint lists.
   */
  protected onPropertyPaneConfigurationStart(): void {
    const site = this.context.pageContext.web.absoluteUrl;
    // Check if we need to fetch lists (i.e., if the site context has changed).
    if (site !== this._siteForLists) {
      // Clear all cached options and selections.
      this._lists = [];
      this._fields = [];
      this.properties.listName = '';
      this.properties.libraryName = '';

      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';

      this._siteForLists = site; // Update the cache key.

      // Fetch lists depending on dataSourceType
      // FIX: Use 'const' because this variable is never reassigned.
      const baseTemplateFilter = this.properties.dataSourceType === 'DocumentLibrary' ? 101 : 100;

      // Fetch all non-hidden lists / documentLibraries from the current site.
      const listsUrl = `${site}/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq ${baseTemplateFilter}`;
      this.context.spHttpClient
        .get(listsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Map the API response to the format required by PropertyPaneDropdown.
          // FIX: Use the specific ISPList interface instead of 'any'.
          this._lists = json.value.map((l: ISPList) => ({
            key: l.Title,
            text: l.Title
          })) as IPropertyPaneDropdownOption[];

          // Refresh the property pane to show the newly loaded lists.
          this.context.propertyPane.refresh();
        })
        .catch(err => console.error('Webmap → list enumeration failed:', err));
    }
  }

  /**
   * This SPFx lifecycle method is called whenever a property pane field is changed by the user.
   */
  protected onPropertyPaneFieldChanged(path: string, oldValue: unknown, newValue: unknown): void {
    if (path === 'dataSourceType' && newValue !== oldValue) {
      this._lists = [];
      this.properties.listName = '';
      this.properties.libraryName = '';
      this._siteForLists = null;  // Reset cache to force reload

      // Refresh property pane dropdowns immediately
      this.context.propertyPane.refresh();

      // Trigger the async fetch of new lists for the selected dataSourceType
      this.onPropertyPaneConfigurationStart();

      // Optionally, re-render web part to reflect changes
      //this.render();
    }



    /* Reload field dropdowns when the list changes */
    if (path === 'listName' && newValue && newValue !== this._listForFields && this.properties.dataSourceType === 'List') {
      // Clear old field options and selections.
      this._fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._listForFields = newValue as string; // Update the cache key.

      const site = this.context.pageContext.web.absoluteUrl;
      // Fetch all non-hidden, non-readonly fields for the newly selected list.
      const fieldsUrl =
        `${site}/_api/web/lists/getByTitle('${escODataIdentifier(newValue as string)}')/fields` +
        `?$filter=Hidden eq false and ReadOnlyField eq false`;

      this.context.spHttpClient
        .get(fieldsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Only show field types that are likely to contain the required data.
          const okTypes = ['Text', 'Number', 'URL'];
          // FIX: Use the specific ISPField interface instead of 'any'.
          this._fields = json.value
            .filter((f: ISPField) => okTypes.indexOf(f.TypeAsString) !== -1)
            .map((f: ISPField) => ({
              key: f.InternalName, // Use the internal name for API calls.
              text: f.Title        // Show the user-friendly display name.
            })) as IPropertyPaneDropdownOption[];

          // Refresh the property pane to show the new field options.
          this.context.propertyPane.refresh();
        })
        .catch(err => console.error('Webmap → field enumeration failed:', err));
    }

    /* Re-render map whenever any data-source field changes */
    // If any of the core data properties have changed, trigger a full re-render of the web part.
    if (['listName', 'latField', 'lonField', 'imgField', 'libraryName'].indexOf(path) !== -1) {
      this.render();
    }
  }

  /* ------------------------------------------------------------- */
  /* Clean-up                                                      */
  /* ------------------------------------------------------------- */
  /**
   * This SPFx lifecycle method is called when the web part is removed from the page.
   * It's crucial for cleaning up resources to prevent memory leaks.
   */
  protected onDispose(): void {
    // Completely remove the map instance and its event listeners.
    this.map?.remove();
    // Stop the data refresh timer.
    if (this.dataTimer) window.clearInterval(this.dataTimer);
  }

  /* ------------------------------------------------------------- */
  /* SPFx boiler-plate                                             */
  /* ------------------------------------------------------------- */
  /**
   * Standard SPFx property to get the version of the data structure.
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}