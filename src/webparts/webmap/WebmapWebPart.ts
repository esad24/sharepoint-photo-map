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
  IPropertyPaneGroup,
  //PropertyPaneCheckbox
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
import { ArcGISMapService } from './services/ArcgisMap';


// Imports the web part's specific styles defined in a SASS module.
import styles from './WebmapWebPart.module.scss';

// Import security functions
import { escODataIdentifier, sanitizeUrl, escAttr } from './utils/security'; // Security helpers for escaping identifiers and URLs.

// Import EXIF parsing library
import * as EXIF from 'exif-js';

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
  libraryMethod?: 'columns' | 'exif'; // method for document library
  useExifData?: boolean; // flag to use EXIF data extraction
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
  private arcgisMap: ArcGISMapService | undefined;     // Holds the ArcGIS service instance.

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
    /* 1. Dispose previous instance (avoid "Map container is already initialized") */
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

    
 /* 3. Add ArcGIS tile layer */
    // Initialize the ArcGIS service and add the tile layer
    this.arcgisMap = new ArcGISMapService(this.map);
    this.arcgisMap.addArcGISTileLayer();

    

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


  /* ------------------------------------------------------------- */
  /* EXIF Data Extraction                                          */
  /* ------------------------------------------------------------- */
  /**
   * Extracts GPS coordinates from image EXIF data
   */
  private extractGPSFromExif(imageUrl: string): Promise<{lat: number, lon: number} | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      
      img.onload = function() {
        EXIF.getData(img as any, function() {
          const lat = EXIF.getTag(this, 'GPSLatitude');
          const lon = EXIF.getTag(this, 'GPSLongitude');
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');
          
          if (lat && lon) {
            // Convert GPS coordinates from degrees/minutes/seconds to decimal
            const decimalLat = WebmapWebPart.convertDMSToDD(lat, latRef);
            const decimalLon = WebmapWebPart.convertDMSToDD(lon, lonRef);
            
            if (decimalLat !== null && decimalLon !== null) {
              resolve({ lat: decimalLat, lon: decimalLon });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  }

  /**
   * Converts GPS coordinates from degrees/minutes/seconds to decimal degrees
   */
  private static convertDMSToDD(dms: number[], ref: string): number | null {
    if (!dms || dms.length !== 3) return null;
    
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    
    return dd;
  }

  /**
   * Shows a toast notification
   */
  private showToast(message: string, type: 'info' | 'error' = 'info'): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'error' ? '#d32f2f' : '#1976d2'};
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  }


  /* ------------------------------------------------------------- */
  /* List→markers                                                  */
  /* ------------------------------------------------------------- */
  /**
   * Fetches data from the configured SharePoint list and populates the map with markers.
   */
  private async loadMapData(): Promise<void> {
    // Guard clause: do nothing if the cluster layer isn't ready.
    if (!this.markerCluster) return;

    // Handle different data source types
    if (this.properties.dataSourceType === 'List') {
      await this.loadListData();
    } else if (this.properties.dataSourceType === 'DocumentLibrary') {
      await this.loadDocumentLibraryData();
    }
  }

  /**
   * Loads data from SharePoint list
   */
  private async loadListData(): Promise<void> {
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

    try {
      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
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
    } catch (err) {
      console.error('Webmap → list fetch failed:', err);
    }
  }

  /**
   * Loads data from Document Library
   */
  private async loadDocumentLibraryData(): Promise<void> {
    const { libraryName, libraryMethod, latField, lonField, imgField } = this.properties;
    
    if (!libraryName) return;

    const site = this.context.pageContext.web.absoluteUrl;
    const libraryPart = escODataIdentifier(libraryName);

    try {
      let url: string;
      let selectFields: string;

      if (libraryMethod === 'columns' && latField && lonField && imgField) {
        // Method 1: Use columns from the library
        selectFields = ['FileRef', latField, lonField, imgField]
          .map(f => escODataIdentifier(f))
          .join(',');
        
        url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0`;
      } else {
        // Method 2: Use EXIF data - just get image files
        url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=FileRef,FileLeafRef&$filter=FSObjType eq 0`;
      }

      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value;
      
      this.markerCluster!.clearLayers();
      const allLatLngs: L.LatLng[] = [];
      
      let noGpsCount = 0;

      for (const item of items) {
        const fileUrl = `${site}${item.FileRef}`;
        const fileName = item.FileLeafRef;
        
        // Check if it's an image file
        if (!this.isImageFile(fileName)) continue;

        let lat: number | null = null;
        let lon: number | null = null;
        let img: string = fileUrl;

        if (libraryMethod === 'columns' && latField && lonField) {
          // Method 1: Get coordinates from columns
          if (item[latField] && item[lonField]) {
            lat = parseFloat(item[latField] as string);
            lon = parseFloat(item[lonField] as string);
          }
          
          // Get image URL if specified
          if (imgField && item[imgField]) {
            const imgData = item[imgField] as { Url: string } | string;
            img = typeof imgData === 'object' ? imgData.Url : imgData;
          }
        } else {
          // Method 2: Extract from EXIF
          const gpsData = await this.extractGPSFromExif(fileUrl);
          if (gpsData) {
            lat = gpsData.lat;
            lon = gpsData.lon;
          } else {
            noGpsCount++;
          }
        }

        // Skip if no valid coordinates
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

        // Add valid coordinates
        allLatLngs.push(L.latLng(lat, lon));

        // Create marker
        const sanitizedImg = sanitizeUrl(img);
        if (!sanitizedImg) continue;

        const enriched = { ...item, img: sanitizedImg };

        const icon = L.divIcon({
          html: `<img src="${sanitizedImg}" style="width:40px;height:40px;border-radius:5px;" />`,
          className: '',
          iconSize: [40, 40]
        });

        const marker = L.marker([lat, lon], { icon, data: enriched });
        
        marker.bindPopup(`
          <div>
            <img src="${sanitizedImg}" class="${styles.popupImg}" />
            <p style="margin: 10px 0 0; text-align: center; font-size: 12px;">${fileName}</p>
          </div>
        `);

        this.markerCluster!.addLayer(marker);
      }

      // Show toast if EXIF method and some images had no GPS data
      if (libraryMethod === 'exif' && noGpsCount > 0) {
        this.showToast(`${noGpsCount} image(s) have no GPS data in EXIF`, 'error');
      }

      // Fit map to bounds
      if (allLatLngs.length > 0 && this.map) {
        const bounds = L.latLngBounds(allLatLngs);
        this.map.fitBounds(bounds.pad(0.1));
      }

    } catch (err) {
      console.error('Webmap → document library fetch failed:', err);
      this.showToast('Failed to load images from document library', 'error');
    }
  }

  /**
   * Checks if a file is an image based on its extension
   */
  private isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.indexOf(ext) !== -1;
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
          }),
          PropertyPaneDropdown('libraryMethod', {
            label: 'Location Method',
            options: [
              { key: 'columns', text: 'Use Library Columns' },
              { key: 'exif', text: 'Extract from Image EXIF Data' }
            ],
            selectedKey: this.properties.libraryMethod || 'exif'
          })
        ]
      });

      // If columns method is selected, show field selectors
      if (this.properties.libraryMethod === 'columns') {
        groups.push({
          groupName: 'Select Location Columns',
          groupFields: [
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
              label: 'Image Field (optional)',
              options: this._fields,
              disabled: !this._fields.length
            })
          ]
        });
      }
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
      this.properties.libraryMethod = 'exif'; // Default to EXIF method
      this._siteForLists = null;  // Reset cache to force reload

      // Refresh property pane dropdowns immediately
      this.context.propertyPane.refresh();

      // Trigger the async fetch of new lists for the selected dataSourceType
      this.onPropertyPaneConfigurationStart();

      // Optionally, re-render web part to reflect changes
      //this.render();
    }

    /* Handle library method change */
    if (path === 'libraryMethod') {
      // Clear field selections when switching methods
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._fields = [];
      
      // If switching to columns method, trigger field loading
      if (newValue === 'columns' && this.properties.libraryName) {
        this._listForFields = null; // Force reload
        this.onPropertyPaneFieldChanged('libraryName', '', this.properties.libraryName);
      }
      
      this.context.propertyPane.refresh();
    }

    /* Reload field dropdowns when the list/library changes */
    if ((path === 'listName' || path === 'libraryName') && newValue && newValue !== this._listForFields) {
      // Only load fields if we're using columns method for document library
      const shouldLoadFields = this.properties.dataSourceType === 'List' || 
                              (this.properties.dataSourceType === 'DocumentLibrary' && this.properties.libraryMethod === 'columns');
      
      if (!shouldLoadFields) return;

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
    if (['listName', 'latField', 'lonField', 'imgField', 'libraryName', 'libraryMethod'].indexOf(path) !== -1) {
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