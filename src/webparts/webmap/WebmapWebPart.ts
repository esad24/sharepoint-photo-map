// Entry Point
// SPFx web part: Leaflet map with clustered picture markers                  
// Loads images from SharePoint document libraries (EXIF or manual GPS)       


import { Version } from '@microsoft/sp-core-library'; 
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'; 

import * as L from 'leaflet';              

import { IWebmapWebPartProps } from './types/IWebmapTypes';

import { MapManager } from './components/MapManager';
import { ClusterManager } from './components/ClusterManager';
import { PropertyPaneManager } from './components/PropertyPaneManager';
import { DataService, IMapItem } from './services/DataService';
import { ToastManager } from './utils/ToastManager';
import { validateArcGISUrl } from './utils/Security';
import { MapViewService } from './services/MapViewService';

import styles from './WebmapWebPart.module.scss';

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

private mapManager: MapManager | undefined;
private clusterManager: ClusterManager | undefined;
private propertyPaneManager: PropertyPaneManager | undefined;
private dataService: DataService | undefined;        
private mapViewService: MapViewService | undefined;

// Generate a unique ID for the map container to avoid conflicts if multiple web parts are on the same page
private mapId: string = `map-${Math.random().toString(36).substr(2, 9)}`;
private loaderId: string = `loader-${Math.random().toString(36).substr(2, 9)}`;



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
  this.renderMap();
}


// Show loader
private showLoader(): void {
  const loader = document.getElementById(this.loaderId);
  if (loader) {
    loader.style.display = 'flex';
  }
}

// Hide loader
private hideLoader(): void {
  const loader = document.getElementById(this.loaderId);
  if (loader) {
    loader.style.display = 'none';
  }
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

  // Create fresh map and cluster managers
  this.mapManager = new MapManager(this.mapId);

  const map = this.mapManager.initializeMap(this.properties);
  
  if (!map) {
    ToastManager.show('Failed to initialize map', 'error');
    return;
  }

  this.mapViewService = new MapViewService(map);


  // Pass MapViewService to dataservice
  this.dataService = new DataService(this.context, this.mapViewService);

  // Initialize cluster manager
  this.clusterManager = new ClusterManager(map);


  if (this.properties.libraryName) {
    this.loadMapData();
  }
}


// Fetches data from the configured SharePoint document library and populates the map with markers.

private async loadMapData(): Promise<void> {
  if (!this.clusterManager || !this.dataService || !this.mapManager ||!this.properties.libraryName) return;

  const startTime = Date.now();
  this.showLoader();

  try {
    // Use the DataService to fetch data
    const result = await this.dataService.fetchMapData(this.properties);

    // Clear all old markers before adding new ones.
    this.clusterManager.clearMarkers();

    // Add marker to cluster
    result.items.forEach((item: IMapItem) => {
      this.clusterManager!.addMarker(item.lat, item.lon, item.img); //item.data, 
    });
    result.errors.forEach(error => {
      ToastManager.show(error, 'error');
    });
  } catch (error) {
    console.error('Error loading Images:', error);
  } finally {
    this.hideLoader();
    const endTime = Date.now();
    // Dauer berechnen in Millisekunden
    const durationMs = endTime - startTime;

    // In Minuten und Sekunden umrechnen
    const minutes = Math.floor(durationMs / 60000); // 1 Minute = 60.000 ms
    const seconds = ((durationMs % 60000) / 1000).toFixed(2);

    console.log(`Process took ${minutes} minutes and ${seconds} seconds.`);}
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
    if (newValue === 'manual' && this.properties.libraryName) {           // If switching to manual method, trigger field loading
      this.propertyPaneManager.loadFields(this.properties.libraryName); 
    } 
    this.context.propertyPane.refresh();
  }

  // Reload field dropdowns when the library changes 
  if (path === 'libraryName' && newValue) {
    this.propertyPaneManager.loadFields(newValue as string);
  }

  // Re-render map whenever any data-source field changes 
  if (['libraryName', 'locationMethod', 'latField', 'lonField', 'mapType', 'arcgisMapUrl', 'mapType'].indexOf(path) !== -1) {
    this.render(); 
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