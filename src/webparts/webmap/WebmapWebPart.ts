/* ========================================================================== */
/* WebmapWebPart.ts                                                          */
/* - SPFx client-side web-part                                                 */
/* - Leaflet map with clustered picture markers                                */
/* - Fully configurable in the property-pane:                                  */
/* - Site URL                                                                   */
/* - List                                                                       */
/* - Latitude column                                                            */
/* - Longitude column                                                           */
/* - Image column                                                               */
/* ========================================================================== */

// Imports from the SharePoint Framework (SPFx) libraries.
import { Version } from '@microsoft/sp-core-library'; // Used for versioning the web part.
import {
  IPropertyPaneConfiguration,     // Interface for defining the entire property pane's structure.
  PropertyPaneDropdown,           // A dropdown control for the property pane.
  IPropertyPaneDropdownOption     // Interface for the options within a dropdown control.
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; // The base class for all client-side web parts.
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'; // Used for making REST API calls to SharePoint.


// Imports for the Leaflet mapping library and its marker cluster plugin.
import * as L from 'leaflet';              // The core Leaflet library.
import 'leaflet/dist/leaflet.css';         // Default CSS for Leaflet for proper rendering of map controls, etc.

import 'leaflet.markercluster';            // The marker cluster plugin logic.
import 'leaflet.markercluster/dist/MarkerCluster.css';         // Main CSS for the cluster plugin.
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Default theme for the cluster icons.

// Imports the web part's specific styles defined in a SASS module.
import styles from './WebmapWebPart.module.scss';

// Impoer security functions
import { escODataIdentifier, sanitizeUrl, escAttr } from './utils/security'; // Security helpers for escaping identifiers and URLs.

/* ------------------------------------------------------------------ */
/* Helpers & typings                                                */
/* ------------------------------------------------------------------ */

/**
 * This is a TypeScript feature called "module augmentation".
 * We are extending the original 'leaflet' module to add a custom 'data' property
 * to the MarkerOptions interface. This allows us to attach the raw SharePoint list item
 * object directly to a Leaflet marker, making it easy to access later (e.g., in popups).
 */
declare module 'leaflet' {
  interface MarkerOptions {
    data?: any; // Allow storing the raw list item.
  }
}

/**
 * Defines the structure for a SharePoint list item that will be used for mapping.
 * It uses an index signature [key: string]: any to allow for dynamic property access,
 * since the actual names for latitude, longitude, and image columns are determined at
 * run-time from the web part properties.
 */
interface IWebmapListItem {
  [key: string]: any;  // Any number and types of properties
  img?: string; // alias image URL
}

/**
 * Defines the properties of the web part that can be configured by the user
 * in the property pane. These properties are saved with the web part instance.
 */
export interface IWebmapWebPartProps {
  listName: string; // The title of the SharePoint list to fetch data from.
  latField: string; // The internal name of the column containing the latitude.
  lonField: string; // The internal name of the column containing the longitude.
  imgField: string; // The internal name of the column containing the image.
}

/* ------------------------------------------------------------------ */
/* Web-part                                                         */
/* ------------------------------------------------------------------ */

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  /* ––– Members that survive re-renders ––––––––––––––––––––––––––– */
  // These class members hold state that should persist across web part re-renders.
  private map: L.Map | undefined;                      // Holds the Leaflet map instance.
  private markerCluster: L.MarkerClusterGroup | undefined; // Holds the marker cluster layer instance.
  private dataTimer: number | undefined;               // Holds the ID of the setInterval timer for data refreshes.

  // Caching for property pane dropdown options to avoid redundant API calls.
  private _lists: IPropertyPaneDropdownOption[] = [];  // Cached list of SharePoint lists.
  private _fields: IPropertyPaneDropdownOption[] = []; // Cached list of fields for the selected list.

  // Keys to check if the cache is still valid.
  private _siteForLists: string | null = null;   // The site URL for which the `_lists` cache is valid.
  private _listForFields: string | null = null;  // The list name for which the `_fields` cache is valid.

  

  
  /* ------------------------------------------------------------- */
  /* RENDER                                                      */
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
  /* Map creation / refresh                                     */
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
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    

    /* 3. Cluster layer */
    // Initialize the marker cluster group.
    this.markerCluster = L.markerClusterGroup({
      // `iconCreateFunction` is a customization that defines how a cluster icon looks.
      iconCreateFunction: (cluster) => {
        // Get the first marker in the cluster to use its image for the cluster icon.
        const first: any = cluster.getAllChildMarkers()[0];
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

        // Return a DivIcon, which allows using custom HTML for an icon.
        return L.divIcon({ html, className: '', iconSize: [60, 60] });
      },
      zoomToBoundsOnClick: false // Disable the default behavior of zooming in when a cluster is clicked.
    });

    // Add the newly created cluster layer to the map.
    this.map.addLayer(this.markerCluster);

    /* 4. Gallery popup on cluster click */
    // Since zoomToBoundsOnClick is false, we can define our own click behavior.
    this.markerCluster.on('clusterclick', (e: any) => {
      const markers = e.layer.getAllChildMarkers() as L.Marker<any>[];
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
  /* List→markers                                                */
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
      .then((r: SPHttpClientResponse) => r.json()) // Parse the response as JSON.
      .then(json => {
        const items = json.value as IWebmapListItem[];
        this.markerCluster!.clearLayers(); // Clear all old markers before adding new ones.

        items.forEach(item => {
          // Ensure the item has the necessary data. The image is often in a sub-property like 'Url'.
          if (!item[latField] || !item[lonField] || !item[imgField]?.Url) return;

          const rawImg = (item[imgField].Url as string);
          const img = sanitizeUrl(rawImg); // Sanitize the URL before use.
          if (!img) return; // Skip if the URL is invalid.

          // Parse coordinates.
          const lat = parseFloat(item[latField]);
          const lon = parseFloat(item[lonField]);

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
      })
      .catch(err => console.error('Webmap → list fetch failed:', err));
  }

  /* ------------------------------------------------------------- */
  /* Property-pane                                              */
  /* ------------------------------------------------------------- */
  /**
   * Defines the configuration for the web part's property pane (the settings panel).
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Data Source' },
          groups: [
            {
              groupName: 'Choose a Photo-List?',
              groupFields: [
                // Dropdown for selecting the SharePoint list.
                PropertyPaneDropdown('listName', {
                  label: 'List',
                  options: this._lists, // Populated dynamically.
                  disabled: !this._lists.length // Disabled until lists are loaded.
                })
              ]
            },
            {
              groupName: 'Which columns contain…',
              groupFields: [
                // Dropdown for the Latitude field.
                PropertyPaneDropdown('latField', {
                  label: 'Latitude',
                  options: this._fields, // Populated dynamically based on selected list.
                  disabled: !this._fields.length
                }),
                // Dropdown for the Longitude field.
                PropertyPaneDropdown('lonField', {
                  label: 'Longitude',
                  options: this._fields,
                  disabled: !this._fields.length
                }),
                // Dropdown for the Image field.
                PropertyPaneDropdown('imgField', {
                  label: 'Image',
                  options: this._fields,
                  disabled: !this._fields.length
                })
              ]
            }
          ]
        }
      ]
    };
  }

  /* ------------------------------------------------------------- */
  /* Dynamic options loader                                     */
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
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._siteForLists = site; // Update the cache key.

      // Fetch all non-hidden lists from the current site.
      const listsUrl = `${site}/_api/web/lists?$filter=Hidden eq false`;
      this.context.spHttpClient
        .get(listsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Map the API response to the format required by PropertyPaneDropdown.
          this._lists = json.value.map((l: any) => ({
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
  protected onPropertyPaneFieldChanged(path: string, oldValue: any, newValue: any): void {
    /* Reload field dropdowns when the list changes */
    if (path === 'listName' && newValue && newValue !== this._listForFields) {
      // Clear old field options and selections.
      this._fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._listForFields = newValue; // Update the cache key.

      const site = this.context.pageContext.web.absoluteUrl;
      // Fetch all non-hidden, non-readonly fields for the newly selected list.
      const fieldsUrl =
        `${site}/_api/web/lists/getByTitle('${escODataIdentifier(newValue)}')/fields` +
        `?$filter=Hidden eq false and ReadOnlyField eq false`;

      this.context.spHttpClient
        .get(fieldsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Only show field types that are likely to contain the required data.
          const okTypes = ['Text', 'Number', 'URL'];
          this._fields = json.value
            .filter((f: any) => okTypes.indexOf(f.TypeAsString) !== -1)
            .map((f: any) => ({
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
    if (['listName', 'latField', 'lonField', 'imgField'].indexOf(path) !== -1) {
      this.render();
    }
  }

  /* ------------------------------------------------------------- */
  /* Clean-up                                                   */
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
  /* SPFx boiler-plate                                          */
  /* ------------------------------------------------------------- */
  /**
   * Standard SPFx property to get the version of the data structure.
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}