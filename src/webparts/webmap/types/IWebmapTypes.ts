/* ========================================================================== */
/* IWebmapTypes.ts                                                            */
/* - Type definitions and interfaces for the WebMap web part                  */
/* ========================================================================== */

import { IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import * as L from 'leaflet';

// These interfaces define the structure of SharePoint data we expect to receive -> avoid 'any' type
export interface ISPList { Title: string; } // SharePoint list object with just the Title property we need
export interface ISPField { TypeAsString: string; InternalName: string; Title: string; } // SharePoint field with its type and names
export interface IClusterClickEvent extends L.LeafletEvent { layer: L.MarkerCluster; latlng: L.LatLng; } // Custom event type for cluster clicks

// Map type options
export type MapType = 'general' | 'project'; // Only two allowed values for map type

export type MapView = 'openstreetmap' | 'satellite'

export type LocationMethod = 'exif' | 'manual'; // Method for getting GPS coordinates
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
  locationMethod: LocationMethod; // method for getting GPS coordinates - either extract from image EXIF data or use manual fields
  latField: string; // The internal name of the column containing the latitude (only used if locationMethod is 'manual')
  lonField: string; // The internal name of the column containing the longitude (only used if locationMethod is 'manual')
  mapType: MapType; // The type of map to use - either 'openstreetmap' or 'arcgis'
  arcgisMapUrl: string; // The ArcGIS web map URL (only used if mapType is 'arcgis')
  mapView: MapView;
}

// Cache types for property pane
export interface IPropertyPaneCache {
  libraries: IPropertyPaneDropdownOption[];
  fields: IPropertyPaneDropdownOption[];
  siteForLibraries: string | null;
  libraryForFields: string | null;
}