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
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; // The base class for all client-side web parts.
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'; // Used for making REST API calls to SharePoint.




// Imports for the Leaflet mapping library and its marker cluster plugin.
import * as L from 'leaflet';               // The core Leaflet library.
import 'leaflet/dist/leaflet.css';       // Default CSS for Leaflet for proper rendering of map controls, etc.
import 'leaflet.markercluster';            // The marker cluster plugin logic.
import 'leaflet.markercluster/dist/MarkerCluster.css';       // Main CSS for the cluster plugin.
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Default theme for the cluster icons.

import { ArcGISMapService } from './services/ArcgisMap';  // ArcGIS map service for handling ArcGIS layers and web maps.


// Imports the web part's specific styles defined in a scss module.
import styles from './WebmapWebPart.module.scss';

// Import security functions
import { escODataIdentifier, sanitizeUrl, escAttr, validateArcGISUrl } from './utils/security'; // Security helpers for escaping identifiers and URLs.

// Import the new DataService
import { DataService, IMapItem } from './services/DataService';

import { addWatermark } from './assets/viconWatermark';


/* ------------------------------------------------------------------ */
/* Helpers & typings                                                  */
/* ------------------------------------------------------------------ */


// These interfaces define the structure of SharePoint data we expect to receive -> avoid 'any' type
interface ISPList { Title: string; } // SharePoint list object with just the Title property we need
interface ISPField { TypeAsString: string; InternalName: string; Title: string; } // SharePoint field with its type and names
interface IClusterClickEvent extends L.LeafletEvent { layer: L.MarkerCluster; latlng: L.LatLng; } // Custom event type for cluster clicks

// Map type options
type MapType = 'openstreetmap' | 'arcgis'; // Only two allowed values for map type

/**
 * This is a TypeScript feature called "module augmentation".
 * We are extending the original 'leaflet' module to add a custom 'data' property
 * to the MarkerOptions interface. This allows us to attach the raw SharePoint list item
 * object directly to a Leaflet marker, making it easy to access later (e.g., in popups).
 */
declare module 'leaflet' {
  interface MarkerOptions {
    data?: IWebmapListItem; // Use the specific item interface instead of 'any'.
  }
}

/**
 * Defines the structure for a SharePoint list item that will be used for mapping.
 * It uses an index signature [key: string]: any to allow for dynamic property access,
 * since the actual names for latitude, longitude, and image columns are determined at
 * run-time from the web part properties.
 */
export interface IWebmapListItem {
  [key: string]: unknown;  // Use 'unknown' instead of 'any' for better type safety.
  img?: string; // alias image URL - optional property for storing the image URL
}

/**
 * Defines the properties of the web part that can be configured by the user
 * in the property pane. These properties are saved with the web part instance.
 */
export interface IWebmapWebPartProps {
  libraryName: string; // for document library - the name of the SharePoint document library to read images from
  locationMethod: 'exif' | 'manual'; // method for getting GPS coordinates - either extract from image EXIF data or use manual fields
  latField: string; // The internal name of the column containing the latitude (only used if locationMethod is 'manual')
  lonField: string; // The internal name of the column containing the longitude (only used if locationMethod is 'manual')
  mapType: MapType; // The type of map to use - either 'openstreetmap' or 'arcgis'
  arcgisMapUrl: string; // The ArcGIS web map URL (only used if mapType is 'arcgis')
}

/* ------------------------------------------------------------------ */
/* Web-part                                                           */
/* ------------------------------------------------------------------ */

