 
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

export type LocationMethod = 'manual'; // currently only 'manual' is supported -> in future version also exif extraction p

// Defines the properties of the web part that can be configured by the user

export interface IWebmapWebPartProps {
  libraryName: string; 
  locationMethod: LocationMethod | undefined;
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