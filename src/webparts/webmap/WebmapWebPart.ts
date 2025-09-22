// Entry Point
// SPFx web part: Leaflet map with clustered picture markers                  
// Loads images from SharePoint document libraries


import { Version } from '@microsoft/sp-core-library'; 
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; 

import { IWebmapWebPartProps } from './types/IWebmapTypes';

import { showLoader, hideLoader, updateLoader } from './utils/loader';

import { MapManager } from './components/MapManager';
import { ClusterManager } from './components/ClusterManager';
import { PropertyPaneManager } from './components/PropertyPaneManager';
import { DataService, IMapItem } from './services/DataService';
import { ToastManager } from './utils/ToastManager';
import { validateArcGISUrl } from './utils/Security';
import { MapViewService } from './services/MapViewService';
import { RateLimiter } from './utils/RateLimit';

import styles from './WebmapWebPart.module.scss';

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

private mapManager: MapManager | undefined;
private clusterManager: ClusterManager | undefined;
private propertyPaneManager: PropertyPaneManager | undefined;
private activeDataService: DataService | null = null; // Tracks currently active data service
private mapViewService: MapViewService | undefined;

// Generate a unique ID for the map container to avoid conflicts if multiple web parts are on the same page
private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;
private loaderId: string = `loader-${Math.random().toString(36).substr(2, 9)}`;

private rateLimiter: RateLimiter | undefined;


public render(): void {

  if (!this.propertyPaneManager) {
    this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
  }

  // Sets the basic HTML structure for the web part
  this.domElement.innerHTML = `
  <div style="position: relative;">
    <div id="${this.mapId}" class="${styles.mapContainer}"></div>
    <div id="${this.loaderId}" class="${styles.loader}" style="display: none;">
      <div class="${styles.loaderSpinner}"></div>
      <div class="${styles.loaderText}">Loading images...</div>
    </div>
  </div>
  `;

  if (!this.rateLimiter) {
    this.rateLimiter = new RateLimiter(this.loaderId);
  }

  this.renderMap();
}


// Initializes or refreshes the Leaflet map instance

private renderMap(): void {
  // Dispose previous instances 
  if (this.mapManager) {
    this.mapManager.dispose();
    this.mapManager = undefined;
  }
  if (this.clusterManager) {
    this.clusterManager.dispose();
    this.clusterManager = undefined;
  }
  if (this.activeDataService) {
    this.activeDataService.cancelCurrentProcess(); // Cancel any ongoing data fetch
    this.activeDataService = null;
  }




  // Wait for DOM to be ready
  //setTimeout(() => {
    const mapElement = document.getElementById(this.mapId);
    if (!mapElement) {
      //console.error('Map container not found in DOM');
      return;
    }

    // Create fresh map and cluster managers
    this.mapManager = new MapManager(this.mapId);

    const map = this.mapManager.initializeMap(this.properties);
    
    if (!map) {
      ToastManager.show('Failed to initialize map', 'error');
      return;
    }

    this.mapViewService = new MapViewService(map);
    this.clusterManager = new ClusterManager(map);


    if (this.properties.libraryName && this.properties.locationMethod) {
      if(this.properties.locationMethod === 'manual' && this.properties.latField && this.properties.lonField) {
        this.loadMapData();
      } 
      // else if (this.properties.locationMethod === 'exif') {  // currently not production ready
      //   this.loadMapData();
      // }
    }
  //}, 100);
}


// Fetches data from the configured SharePoint document library and populates the map with markers.

