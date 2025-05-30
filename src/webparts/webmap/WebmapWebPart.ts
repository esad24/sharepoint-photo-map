import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'WebmapWebPartStrings';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './WebmapWebPart.module.scss';

export interface IWebmapWebPartProps {
  description: string;
}

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <p>${strings.PropertyPaneDescription}</p>
        <div id="map" class="${styles.mapContainer}"></div>
      </div>
    `;

    this.renderMap();
  }

  private renderMap(): void {
    const mapId = 'map';

    // Avoid re-rendering if map already exists
    if ((window as any)._leafletMap) {
      (window as any)._leafletMap.remove();
    }

    const map = L.map(mapId).setView([51.505, -0.09], 13);

    (window as any)._leafletMap = map; // store map globally to prevent re-init

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