// Main web part class that extends the base SharePoint web part class
export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  /* ––– Members that survive re-renders ––––––––––––––––––––––––––– */
  // These class members hold state that should persist across web part re-renders.
  private map: L.Map | undefined;                       // Holds the Leaflet map instance - the main map object
  private markerCluster: L.MarkerClusterGroup | undefined; // Holds the marker cluster layer instance - groups nearby markers together
  //private dataTimer: number | undefined;                   // Holds the ID of the setInterval timer for data refreshes (currently commented out)
  private arcgisMap: ArcGISMapService | undefined;     // Holds the ArcGIS service instance - manages ArcGIS layers if that map type is selected
  private dataService: DataService | undefined;        // Holds the data service instance - handles fetching data from SharePoint

  // Caching for property pane dropdown options to avoid redundant API calls.
  private _libraries: IPropertyPaneDropdownOption[] = [];  // Cached list of SharePoint document libraries available in the site
  private _fields: IPropertyPaneDropdownOption[] = []; // Cached list of fields for the selected library (for manual coordinate method)

  // Keys to check if the cache is still valid.
  private _siteForLibraries: string | null = null;   // The site URL for which the `_libraries` cache is valid - helps detect if we moved to a different site
  private _libraryForFields: string | null = null;  // The library name for which the `_fields` cache is valid - helps detect if user selected a different library




  /* ------------------------------------------------------------- */
  /* RENDER                                                        */
  /* ------------------------------------------------------------- */
  /**
   * The main render method called by the SPFx framework to display the web part.
   */
  // Generate a unique ID for the map container to avoid conflicts if multiple web parts are on the same page
  private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;

  public render(): void {
    // Initialize the data service if not already done
    // This service handles all the data fetching logic from SharePoint
    if (!this.dataService) {
      this.dataService = new DataService(this.context);
    }

    // Sets the basic HTML structure for the web part.
    // It creates a container `div` with a unique ID ('map') that Leaflet will use to initialize the map.
    // The styles.mapContainer applies CSS styling from the SCSS module
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
    // This is important because Leaflet throws an error if you try to create a map on a container that already has one
    if (this.map) {
      this.map.remove(); // Clean up all map resources and event listeners
      this.map = undefined; // Clear the reference
    }
    // If a data refresh timer is running, clear it.
    // Currently commented out but would refresh data every 30 seconds
    // if (this.dataTimer) {
    //   window.clearInterval(this.dataTimer);
    //   this.dataTimer = undefined;
    // }

    /* 2. Create fresh map */
    // Initialize a new map on the 'map' div, setting an initial view (coordinates and zoom level).
    // [51.4239, 6.9985] are the latitude/longitude coordinates (Hochtief location)
    // 10 is the zoom level (higher = more zoomed in)
    this.map = L.map(this.mapId).setView([51.4239, 6.9985], 10); // Default view over Hochtief location

      /* 3. Add base layer based on map type */
    if (this.properties.mapType === 'arcgis' && this.properties.arcgisMapUrl) {
      // SECURITY: Validate the ArcGIS URL before using it
      const validatedUrl = validateArcGISUrl(this.properties.arcgisMapUrl);
      
      if (validatedUrl) {
        // Use your existing extraction methods (they're fine)
        const webmapId = this.extractWebmapId(validatedUrl);
        const domain = this.extractArcGISDomain(validatedUrl);
        
        if (webmapId && domain) {
          this.arcgisMap = new ArcGISMapService(this.map);
          this.arcgisMap.addArcGISTileLayer(webmapId, domain);
        } else {
          console.error('Could not extract webmap ID or domain from ArcGIS URL');
          this.showToast('Invalid ArcGIS map configuration', 'error');
          this.addOpenStreetMapLayer();
        }
      } else {
        console.error('Invalid ArcGIS map URL - must be HTTPS and from maps.arcgis.com');
        this.showToast('Please enter a valid ArcGIS web map URL', 'error');
        this.addOpenStreetMapLayer();
      }
    } else {
      this.addOpenStreetMapLayer();
    }

    /* 4. Cluster layer */
    // Initialize the marker cluster group.
    // This groups nearby markers together to avoid cluttering the map
    this.markerCluster = L.markerClusterGroup({
      // `iconCreateFunction` is a customization that defines how a cluster icon looks.
      // This function is called for each cluster to create its visual representation
      iconCreateFunction: (cluster) => {
        // Get the first marker in the cluster to use its image for the cluster icon.
        // This makes the cluster show a preview of what's inside
        const first: L.Marker = cluster.getAllChildMarkers()[0]; // Use the specific L.Marker type instead of 'any'.
        const img = sanitizeUrl(first?.options.data?.img as string); // Safely get and sanitize the image URL

        const count  = cluster.getChildCount(); // How many markers are in this cluster.
        const digits = String(count).length;     // Number of digits in the count (1, 2, 3, etc.).
        const badgeH = 22; // Height of the count badge in pixels.
        // Dynamically calculate the width of the badge to fit the count number.
        // Single digit = 22px wide, each additional digit adds 10px
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

        // Return a Leaflet DivIcon with our custom HTML
        // className: '' prevents Leaflet from adding default styles
        // iconSize: [60, 60] tells Leaflet the size of our icon
        return L.divIcon({ html, className: '', iconSize: [60, 60] });

      },
      zoomToBoundsOnClick: false, // Disable the default behavior of zooming in when a cluster is clicked.
      showCoverageOnHover: false // Don't show the coverage area of the cluster on hover (blue outline).
    });

    // Add the newly created cluster layer to the map.
    this.map.addLayer(this.markerCluster);

    /* 5. Gallery popup on cluster click */
    // Since zoomToBoundsOnClick is false, we can define our own click behavior.
    // This creates a photo gallery popup when clicking on a cluster
    this.markerCluster.on('clusterclick', (e: IClusterClickEvent) => { // Use a specific event type instead of 'any'.
      const markers = e.layer.getAllChildMarkers(); // Get all individual markers within the clicked cluster
      if (!markers.length) return; // Exit if no markers (shouldn't happen but good to check)

      // Create a simple image gallery from all the images within the cluster.
      const imgList = markers.map(m => sanitizeUrl(m.options.data?.img as string)); // Extract and sanitize all image URLs
      let current = 0; // Index of the currently displayed image in the gallery.

      // Programmatically create the HTML elements for the gallery popup using Leaflet's DOM utilities.
      const container = L.DomUtil.create('div', styles.galleryContainer); // Main container with gallery styles

      // Create a wrapper link for the image
      // This allows users to click the image to open it full-size in a new tab
      const imgLink = L.DomUtil.create('a', '', container) as HTMLAnchorElement;
      imgLink.href = imgList[0]; // Set initial href to first image
      imgLink.target = '_blank'; // Open in new tab
      imgLink.rel = 'noopener noreferrer'; // Security best practice for external links
      imgLink.style.cursor = 'pointer'; // Show pointer cursor on hover

      // Create the actual image element inside the link
      const imgEl = L.DomUtil.create('img', styles.popupImg, imgLink) as HTMLImageElement;  
      imgEl.src = imgList[0]; // Set initial image to first in list

      // Create navigation container for prev/next buttons
      const nav = L.DomUtil.create('div', styles.galleryNav, container);

      // Create previous button
      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '◀'; // Left arrow character
      prevBtn.onclick = () => {
        // Move to previous image, wrapping around to end if at beginning
        current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
        imgEl.src = imgList[current]; // Update displayed image
        imgLink.href = imgList[current]; // Update the link href
      };

      // Create next button
      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = '▶'; // Right arrow character
      nextBtn.onclick = () => {
        // Move to next image, wrapping around to beginning if at end
        current = (current + 1) % imgList.length; // Cycle forwards.
        imgEl.src = imgList[current]; // Update displayed image
        imgLink.href = imgList[current]; // Update the link href
      };

      // Create and open the Leaflet popup at the cluster's location, containing the gallery.
      L.popup({ 
        className: 'photoGalleryPopup', // CSS class for styling
        maxWidth: 300 // Maximum width in pixels
      })
        .setLatLng(e.latlng) // Position at cluster location
        .setContent(container) // Set our gallery container as content
        .openOn(this.map!); // Open on the map (! tells TypeScript map is defined)
    });
    
    /* 6. Add watermark */
    addWatermark(this.map); // Add the ViCon watermark to the map

    /* 7. First data load */
    this.loadMapData(); // Load the data immediately when map is created.
    // Currently commented out, but this would reload data every 30 seconds to show new images
    //this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000); // And then reload every 30 seconds.
  }
  

  /**
   * Add OpenStreetMap tile layer
   * OpenStreetMap is a free, community-driven mapping service
   * It's very reliable and doesn't require any API keys or authentication
   */
  private addOpenStreetMapLayer(): void {
    if (!this.map) return; // Safety check - exit if map doesn't exist
    
    // Add OpenStreetMap tiles to the map
    // {s} is replaced by a, b, or c for load balancing across servers
    // {z}/{x}/{y} are replaced by zoom level and tile coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors', // Legal attribution required by OSM
    }).addTo(this.map);
  }

  /**
   * Extract webmap ID from ArcGIS URL
   */
  private extractWebmapId(url: string): string | null {
    if (!url) return null; // Return null if no URL provided
    
    // Pattern: https://{domain}.maps.arcgis.com/apps/mapviewer/index.html?webmap={webmap_id}
    // This regex pattern matches the standard ArcGIS web map URL format
    const urlPattern = /https?:\/\/[^\/]+\.maps\.arcgis\.com\/apps\/mapviewer\/index\.html\?webmap=([a-zA-Z0-9]+)/;
    const match = url.match(urlPattern);
    
    if (match && match[1]) {
      return match[1]; // Return the captured webmap ID
    }
    
    // Also check for webmap ID in other common ArcGIS URL formats
    // Sometimes the URL might be formatted differently
    const webmapPattern = /webmap=([a-zA-Z0-9]+)/;
    const webmapMatch = url.match(webmapPattern);
    
    if (webmapMatch && webmapMatch[1]) {
      return webmapMatch[1]; // Return the captured webmap ID
    }
    
    return null; // No valid webmap ID found
  }

  /**
   * Extract domain from ArcGIS URL
   */
  private extractArcGISDomain(url: string): string | null {
    if (!url) return null; // Return null if no URL provided
    
    // Pattern to extract the domain part (e.g., "hochtiefinfra" from "hochtiefinfra.maps.arcgis.com")
    // This captures the subdomain before .maps.arcgis.com
    const domainPattern = /https?:\/\/([^\/]+)\.maps\.arcgis\.com/;
    const match = url.match(domainPattern);
    
    if (match && match[1]) {
      return match[1]; // Return the captured domain
    }
    
    return null; // No valid domain found
  }

  /**
   * Shows a toast notification
   */
  private showToast(message: string, type: 'info' | 'error' = 'info'): void {
    // Create a new div element for the toast notification
    const toast = document.createElement('div');
    // Apply CSS classes - base toast class plus error class if type is 'error'
    toast.className = `${styles.toast} ${type === 'error' ? styles.toastError : ''}`;
    toast.textContent = message; // Set the message text
  
    // Add animation manually (optional, fallback for older browsers)
    // This makes the toast slide up from the bottom
    toast.style.animation = 'slideUp 0.3s ease-out';
  
    // Add the toast to the page body
    document.body.appendChild(toast);
  
    // Set up automatic removal after 3 seconds
    setTimeout(() => {
      // Animate sliding down before removal
      toast.style.animation = 'slideDown 0.3s ease-in';
      // Wait for animation to complete, then remove from DOM
      setTimeout(() => {
        if (toast.parentElement) {
          document.body.removeChild(toast);
        }
      }, 300); // 300ms matches the animation duration
    }, 3000); // Show for 3 seconds
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
    // This handles all the complexity of getting images and coordinates from SharePoint
    const result = await this.dataService.fetchMapData(this.properties);

    // Clear all old markers before adding new ones.
    // This ensures we don't have duplicate markers if data is refreshed
    this.markerCluster.clearLayers();

    // Create an array to hold all valid coordinates
    // We'll use this to automatically zoom the map to show all markers
    const allLatLngs: L.LatLng[] = [];

    // Process the fetched items
    result.items.forEach((item: IMapItem) => {
      // Add the valid coordinates to our array for bounds calculation
      allLatLngs.push(L.latLng(item.lat, item.lon));

      // Create a custom icon for the individual marker (not a cluster).
      // This shows the actual image as a small thumbnail on the map
      const icon = L.divIcon({
        html: `<img src="${item.img}" style="width:40px;height:40px;border-radius:5px;" />`,
        className: '', // Empty className prevents Leaflet default styles
        iconSize: [40, 40] // Size of the icon in pixels
      });

      // Create the Leaflet marker with coordinates, the custom icon, and our enriched data payload.
      const marker = L.marker([item.lat, item.lon], { 
        icon, // Our custom image icon
        data: item.data // Attach the full SharePoint item data for later use
      });

      // Bind a simple popup to the individual marker, showing its image.
      // This appears when clicking on a single (non-clustered) marker
      marker.bindPopup(`
        <div>
          <a href="${item.img}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
            <img src="${item.img}" class="${styles.popupImg}" />
          </a>
        </div>
      `);

      // Add the final marker to the cluster layer.
      // The cluster layer will automatically group it with nearby markers
      this.markerCluster!.addLayer(marker);
    });

    // After processing all items, check if we have any coordinates
    if (allLatLngs.length > 0 && this.map) {
      // Create a bounding box around all points
      // This calculates the rectangle that contains all markers
      const bounds = L.latLngBounds(allLatLngs);
      // Tell the map to fit itself to these bounds, with a little padding -> map displays all images and is postioned in the middle
      // pad(0.1) adds 10% padding around the bounds for better visibility
      this.map.fitBounds(bounds.pad(0.1));
    }

    // Show any errors that occurred during fetching
    // This helps users understand if something went wrong
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
    // Groups organize related settings together
    const groups: IPropertyPaneGroup[] = [
      {
        groupName: 'Map Configuration',
        groupFields: [
          PropertyPaneDropdown('mapType', {
            label: 'Map Type',
            options: [
              { key: 'openstreetmap', text: 'OpenStreetMap (Default)' },
              { key: 'arcgis', text: 'ArcGIS Web Map' }
            ],
            selectedKey: this.properties.mapType || 'openstreetmap' // Default to OSM if not set
          })
        ]
      }
    ];

    // If ArcGIS is selected, show URL field
    // This demonstrates conditional property pane fields
    if (this.properties.mapType === 'arcgis') {
      groups[0].groupFields.push(
        PropertyPaneTextField('arcgisMapUrl', {
          label: 'ArcGIS Web Map URL',
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
          options: this._libraries, // Dynamically loaded list of libraries
          disabled: !this._libraries.length // Disable if no libraries loaded yet
        }),
        PropertyPaneDropdown('locationMethod', {
          label: 'Location Method',
          options: [
            { key: 'exif', text: 'Extract from Image EXIF Data' },
            { key: 'manual', text: 'Select latitude and longitude fields' }
          ],
          selectedKey: this.properties.locationMethod || 'exif' // Default to EXIF
        })
      ]
    });

    // If manual method is selected, show field selectors
    // Another example of conditional fields based on user selection
    if (this.properties.locationMethod === 'manual') {
      groups.push({
        groupName: 'Coordinate Fields',
        groupFields: [
          PropertyPaneDropdown('latField', {
            label: 'Latitude Field',
            options: this._fields, // Dynamically loaded list of fields from selected library
            disabled: !this._fields.length // Disable if no fields loaded yet
          }),
          PropertyPaneDropdown('lonField', {
            label: 'Longitude Field',
            options: this._fields, // Same list of fields
            disabled: !this._fields.length
          })
        ]
      });
    }

    return {
      pages: [
        {
          header: { description: '' }, // No header description
          groups: groups // All our configured groups
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
    const site = this.context.pageContext.web.absoluteUrl; // Get current site URL
    // Check if we need to fetch libraries (i.e., if the site context has changed).
    // This caching prevents unnecessary API calls
    if (site !== this._siteForLibraries) {
      // Clear all cached options and selections.
      // This ensures we start fresh when the site changes
      this._libraries = [];
      this._fields = [];
      this.properties.libraryName = '';
      this.properties.latField = '';
      this.properties.lonField = '';

      this._siteForLibraries = site; // Update the cache key.

      // Fetch all non-hidden document libraries from the current site.
      // BaseTemplate 101 = Document Library in SharePoint
      const librariesUrl = `${site}/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq 101`;
      this.context.spHttpClient
        .get(librariesUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Map the API response to the format required by PropertyPaneDropdown.
          // Use the specific ISPList interface instead of 'any'.
          this._libraries = json.value.map((l: ISPList) => ({
            key: l.Title, // Use title as both key and display text
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
      // This prevents confusion if user switches back later
      if (newValue !== 'arcgis') {
        this.properties.arcgisMapUrl = '';
      }
      this.context.propertyPane.refresh(); // Refresh to show/hide ArcGIS URL field
    }

    /* Validate ArcGIS URL when it changes */
    if (path === 'arcgisMapUrl' && newValue) {
      const isValid = validateArcGISUrl(newValue as string);
      if (!isValid) {
        this.showToast('Please enter a valid HTTPS ArcGIS URL', 'error');
      }
      const webmapId = this.extractWebmapId(newValue as string);
      if (!webmapId) {
        // Log error to help developers/users understand the expected format
        console.error('Invalid ArcGIS map URL format. Expected format: https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx');
      }
    }

    /* Handle location method change */
    if (path === 'locationMethod') {
      // Clear field selections when switching methods
      // This prevents confusion from having old selections when changing between EXIF and manual
      this.properties.latField = '';
      this.properties.lonField = '';
      this._fields = [];
      
      // If switching to manual method, trigger field loading
      if (newValue === 'manual' && this.properties.libraryName) {
        this._libraryForFields = null; // Force reload of fields
        // Recursively call this method to trigger field loading
        this.onPropertyPaneFieldChanged('libraryName', '', this.properties.libraryName);
      }
      
      this.context.propertyPane.refresh(); // Refresh to show/hide field selectors
    }

    /* Reload field dropdowns when the library changes */
    if (path === 'libraryName' && newValue && newValue !== this._libraryForFields) {
      // Only load fields if we're using manual method
      // EXIF method doesn't need field selection
      if (this.properties.locationMethod !== 'manual') return;
      
      // Clear old field options and selections.
      this._fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this._libraryForFields = newValue as string; // Update the cache key.

      const site = this.context.pageContext.web.absoluteUrl;
      // Fetch all non-hidden, non-readonly fields for the newly selected library.
      // escODataIdentifier ensures special characters in library name are properly encoded
      const fieldsUrl =
        `${site}/_api/web/lists/getByTitle('${escODataIdentifier(newValue as string)}')/fields` +
        `?$filter=Hidden eq false and ReadOnlyField eq false`;

      this.context.spHttpClient
        .get(fieldsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          // Only show field types that are likely to contain the required data.
          // Text fields might contain coordinates as strings
          // Number fields would contain numeric lat/lon values
          // URL fields might contain location data in some custom implementations
          const okTypes = ['Text', 'Number', 'URL'];
          // FIX: Use the specific ISPField interface instead of 'any'.
          this._fields = json.value
            .filter((f: ISPField) => okTypes.indexOf(f.TypeAsString) !== -1) // Filter to allowed types
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
    // This ensures the map updates immediately when settings change
    if (['libraryName', 'locationMethod', 'latField', 'lonField', 'mapType', 'arcgisMapUrl'].indexOf(path) !== -1) {
      this.render(); // Full re-render to apply new settings
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
    // The ?. operator safely calls remove() only if map exists
    this.map?.remove();
    // Stop the data refresh timer if it exists
    //if (this.dataTimer) window.clearInterval(this.dataTimer);
  }

  /* ------------------------------------------------------------- */
  /* SPFx boiler-plate                                             */
  /* ------------------------------------------------------------- */
  /**
   * Standard SPFx property to get the version of the data structure.
   * This helps SharePoint understand if property migrations are needed when updating the web part
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}