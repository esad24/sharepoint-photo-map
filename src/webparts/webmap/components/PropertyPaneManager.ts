// Manages property pane configuration and dynamic field loading           

import {
    IPropertyPaneConfiguration,
    PropertyPaneDropdown,
    IPropertyPaneDropdownOption,
    IPropertyPaneGroup,
    PropertyPaneTextField,
  } from '@microsoft/sp-property-pane';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebmapWebPartProps, ISPList, ISPField, IPropertyPaneCache } from '../types/IWebmapTypes';
import { escODataIdentifier } from '../utils/Security';
  
export class PropertyPaneManager {
  private context: WebPartContext;
  private properties: IWebmapWebPartProps;
  private cache: IPropertyPaneCache;

  constructor(context: WebPartContext, properties: IWebmapWebPartProps) {
    this.context = context;
    this.properties = properties;
    this.cache = {
      libraries: [],
      fields: [],
      siteForLibraries: null,
      libraryForFields: null
    };
  }

  // Defines the configuration for the web part's property pane (the settings panel).
  public getConfiguration(): IPropertyPaneConfiguration {

    const groups: IPropertyPaneGroup[] = [
      {
        groupName: 'Map Configuration',
        groupFields: [
          PropertyPaneDropdown('mapType', {
            label: 'Map Type',
            options: [
              { key: 'general', text: 'General Map - OpenStreetMap' },
              { key: 'project', text: 'Project Map - ArcGIS Web Map' }
            ],
            selectedKey: this.properties.mapType || 'general' // Default to OSM if not set
          })
        ]
      }
    ];

    // If ArcGIS is selected, show URL field
    if (this.properties.mapType === 'project') {
      groups[0].groupFields.push(
        PropertyPaneTextField('arcgisMapUrl', {
          label: 'ArcGIS Web Map URL',
          description: 'Enter the ArcGIS web map URL (e.g., https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx)',
          placeholder: 'https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx',
          value: this.properties.arcgisMapUrl
        }),
        PropertyPaneDropdown('mapView', {
          label: 'Map View',
          options: [
            { key: 'openstreetmap', text: 'Open Street Map' },
            { key: 'satellite', text: 'Satellite' }
          ],
          selectedKey: this.properties.mapView || 'openstreetmap' // Default to OpenStreetMap
        })
      );
    }

    // Data source configuration group
    groups.push({
      groupName: 'Data Source Configuration',
      groupFields: [
        PropertyPaneDropdown('libraryName', {
          label: 'Document Library',
          options: this.cache.libraries, // Dynamically loaded list of libraries
          disabled: !this.cache.libraries.length // Disable if no libraries loaded yet
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
    if (this.properties.locationMethod === 'manual') {
      groups.push({
        groupName: 'Coordinate Fields',
        groupFields: [
          PropertyPaneDropdown('latField', {
            label: 'Latitude Field',
            options: this.cache.fields, // Dynamically loaded list of fields from selected library
            disabled: !this.cache.fields.length // Disable if no fields loaded yet
          }),
          PropertyPaneDropdown('lonField', {
            label: 'Longitude Field',
            options: this.cache.fields, // Same list of fields
            disabled: !this.cache.fields.length
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

  // Load available SharePoint document libraries

  public async loadLibraries(): Promise<void> {
    const site = this.context.pageContext.web.absoluteUrl; // Get current site URL
    
    // Check if we need to fetch libraries (i.e., if the site context has changed. This caching prevents unnecessary API calls
    if (site !== this.cache.siteForLibraries) {
      // Clear all cached options and selections.
      this.cache.libraries = [];
      this.cache.fields = [];
      this.properties.libraryName = '';
      this.properties.latField = '';
      this.properties.lonField = '';

      this.cache.siteForLibraries = site; // Update the cache key.

      try {
        // Fetch all non-hidden document libraries from the current site.
        const librariesUrl = `${site}/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq 101`;        // BaseTemplate 101 = Document Library in SharePoint
        const response: SPHttpClientResponse = await this.context.spHttpClient.get(
          librariesUrl, 
          SPHttpClient.configurations.v1
        );
        const json = await response.json();

        // Map the API response to the format required by PropertyPaneDropdown.
        this.cache.libraries = json.value.map((l: ISPList) => ({
          key: l.Title, 
          text: l.Title
        })) as IPropertyPaneDropdownOption[];

        // Refresh the property pane to show the newly loaded libraries.
        this.context.propertyPane.refresh();
      } catch (err) {
        console.error('Webmap → library enumeration failed:', err);
      }
    }
  }

  // Load fields for the selected library

  public async loadFields(libraryName: string): Promise<void> {
    // Only load fields if we're using manual method
    if (this.properties.locationMethod !== 'manual') return;
    
    if (libraryName !== this.cache.libraryForFields) {
      // Clear old field options and selections.
      this.cache.fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this.cache.libraryForFields = libraryName; // Update the cache key.

      try {
        const site = this.context.pageContext.web.absoluteUrl;
        // Fetch all non-hidden, non-readonly fields for the newly selected library.
        // escODataIdentifier ensures special characters in library name are properly encoded
        const fieldsUrl =
          `${site}/_api/web/lists/getByTitle('${escODataIdentifier(libraryName)}')/fields` +
          `?$filter=Hidden eq false and ReadOnlyField eq false`;

        const response: SPHttpClientResponse = await this.context.spHttpClient.get(
          fieldsUrl,
          SPHttpClient.configurations.v1
        );
        const json = await response.json();

        // Only show field types that are likely to contain the required data.

        const okTypes = ['Text', 'Number', 'URL'];
        this.cache.fields = json.value
          .filter((f: ISPField) => okTypes.indexOf(f.TypeAsString) !== -1) // Filter to allowed types
          .map((f: ISPField) => ({
            key: f.InternalName, // Use the internal name for API calls.
            text: f.Title        // Show the user-friendly display name.
          })) as IPropertyPaneDropdownOption[];

        // Refresh the property pane to show the new field options.
        this.context.propertyPane.refresh();
      } catch (err) {
        console.error('Webmap → field enumeration failed:', err);
      }
    }
  }

  public getCache(): IPropertyPaneCache {
    return this.cache;
  }

  public clearFieldCache(): void {
    this.cache.fields = [];
    this.cache.libraryForFields = null;
    this.properties.latField = '';
    this.properties.lonField = '';
  }
}