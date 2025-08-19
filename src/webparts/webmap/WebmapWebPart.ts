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
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; // The base class for all client-side web parts.

// Imports for the Leaflet mapping library
import * as L from 'leaflet';               // The core Leaflet library.

// Import interfaces and types
import { IWebmapWebPartProps } from './types/IWebmapTypes';

// Import managers and services
import { MapManager } from './components/MapManager';
import { ClusterManager } from './components/ClusterManager';
import { PropertyPaneManager } from './components/PropertyPaneManager';
import { DataService, IMapItem } from './services/DataService';
import { ToastManager } from './utils/ToastManager';
import { validateArcGISUrl } from './utils/Security';
import { MapViewService } from './services/MapViewService';


// Imports the web part's specific styles defined in a scss module.
import styles from './WebmapWebPart.module.scss';

/* ------------------------------------------------------------------ */
/* Web-part                                                           */
/* ------------------------------------------------------------------ */

// Main web part class that extends the base SharePoint web part class
export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  /* ------ Members that survive re-renders ------------------------------------------------------ */
  // These class members hold state that should persist across web part re-renders.
  private mapManager: MapManager | undefined;
  private clusterManager: ClusterManager | undefined;
  private propertyPaneManager: PropertyPaneManager | undefined;
  private dataService: DataService | undefined;        // Holds the data service instance - handles fetching data from SharePoint
  private mapViewService: MapViewService | undefined; // Manages map view and bounds for image markers and feature layers

  // Generate a unique ID for the map container to avoid conflicts if multiple web parts are on the same page
  private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;

  /* ------------------------------------------------------------- */
  /* RENDER                                                        */
  /* ------------------------------------------------------------- */
  /**
   * The main render method called by the SPFx framework to display the web part.
   */
  public render(): void {
    // // Initialize managers and services if not already done
    // if (!this.dataService) {
    //   this.dataService = new DataService(this.context);
    // }
    if (!this.propertyPaneManager) {
      this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
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
    /* 1. Dispose previous instances */
    if (this.mapManager) {
      this.mapManager.dispose();
      this.mapManager = undefined;
    }
    if (this.clusterManager) {
      this.clusterManager.dispose();
      this.clusterManager = undefined;
    }

    /* 2. Create fresh map and cluster managers */
    this.mapManager = new MapManager(this.mapId);

    const map = this.mapManager.initializeMap(this.properties);
    
    if (!map) {
      ToastManager.show('Failed to initialize map', 'error');
      return;
    }

    this.mapViewService = new MapViewService(map);
    this.mapManager.setMapViewService(this.mapViewService); // Pass MapViewService to MapManager


    // Pass MapViewService to other services
    this.dataService = new DataService(this.context, this.mapViewService);

    /* 3. Initialize cluster manager */
    this.clusterManager = new ClusterManager(map);


    /* 4. First data load */
    this.loadMapData(); // Load the data immediately when map is created.
    // Currently commented out, but this would reload data every 30 seconds to show new images
    //this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000); // And then reload every 30 seconds.
  }

  /* ------------------------------------------------------------- */
  /* Load data from map                                            */
  /* ------------------------------------------------------------- */
  /**
   * Fetches data from the configured SharePoint document library and populates the map with markers.
   */
  private async loadMapData(): Promise<void> {
    // Guard clause: do nothing if managers aren't ready.
    if (!this.clusterManager || !this.dataService || !this.mapManager) return;

    // Use the DataService to fetch data
    // This handles all the complexity of getting images and coordinates from SharePoint
    const result = await this.dataService.fetchMapData(this.properties);

    // Clear all old markers before adding new ones.
    // This ensures we don't have duplicate markers if data is refreshed
    this.clusterManager.clearMarkers();

    result.items.forEach((item: IMapItem) => {
      // Add marker to cluster
      this.clusterManager!.addMarker(item.lat, item.lon, item.data, item.img);
    });

    // Show any errors that occurred during fetching
    // This helps users understand if something went wrong
    result.errors.forEach(error => {
      ToastManager.show(error, 'error');
    });
  }

  /* ------------------------------------------------------------- */
  /* Property-pane                                                 */
  /* ------------------------------------------------------------- */
  /**
   * Defines the configuration for the web part's property pane (the settings panel).
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (!this.propertyPaneManager) {
      this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
    }
    return this.propertyPaneManager.getConfiguration();
  }

  /**
   * This SPFx lifecycle method is called when the property pane is opened.
   * It's used here to dynamically load the list of available SharePoint document libraries.
   */
  protected onPropertyPaneConfigurationStart(): void {
    if (!this.propertyPaneManager) {
      this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
    }
    this.propertyPaneManager.loadLibraries();
  }

  /**
   * This SPFx lifecycle method is called whenever a property pane field is changed by the user.
   */
  protected onPropertyPaneFieldChanged(path: string, oldValue: unknown, newValue: unknown): void {
    if (!this.propertyPaneManager) {
      this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
    }

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
        ToastManager.show('Please enter a valid HTTPS ArcGIS URL', 'error');
      }
    }

    /* Handle location method change */
    if (path === 'locationMethod') {
      // Clear field selections when switching methods
      // This prevents confusion from having old selections when changing between EXIF and manual
      this.propertyPaneManager.clearFieldCache();
      
      // If switching to manual method, trigger field loading
      if (newValue === 'manual' && this.properties.libraryName) {
        // Force reload of fields
        this.propertyPaneManager.loadFields(this.properties.libraryName);
      }
      
      this.context.propertyPane.refresh(); // Refresh to show/hide field selectors
    }

    /* Reload field dropdowns when the library changes */
    if (path === 'libraryName' && newValue) {
      this.propertyPaneManager.loadFields(newValue as string);
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
    // Clean up all managers
    this.mapManager?.dispose();
    this.clusterManager?.dispose();
    this.mapViewService = undefined;
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