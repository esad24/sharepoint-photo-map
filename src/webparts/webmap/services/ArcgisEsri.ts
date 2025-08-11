import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as L from 'leaflet';
import * as EL from 'esri-leaflet';

export interface IArcGISLeafletWebPartProps {
  mapUrl: string;
}

export default class ArcGISLeafletWebPart extends BaseClientSideWebPart<IArcGISLeafletWebPartProps> {
  private map: L.Map;
  private webmap: EL.WebMap;

  protected onInit(): Promise<void> {
    // Load Leaflet CSS dynamically
    const cssLink = document.createElement('link');
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    cssLink.rel = "stylesheet";
    document.head.appendChild(cssLink);

    return super.onInit();
  }

  public render(): void {
    this.domElement.innerHTML = `<div id="map-${this.context.instanceId}" style="height: 600px;"></div>`;
  }

  protected onAfterRender(): void {
    if (this.properties.mapUrl) {
      this.initMap();
    }
  }

  private initMap(): void {
    const mapContainer = document.getElementById(`map-${this.context.instanceId}`);

    // Initialize Leaflet map
    this.map = L.map(mapContainer).setView([0, 0], 2);

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Extract webmap ID
    const webmapId = this.getWebmapId(this.properties.mapUrl);

    // Load ArcGIS WebMap
    this.webmap = EL.webMap({
      url: `https://www.arcgis.com/sharing/rest/content/items/${webmapId}?f=json`
    }).addTo(this.map);

    // Add custom icon layer after WebMap loads
    this.webmap.on('load', () => {
      this.addCustomIcons();
    });
  }

  private addCustomIcons(): void {
    // Example custom markers with images
    const customIcon = L.icon({
      iconUrl: '/SiteAssets/pin.png', // SharePoint image path
      iconSize: [32, 32],
      popupAnchor: [0, -15]
    });

    // Add markers
    const marker1 = L.marker([34.05, -118.24], { icon: customIcon })
      .bindPopup('Los Angeles Office')
      .addTo(this.map);

    const marker2 = L.marker([40.71, -74.00], { icon: customIcon })
      .bindPopup('New York Office')
      .addTo(this.map);
  }

  private getWebmapId(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get('webmap') || url.split('/').pop() || '';
    } catch {
      return url; // Fallback to raw ID
    }
  }

  protected onDispose(): void {
    if (this.map) this.map.remove();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: 'ArcGIS Map Settings' },
        groups: [{
          groupName: 'Configuration',
          groupFields: [
            PropertyPaneTextField('mapUrl', {
              label: "ArcGIS WebMap URL or ID",
              placeholder: "e.g., https://arcgis.com?webmap=abc123 or abc123"
            })
          ]
        }]
      }]
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'mapUrl' && newValue) {
      this.initMap();
    }
  }
}