private async loadMapData(): Promise<void> {
  if (!this.clusterManager || !this.mapManager ||!this.properties.libraryName || !this.properties.locationMethod) return;


  // Cancel previous fetch if any
  this.activeDataService?.cancelCurrentProcess();

  // Create new DataService instance
  const dataService = new DataService(this.context, this.loaderId, this.mapViewService, this.rateLimiter);
  this.activeDataService = dataService;

  showLoader(this.loaderId);

  try {
    // Use the DataService to fetch data
    const result = await dataService.fetchMapData(this.properties);
    // If a newer dataService is active, discard results
    if (this.activeDataService !== dataService) {
      return;
    }

    // Clear all old markers before adding new ones.
    this.clusterManager.clearMarkers();

    // Add marker to cluster
    result.items.forEach((item: IMapItem) => {
      this.clusterManager!.addMarker(item.lat, item.lon, item.img); //item.data, 
    });
    result.errors.forEach(error => {
      ToastManager.show(error, 'error');
    });
    hideLoader(this.loaderId);
  } catch (error) {
    //console.error('Error loading Images:', error);
  } finally {
  }
}


// Defines the configuration for the web part's property pane
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  if (!this.propertyPaneManager) {
    this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
  }
  return this.propertyPaneManager.getConfiguration();
}


// This SPFx lifecycle method is called when the property pane is opened.
// It's used here to dynamically load the list of available SharePoint document libraries.
protected onPropertyPaneConfigurationStart(): void {
  if (!this.propertyPaneManager) {
    this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
  }
  this.propertyPaneManager.loadLibraries();
}


// This SPFx lifecycle method is called whenever a property pane field is changed by the user.
protected onPropertyPaneFieldChanged(path: string, oldValue: unknown, newValue: unknown): void {
  if (!this.propertyPaneManager) {
    this.propertyPaneManager = new PropertyPaneManager(this.context, this.properties);
  }

  // Handle map type change
  if (path === 'mapType') {
    this.propertyPaneManager.clearLocation();
    if (newValue !== 'project') {
      this.properties.arcgisMapUrl = ''; // Clear ArcGIS URL if switching away from ArcGIS
    }
    this.context.propertyPane.refresh(); // Refresh to show/hide ArcGIS URL field
  }

  // Validate ArcGIS URL when it changes
  if (path === 'arcgisMapUrl' && newValue) {
    const isValid = validateArcGISUrl(newValue as string);
    if (!isValid) {
      ToastManager.show('Please enter a valid HTTPS ArcGIS URL', 'error');
    }
  }

  // Handle location method change
  if (path === 'locationMethod') {
    // Clear field selections when switching methods
    this.propertyPaneManager.clearFieldCache();
    if (newValue === 'manual' && this.properties.libraryName) {
      // If switching to manual method, trigger field loading
      this.propertyPaneManager.loadFields(this.properties.libraryName); 
    } 
    this.context.propertyPane.refresh();
  }

  // Handle library name change - clear all dependent configurations
  if (path === 'libraryName') {
    if (newValue) {
      // Clear all dependent dropdowns and reset to defaults
      this.propertyPaneManager.clearLocation();
      
      // If the current location method is manual, load fields for the new library
      if (this.properties.locationMethod === 'manual') {
        this.propertyPaneManager.loadFields(newValue as string);
      }
    } else {
      // If library is cleared, also clear all dependent configurations
      this.propertyPaneManager.clearLocation();
    }
    // Refresh property pane to reflect the changes
    this.context.propertyPane.refresh();
  }

  // Load fields when switching to a library (but not when clearing all configs)
  if (path === 'libraryName' && newValue && oldValue !== newValue) {
    // Only load fields if we're in manual mode
    if (this.properties.locationMethod === 'manual') {
      this.propertyPaneManager.loadFields(newValue as string);
    }
  }

  // Re-render map whenever any data-source field changes 
  if (['libraryName', 'locationMethod', 'latField', 'lonField', 'mapType', 'arcgisMapUrl', 'mapView'].includes(path)) {
    this.renderMap(); 
  }
}



// Clean up resources when the web part is disposed
protected onDispose(): void {
  this.mapManager?.dispose();
  this.clusterManager?.dispose();
  this.mapViewService = undefined;
}

protected get dataVersion(): Version {
  return Version.parse('1.0');
}
}