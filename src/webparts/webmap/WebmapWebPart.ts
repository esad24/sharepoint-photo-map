/* ========================================================================== */
/* WebmapWebPart.ts                                                           */
/* - SPFx client-side web-part                                                */
/* - Leaflet map with clustered picture markers                               */
/* - Displays images from SharePoint document libraries                       */
/* - Configurable GPS extraction method:                                      */
/*   - EXIF data extraction                                                   */
/*   - Manual coordinate fields                                               */
/* - Configurable map types:                                                  */
/*   - OpenStreetMap                                                          */
/*   - ArcGIS Web Map                                                         */
/* ========================================================================== */

// Imports from the SharePoint Framework (SPFx) libraries.
import { Version } from '@microsoft/sp-core-library'; // Used for versioning the web part.
import {
  IPropertyPaneConfiguration,     // Interface for defining the entire property pane's structure.
  PropertyPaneDropdown,           // A dropdown control for the property pane.
  IPropertyPaneDropdownOption,    // Interface for the options within a dropdown control.
  IPropertyPaneGroup,
  PropertyPaneTextField,
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

// Map type options
type MapType = 'openstreetmap' | 'arcgis';

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
  mapType: MapType; // The type of map to use
  arcgisMapUrl: string; // The ArcGIS web map URL
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

    /* 3. Add base layer based on map type */
    if (this.properties.mapType === 'arcgis' && this.properties.arcgisMapUrl) {
      // Extract webmap ID and domain from URL
      const webmapId = this.extractWebmapId(this.properties.arcgisMapUrl);
      const domain = this.extractArcGISDomain(this.properties.arcgisMapUrl);
      
      if (webmapId && domain) {
        this.arcgisMap = new ArcGISMapService(this.map);
        this.arcgisMap.addArcGISTileLayer(webmapId, domain);
      } else {
        console.error('Invalid ArcGIS map URL format');
        this.showToast('Invalid ArcGIS map URL format', 'error');
        // Fallback to OpenStreetMap
        this.addOpenStreetMapLayer();
      }
    } else {
      // Default to OpenStreetMap
      this.addOpenStreetMapLayer();
    }

    /* 4. Cluster layer */
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

    /* 5. Gallery popup on cluster click */
    // Since zoomToBoundsOnClick is false, we can define our own click behavior.
    this.markerCluster.on('clusterclick', (e: IClusterClickEvent) => { // FIX: Use a specific event type instead of 'any'.
      const markers = e.layer.getAllChildMarkers(); // FIX: Removed unnecessary cast to 'L.Marker<any>[]'.
      if (!markers.length) return;

      // Create a simple image gallery from all the images within the cluster.
      const imgList = markers.map(m => sanitizeUrl(m.options.data?.img as string));
      let current = 0; // Index of the currently displayed image.

      // Programmatically create the HTML elements for the gallery popup using Leaflet's DOM utilities.
      const container = L.DomUtil.create('div', styles.galleryContainer);

      // Create a wrapper link for the image
      const imgLink = L.DomUtil.create('a', '', container) as HTMLAnchorElement;
      imgLink.href = imgList[0];
      imgLink.target = '_blank';
      imgLink.rel = 'noopener noreferrer';
      imgLink.style.cursor = 'pointer';

      const imgEl = L.DomUtil.create('img', styles.popupImg, imgLink) as HTMLImageElement;  
      imgEl.src = imgList[0];

      const nav = L.DomUtil.create('div', styles.galleryNav, container);

      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '◀';
      prevBtn.onclick = () => {
        current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
        imgEl.src = imgList[current];
        imgLink.href = imgList[current]; // Update the link href
      };

      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = '▶';
      nextBtn.onclick = () => {
        current = (current + 1) % imgList.length; // Cycle forwards.
        imgEl.src = imgList[current];
        imgLink.href = imgList[current]; // Update the link href
      };

      // Create and open the Leaflet popup at the cluster's location, containing the gallery.
      L.popup({ className: 'photoGalleryPopup', maxWidth: 300 })
        .setLatLng(e.latlng)
        .setContent(container)
        .openOn(this.map!);
    });

    /* 6. First data load + 30-sec interval */
    this.loadMapData(); // Load the data immediately.
    //this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000); // And then reload every 30 seconds.
  }

  /**
   * Add OpenStreetMap tile layer
   */
  private addOpenStreetMapLayer(): void {
    if (!this.map) return;
    
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  /**
   * Extract webmap ID from ArcGIS URL
   */
  private extractWebmapId(url: string): string | null {
    if (!url) return null;
    
    // Pattern: https://{domain}.maps.arcgis.com/apps/mapviewer/index.html?webmap={webmap_id}
    const urlPattern = /https?:\/\/[^\/]+\.maps\.arcgis\.com\/apps\/mapviewer\/index\.html\?webmap=([a-zA-Z0-9]+)/;
    const match = url.match(urlPattern);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // Also check for webmap ID in other common ArcGIS URL formats
    const webmapPattern = /webmap=([a-zA-Z0-9]+)/;
    const webmapMatch = url.match(webmapPattern);
    
    if (webmapMatch && webmapMatch[1]) {
      return webmapMatch[1];
    }
    
    return null;
  }

  /**
   * Extract domain from ArcGIS URL
   */
  private extractArcGISDomain(url: string): string | null {
    if (!url) return null;
    
    // Pattern to extract the domain part (e.g., "hochtiefinfra" from "hochtiefinfra.maps.arcgis.com")
    const domainPattern = /https?:\/\/([^\/]+)\.maps\.arcgis\.com/;
    const match = url.match(domainPattern);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  }

  /**
   * Shows a toast notification
   */
  private showToast(message: string, type: 'info' | 'error' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `${styles.toast} ${type === 'error' ? styles.toastError : ''}`;
    toast.textContent = message;
  
    // Add animation manually (optional, fallback for older browsers)
    toast.style.animation = 'slideUp 0.3s ease-out';
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentElement) {
          document.body.removeChild(toast);
        }
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
          <a href="${item.img}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
            <img src="${item.img}" class="${styles.popupImg}" />
          </a>
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
        groupName: 'Map Configuration',
        groupFields: [
          PropertyPaneDropdown('mapType', {
            label: 'Map Type',
            options: [
              { key: 'openstreetmap', text: 'OpenStreetMap' },
              { key: 'arcgis', text: 'ArcGIS Web Map' }
            ],
            selectedKey: this.properties.mapType || 'openstreetmap'
          })
        ]
      }
    ];

    // If ArcGIS is selected, show URL field
    if (this.properties.mapType === 'arcgis') {
      groups[0].groupFields.push(
        PropertyPaneTextField('arcgisMapUrl', {
          label: 'ArcGIS Map URL',
          description: 'Enter the ArcGIS web map URL (e.g., https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx)',
          placeholder: 'https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx',
          value: this.properties.arcgisMapUrl
        })
      );
    }

    // Data source configuration group
    groups.push({
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
    });

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
    /* Handle map type change */
    if (path === 'mapType') {
      // Clear ArcGIS URL if switching away from ArcGIS
      if (newValue !== 'arcgis') {
        this.properties.arcgisMapUrl = '';
      }
      this.context.propertyPane.refresh();
    }

    /* Validate ArcGIS URL when it changes */
    if (path === 'arcgisMapUrl' && newValue) {
      const webmapId = this.extractWebmapId(newValue as string);
      if (!webmapId) {
        console.error('Invalid ArcGIS map URL format. Expected format: https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx');
      }
    }

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
    if (['libraryName', 'locationMethod', 'latField', 'lonField', 'mapType', 'arcgisMapUrl'].indexOf(path) !== -1) {
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