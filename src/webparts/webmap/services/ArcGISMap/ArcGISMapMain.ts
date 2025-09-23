// Service class for handling ArcGIS map layers and operations             
// accepts webmap ID as parameter         


import * as L from 'leaflet';

import { FeatureLayerService } from './services/layers/FeatureLayer';
import { WebmapData } from './types/ArcGISTypes';

import {OPEN_STREET_MAP_TILE, IMAGERY_TILE } from '../../constants/constants';

export class ArcGISMapService {
  private map: L.Map; 
  private featureLayerService: FeatureLayerService;


  constructor(map: L.Map) {
    this.map = map; 
    this.featureLayerService = new FeatureLayerService(map);
  }

  // Add ArcGIS tile layer to the map
  public addArcGISTileLayer(webmapId: string, domain: string, mapView: string): void {
    if (!this.map || !webmapId || !domain || !mapView) return;

    try {
      // add ArcGIS basemap tiles
      if( mapView === 'satellite') {
        L.tileLayer(IMAGERY_TILE.url, {
          attribution: IMAGERY_TILE.attribution,
          maxZoom: 21,        
        }).addTo(this.map);
      }

      else {
        L.tileLayer(OPEN_STREET_MAP_TILE.url, {
          attribution: OPEN_STREET_MAP_TILE.attribution,
          maxZoom: 22,        
        }).addTo(this.map);
      }
    } catch (error) {
      //
    }
    this.addArcGISVectorLayer(webmapId, domain);
  }

  // Add vector tile layer with proper styling. This adds the actual webmap content (roads, buildings, etc.) on top of the base imagery
  private addArcGISVectorLayer(webmapId: string, domain: string): void {
    if (!this.map || !webmapId || !domain) return;

    const webmapUrl = `https://${domain}.maps.arcgis.com/sharing/rest/content/items/${webmapId}/data?f=json`;
    

    fetch(webmapUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
      })
      .then(webmapData => {
        if (webmapData && typeof webmapData === 'object') {
          this.processOperationalLayers(webmapData); // Process operational layers from the webmap
        }
      })
      .catch(error => {
      });
  }

  // Process operational layers from webmap data
  private processOperationalLayers(webmapData: WebmapData): void {
    if (!webmapData.operationalLayers || !Array.isArray(webmapData.operationalLayers)) {
      return;
    }
    // Loop through each layer defined in the webmap
    webmapData.operationalLayers.forEach((layer: any) => {
      
      // Handle Group Layers 
      if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
        this.processGroupLayer(layer);
      }
      // Handle direct ArcGIS Feature Layers
      else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
        this.featureLayerService.addArcGISFeatureLayer(layer);
      }
    });
  }

  // Process group layers and their sublayers
  private processGroupLayer(layer: any): void {
    layer.layers.forEach((sublayer: any) => {
      if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
        this.featureLayerService.addArcGISFeatureLayer(sublayer);
      }
    });
  }
}