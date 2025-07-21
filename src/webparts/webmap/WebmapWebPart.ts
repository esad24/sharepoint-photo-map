/* ========================================================================== */
/* WebmapWebPart.ts                                                           */
/* - SPFx client-side web-part                                                */
/* - Leaflet map with clustered picture markers                               */
/* - Displays images from SharePoint document libraries                       */
/* - Configurable GPS extraction method:                                      */
/*   - EXIF data extraction                                                   */
/*   - Manual coordinate fields                                               */
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

// Import the new DataService
import { DataService, IMapItem } from './services/DataService';

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
  libraryName: string; // for document library
  locationMethod: 'exif' | 'manual'; // method for getting GPS coordinates
  latField: string; // The internal name of the column containing the latitude.
  lonField: string; // The internal name of the column containing the longitude.
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
  private dataService: DataService | undefined;        // Holds the data service instance.

  // Caching for property pane dropdown options to avoid redundant API calls.
  private _libraries: IPropertyPaneDropdownOption[] = [];  // Cached list of SharePoint document libraries.
  private _fields: IPropertyPaneDropdownOption[] = []; // Cached list of fields for the selected library.

  // Keys to check if the cache is still valid.
  private _siteForLibraries: string | null = null;   // The site URL for which the `_libraries` cache is valid.
  private _libraryForFields: string | null = null;  // The library name for which the `_fields` cache is valid.




  /* ------------------------------------------------------------- */
  /* RENDER                                                        */
  /* ------------------------------------------------------------- */
  /**
   * The main render method called by the SPFx framework to display the web part.
   */
  private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;

  public render(): void {
    // Initialize the data service if not already done
    if (!this.dataService) {
      this.dataService = new DataService(this.context);
    }

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

  /**
   * Shows a toast notification
   */
  private showToast(message: string, type: 'info' | 'error' = 'info'): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'error' ? '#d32f2f' : '#1976d2'};
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
      animation: slideUp 0.3s ease-out;
    `;
    toast.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { 
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
        }
        to { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideDown {
        from { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to { 
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  }


  /* ------------------------------------------------------------- */
  /* Load data from map                                            */
  /* ------------------------------------------------------------- */
  /**
   * Fetches data from the configured SharePoint document library and populates the map with markers.
   */
  private async loadMapData(): Promise<void> {
    // Guard clause: do nothing if the cluster layer isn't ready.
    if (!this.markerCluster || !this.dataService) return;

    // Use the DataService to fetch data
    const result = await this.dataService.fetchMapData(this.properties);

    // Clear all old markers before adding new ones.
    this.markerCluster.clearLayers();

    // Create an array to hold all valid coordinates
    const allLatLngs: L.LatLng[] = [];

    // Process the fetched items
    result.items.forEach((item: IMapItem) => {
      // Add the valid coordinates to our array
      allLatLngs.push(L.latLng(item.lat, item.lon));

      // Create a custom icon for the individual marker (not a cluster).
      const icon = L.divIcon({
        html: `<img src="${item.img}" style="width:40px;height:40px;border-radius:5px;" />`,
        className: '',
        iconSize: [40, 40]
      });

      // Create the Leaflet marker with coordinates, the custom icon, and our enriched data payload.
      const marker = L.marker([item.lat, item.lon], { icon, data: item.data });

      // Bind a simple popup to the individual marker, showing its image.
      marker.bindPopup(`
        <div>
          <img src="${item.img}" class="${styles.popupImg}" />
        </div>
      `);

      // Add the final marker to the cluster layer.
      this.markerCluster!.addLayer(marker);
    });

    // After processing all items, check if we have any coordinates
    if (allLatLngs.length > 0 && this.map) {
      // Create a bounding box around all points
      const bounds = L.latLngBounds(allLatLngs);
      // Tell the map to fit itself to these bounds, with a little padding
      this.map.fitBounds(bounds.pad(0.1));
    }

    // Show any errors that occurred during fetching
    result.errors.forEach(error => {
      this.showToast(error, 'error');
    });
  }

  /* ------------------------------------------------------------- */
  /* Property-pane                                                 */
  /* ------------------------------------------------------------- */
  /**
   * Defines the configuration for the web part's property pane (the settings panel).
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Start with the base groups
    const groups: IPropertyPaneGroup[] = [
      {
        groupName: 'Data Source Configuration',
        groupFields: [
          PropertyPaneDropdown('libraryName', {
            label: 'Document Library',
            options: this._libraries,
            disabled: !this._libraries.length
          }),
          PropertyPaneDropdown('locationMethod', {
            label: 'Location Method',
            options: [
              { key: 'exif', text: 'Extract from Image EXIF Data' },
              { key: 'manual', text: 'Select latitude and longitude fields' }
            ],
            selectedKey: this.properties.locationMethod || 'exif'
          })
        ]
      }
    ];

    // If manual method is selected, show field selectors
    if (this.properties.locationMethod === 'manual') {
      groups.push({
        groupName: 'Coordinate Fields',
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
          })
        ]
      });
    }

    return {
      pages: [
        {
          header: { description: '' },
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
   * It's used here to dynamically load the list of available SharePoint document libraries.
   */
  protected onPropertyPaneConfigurationStart(): void {
    const site = this.context.pageContext.web.absoluteUrl;
    // Check if we need to fetch libraries (i.e., if the site context has changed).
    if (site !== this._siteForLibraries) {
      // Clear all cached options and selections.
      this._libraries = [];
      this._fields = [];
      this.properties.libraryName = '';
      this.properties.latField = '';
      this.properties.lonField = '';

      this._siteForLibraries = site; // Update the cache key.

      // Fetch all non-hidden document libraries from the current site.
      const librariesUrl = `${site}/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq 101`;
      this.context.spHttpClient
        .get(librariesUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Map the API response to the format required by PropertyPaneDropdown.
          // FIX: Use the specific ISPList interface instead of 'any'.
          this._libraries = json.value.map((l: ISPList) => ({
            key: l.Title,
            text: l.Title
          })) as IPropertyPaneDropdownOption[];

          // Refresh the property pane to show the newly loaded libraries.
          this.context.propertyPane.refresh();
        })
        .catch(err => console.error('Webmap → library enumeration failed:', err));
    }
  }

  /**
   * This SPFx lifecycle method is called whenever a property pane field is changed by the user.
   */
  protected onPropertyPaneFieldChanged(path: string, oldValue: unknown, newValue: unknown): void {
    /* Handle location method change */
    if (path === 'locationMethod') {
      // Clear field selections when switching methods
      this.properties.latField = '';
      this.properties.lonField = '';
      this._fields = [];
      
      // If switching to manual method, trigger field loading
      if (newValue === 'manual' && this.properties.libraryName) {
        this._libraryForFields = null; // Force reload
        this.onPropertyPaneFieldChanged('libraryName', '', this.properties.libraryName);
      }
      
      this.context.propertyPane.refresh();
    }

    /* Reload field dropdowns when the library changes */
    if (path === 'libraryName' && newValue && newValue !== this._libraryForFields) {
      // Only load fields if we're using manual method
      if (this.properties.locationMethod !== 'manual') return;
      
      // Clear old field options and selections.
      this._fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this._libraryForFields = newValue as string; // Update the cache key.

      const site = this.context.pageContext.web.absoluteUrl;
      // Fetch all non-hidden, non-readonly fields for the newly selected library.
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
    if (['libraryName', 'locationMethod', 'latField', 'lonField'].indexOf(path) !== -1) {
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