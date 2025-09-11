 
// IWebmapTypes.ts                                                            
// - Type definitions and interfaces for the WebMap web part                  

import { IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import * as L from 'leaflet';

// These interfaces define the structure of SharePoint data we expect to receive -> avoid 'any' type
export interface ISPList { // SharePoint list object with just the Title property we need
  Title: string; 
} 
export interface ISPField { // SharePoint field with its type and names
  TypeAsString: string;
  InternalName: string; 
  Title: string; } 
export interface IClusterClickEvent extends L.LeafletEvent { // Custom event type for cluster clicks
  layer: L.MarkerCluster; 
  latlng: L.LatLng; 
} 
// Map type options
export type MapType = 'general' | 'project'; // Only two allowed values for map type

export type MapView = 'openstreetmap' | 'satellite'

export type LocationMethod = 'exif' | 'manual'; // Method for getting GPS coordinates

/**
 * We are extending the original 'leaflet' module to add a custom 'data' property
 * to the MarkerOptions interface. This allows us to attach the raw SharePoint list item
 * object directly to a Leaflet marker, making it easy to access later (e.g., in popups).
 */
declare module 'leaflet' {
  interface MarkerOptions {
    data?: IWebmapListItem; // Use the specific item interface instead of 'any'.
  }
}

export interface IWebmapListItem {
  [key: string]: unknown;  // uses an index signature [key: string]: any to allow for dynamic property access,since the actual names for latitude, longitude, and image columns are determined at run-time from the web part properties.
  img?: string; 
}

// Defines the properties of the web part that can be configured by the user

export interface IWebmapWebPartProps {
  libraryName: string; 
  locationMethod: LocationMethod; 
  latField: string; 
  lonField: string; 
  mapType: MapType; 
  arcgisMapUrl: string; 
  mapView: MapView;
}

// Cache types for property pane
export interface IPropertyPaneCache {
  libraries: IPropertyPaneDropdownOption[];
  fields: IPropertyPaneDropdownOption[];
  siteForLibraries: string | null;
  libraryForFields: string | null;
}