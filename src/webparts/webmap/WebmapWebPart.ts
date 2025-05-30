import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as L from 'leaflet';

declare module 'leaflet' {
  export interface MarkerOptions {
    data?: any;
  }
}


import 'leaflet/dist/leaflet.css';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import styles from './WebmapWebPart.module.scss';

export interface IWebmapWebPartProps {
  description: string;
}

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <div id="map" class="${styles.mapContainer}"></div>
      </div>
    `;
    this.renderMap();
  }

  private renderMap(): void {
    const map = L.map('map').setView([51.1657, 10.4515], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    const markerCluster = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const markers = cluster.getAllChildMarkers();
        const firstMarker = markers[0];
        const img = firstMarker?.options.data?.foto || 'fallback.jpg';
        const count = cluster.getChildCount();
        const digits = String(count).length;
        const badgeH = 22;
        const badgeW = digits === 1 ? badgeH : badgeH + (digits - 1) * 10;

        return L.divIcon({
          html: `
            <div style="position: relative; width: 60px; height: 60px; display:inline-block;">
              <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden;">
                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="position:absolute; top:-8px; right:-8px; width:${badgeW}px; height:${badgeH}px;
                  background:#007AFF; color:#fff; font:700 12px/1 'Segoe UI',sans-serif;
                  padding:0 4px; border-radius:9999px; display:flex; align-items:center;
                  justify-content:center; box-shadow:0 0 2px rgba(0,0,0,.25);">
                ${count}
              </div>
            </div>
          `,
          className: '',
          iconSize: [60, 60]
        });
      }
    });

    map.addLayer(markerCluster);

    this.loadMapData(markerCluster);
    setInterval(() => this.loadMapData(markerCluster), 30000);
  }

  private loadMapData(cluster: L.MarkerClusterGroup): void {
    const listName = 'fotos';
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=lat,lon,foto`;

    this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data) => {
        const items = data.value;
        cluster.clearLayers();

        items.forEach((item: any) => {
          if (!item.lat || !item.lon || !item.foto) return;

          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const img = item.foto;

          const icon = L.divIcon({
            html: `<img src="${img}" style="width: 40px; height: 40px; border-radius: 5px;" />`,
            className: '',
            iconSize: [40, 40]
          });

          const marker = L.marker([lat, lon], { icon, data: item });
          marker.bindPopup(`<img src="${img}" class="${styles.popupImg}" />`);
          cluster.addLayer(marker);
        });
      })
      .catch(err => {
        console.error("Error fetching list items: ", err);
        alert("Could not load map data from SharePoint.");
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Webmap settings' },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
