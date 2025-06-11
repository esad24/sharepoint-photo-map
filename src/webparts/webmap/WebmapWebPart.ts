/* ========================================================================== */
/*  WebmapWebPart.ts                                                          */
/*  - SPFx client-side web-part                                               */
/*  - Leaflet map with clustered picture markers                              */
/*  - Fully configurable in the property-pane:                                */
/*      • Site URL                                                            */
/*      • List                                                                */
/*      • Latitude column                                                     */
/*      • Longitude column                                                    */
/*      • Image column                                                        */
/* ========================================================================== */

import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import styles from './WebmapWebPart.module.scss';

/* ------------------------------------------------------------------ */
/*      Helpers & typings                                             */
/* ------------------------------------------------------------------ */

declare module 'leaflet' {
  interface MarkerOptions {
    data?: any;                 // allow storing the raw list item
  }
}

interface IWebmapListItem {
  /* Dynamic keys → resolved at run-time (lat / lon / img) */
  [key: string]: any;
  img?: string;                 // convenience alias added in code
}

export interface IWebmapWebPartProps {
  description: string;

  listName:  string;            // SharePoint list title
  latField:  string;            // internal column names
  lonField:  string;
  imgField:  string;
}

/* ------------------------------------------------------------------ */
/*      Web-part                                                      */
/* ------------------------------------------------------------------ */

export default class WebmapWebPart extends BaseClientSideWebPart<IWebmapWebPartProps> {

  /* ––– Members that survive re-renders ––––––––––––––––––––––––––– */
  private map: L.Map | undefined;
  private markerCluster: L.MarkerClusterGroup | undefined;
  private dataTimer: number | undefined;

  private _lists:  IPropertyPaneDropdownOption[] = [];
  private _fields: IPropertyPaneDropdownOption[] = [];

  private _siteForLists: string | null = null;   // cache invalidation keys
  private _listForFields: string | null = null;

  /* ------------------------------------------------------------- */
  /*      RENDER                                                   */
  /* ------------------------------------------------------------- */
  public render(): void {
    // Host markup
    this.domElement.innerHTML = `
      <div>
        <div id="map" class="${styles.mapContainer}"></div>
      </div>
    `;

    this.renderMap();
  }

  /* ------------------------------------------------------------- */
  /*      Map creation / refresh                                   */
  /* ------------------------------------------------------------- */
  private renderMap(): void {
    /* 1. Dispose previous instance (avoid “Map container is already initialized”) */
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    if (this.dataTimer) {
      window.clearInterval(this.dataTimer);
      this.dataTimer = undefined;
    }

    /* 2. Create fresh map */
    this.map = L.map('map').setView([51.4239, 6.9985], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(this.map);

    /* 3. Cluster layer */
    this.markerCluster = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const first: any = cluster.getAllChildMarkers()[0];
        const img = (first?.options.data?.img as string);

        const count  = cluster.getChildCount();
        const digits = String(count).length;
        const badgeH = 22;
        const badgeW = digits === 1 ? badgeH : badgeH + (digits - 1) * 10;

        return L.divIcon({
          html: `
            <div style="position:relative;width:60px;height:60px;display:inline-block;">
              <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;">
                <img src="${img}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div style="
                position:absolute;top:-8px;right:-8px;width:${badgeW}px;height:${badgeH}px;
                background:#007AFF;color:#fff;font:700 12px/1 'Segoe UI',sans-serif;
                padding:0 4px;border-radius:9999px;display:flex;align-items:center;
                justify-content:center;box-shadow:0 0 2px rgba(0,0,0,.25);">
                ${count}
              </div>
            </div>
          `,
          className: '',
          iconSize: [60, 60]
        });
      },
      zoomToBoundsOnClick: false      // stop the automatic zoom-in

    });

    this.map.addLayer(this.markerCluster);

    /* 4. Gallery popup on cluster click */
    this.markerCluster.on('clusterclick', (e: any) => {
      const markers = e.layer.getAllChildMarkers() as L.Marker<any>[];
      if (!markers.length) return;

      const imgList = markers.map(m => (m.options.data?.img as string) || 'fallback.jpg');
      let current   = 0;

      const container = L.DomUtil.create('div', 'custom-popup');
      container.style.width           = '320px';          // fixed width
      container.style.maxWidth        = '100%';           // responsive cap
      container.style.display         = 'flex';
      container.style.flexDirection   = 'column';
      container.style.alignItems      = 'center';         // ⬅️ horizontal centring
      container.style.textAlign       = 'center';         // keep text centred


      const imgEl  = L.DomUtil.create('img', '', container) as HTMLImageElement;
      imgEl.src           = imgList[0];
      imgEl.style.width = '100%';           // fill container width
      imgEl.style.height = 'auto'; // or use a max height if needed
      imgEl.style.maxHeight = '300px'; // optional constraint
      imgEl.style.objectFit = 'contain';
      imgEl.style.borderRadius = '10px';

      const nav           = L.DomUtil.create('div', '', container);
      nav.style.marginTop = '8px';

      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '◀';
      prevBtn.onclick   = () => {
        current = (current - 1 + imgList.length) % imgList.length;
        imgEl.src = imgList[current];
      };

      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = '▶';
      nextBtn.style.marginLeft = '10px';
      nextBtn.onclick   = () => {
        current = (current + 1) % imgList.length;
        imgEl.src = imgList[current];
      };

      L.popup()
        .setLatLng(e.latlng)
        .setContent(container)
        .openOn(this.map!);
    });

    /* 5. First data load + 30-sec interval */
    this.loadMapData();
    this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000);
  }

  /* ------------------------------------------------------------- */
  /*      List→markers                                             */
  /* ------------------------------------------------------------- */
  private loadMapData(): void {
    if (!this.markerCluster) return;

    const { listName, latField, lonField, imgField } = this.properties;
    if (!listName || !latField || !lonField || !imgField) return;

    const site = this.context.pageContext.web.absoluteUrl;
    const url =
      `${site}/_api/web/lists/getByTitle('${listName}')/items` +
      `?$select=${latField},${lonField},${imgField}`;

    this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((r: SPHttpClientResponse) => r.json())
      .then(json => {
        const items = json.value as IWebmapListItem[];
        this.markerCluster!.clearLayers();

        items.forEach(item => {
          if (!item[latField] || !item[lonField] || !item[imgField].Url) return;

          const lat = parseFloat(item[latField]);
          const lon = parseFloat(item[lonField]);
          const img = (item[imgField].Url as string);

          

          const enriched = { ...item, img };     // for gallery / cluster icons

          const icon = L.divIcon({
            html: `<img src="${img}" style="width:40px;height:40px;border-radius:5px;" />`,
            className: '',
            iconSize: [40, 40]
          });

          const marker = L.marker([lat, lon], { icon, data: enriched });

          marker.bindPopup(`
          <div class="custom-popup">
            <img src="${img}" class="${styles.popupImg}" />
          </div>
          `);
                  
          this.markerCluster!.addLayer(marker);
        });
      })
      .catch(err => console.error('Webmap → list fetch failed:', err));
  }

  /* ------------------------------------------------------------- */
  /*      Property-pane                                            */
  /* ------------------------------------------------------------- */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Data Source' },
          groups: [
            {
              groupName: 'Choose a Photo-List?',
              groupFields: [
                PropertyPaneDropdown('listName', {
                  label: 'List',
                  options: this._lists,
                  disabled: !this._lists.length
                })
              ]
            },
            {
              groupName: 'Which columns contain…',
              groupFields: [
                PropertyPaneDropdown('latField', {
                  label: 'Latitude',
                  options: this._fields,
                  disabled: !this._fields.length
                }),
                PropertyPaneDropdown('lonField', {
                  label: 'Longitude',
                  options: this._fields,
                  disabled: !this._fields.length
                }),
                PropertyPaneDropdown('imgField', {
                  label: 'Image',
                  options: this._fields,
                  disabled: !this._fields.length
                })
              ]
            }
          ]
        }
      ]
    };
  }

  /* ------------------------------------------------------------- */
  /*      Dynamic options loader                                   */
  /* ------------------------------------------------------------- */
  protected onPropertyPaneConfigurationStart(): void {
    // Site-scoped list enumeration
    const site = this.context.pageContext.web.absoluteUrl;
    if (site !== this._siteForLists) {
      this._lists = [];
      this._fields = [];
      this.properties.listName = '';
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._siteForLists = site;

      const listsUrl = `${site}/_api/web/lists?$filter=Hidden eq false`;
      this.context.spHttpClient
        .get(listsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          this._lists = json.value.map((l: any) => ({
            key: l.Title,
            text: l.Title
          })) as IPropertyPaneDropdownOption[];

          this.context.propertyPane.refresh();
        })
        .catch(err => console.error('Webmap → list enumeration failed:', err));
    }
  }

  protected onPropertyPaneFieldChanged(path: string, oldValue: any, newValue: any): void {
    /* Reload field dropdowns when the list changes */
    if (path === 'listName' && newValue && newValue !== this._listForFields) {
      this._fields = [];
      this.properties.latField = '';
      this.properties.lonField = '';
      this.properties.imgField = '';
      this._listForFields = newValue;

      const site = this.context.pageContext.web.absoluteUrl;
      const fieldsUrl =
        `${site}/_api/web/lists/getByTitle('${newValue}')/fields` +
        `?$filter=Hidden eq false and ReadOnlyField eq false`;

      this.context.spHttpClient
        .get(fieldsUrl, SPHttpClient.configurations.v1)
        .then((r: SPHttpClientResponse) => r.json())
        .then(json => {
          const okTypes = ['Text', 'Number', 'URL', 'Image']; // allow as needed
          this._fields = json.value
            .filter((f: any) => okTypes.indexOf(f.TypeAsString) !== -1)
            .map((f: any) => ({
              key: f.InternalName,
              text: f.Title
            })) as IPropertyPaneDropdownOption[];

          this.context.propertyPane.refresh();
        })
        .catch(err => console.error('Webmap → field enumeration failed:', err));
    }

    /* Re-render map whenever any data-source field changes */
    if (
        ['listName', 'latField', 'lonField', 'imgField']
          .indexOf(path) !== -1           
          ) {
      this.render();
    }
  }

  /* ------------------------------------------------------------- */
  /*      Clean-up                                                 */
  /* ------------------------------------------------------------- */
  protected onDispose(): void {
    this.map?.remove();
    if (this.dataTimer) window.clearInterval(this.dataTimer);
  }

  /* ------------------------------------------------------------- */
  /*      SPFx boiler-plate                                        */
  /* ------------------------------------------------------------- */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
