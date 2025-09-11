// Service for handling ArcGIS feature layer operations                     

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { StyleService } from '../styling/StyleService';
import { LayerConfig, DrawingInfo } from '../../types/ArcGISTypes';
import  styles  from '../../../../WebmapWebPart.module.scss';
import { MapViewService } from '../../../MapViewService';

export class FeatureLayerService {
  private map: L.Map;
  private styleService: StyleService;
  private mapViewService: MapViewService | undefined;


  constructor(map: L.Map, mapViewService?: MapViewService) {
    this.map = map;
    this.styleService = new StyleService();
    this.mapViewService = mapViewService;
  }

  // Add an ArcGIS Feature Layer with proper styling (Optimized for performance)

  public async addArcGISFeatureLayer(layerConfig: LayerConfig): Promise<void> {
    if (!this.map || !layerConfig || !layerConfig.url) return;
    const featureServiceUrl = layerConfig.url;    
    try {
      // First, get the layer info to understand the data structure
      const layerInfo = await this.getFeatureLayerInfo(featureServiceUrl);
      if (!layerInfo) return;

      const maxRecordCount = layerInfo.maxRecordCount || 1000;       // Get the maximum record count from layer info

    
      const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);       // Get drawing info for styling

      
      const allFeatures = await this.queryAllFeatures(featureServiceUrl, maxRecordCount);       // Query all features - handle pagination if needed

      
      if (allFeatures.length > 0) {
          const geoJsonLayer = this.createAndAddGeoJSONLayer(allFeatures, layerConfig, drawingInfo);           // Create and add the complete GeoJSON layer

      }
    } 
    catch (error) {
      console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
    }
  }

  // Get layer styling information from ArcGIS service
  private async getLayerDrawingInfo(serviceUrl: string): Promise<DrawingInfo | null> {
    try {
      const url = String(serviceUrl);
      const layerInfoUrl = url.includes('?') ? `${url}&f=json` : `${url}?f=json`;       // Add JSON format parameter to the URL (?f=json tells ArcGIS to return JSON data)
      
      // Fetch layer metadata (information about the layer)
      const response = await fetch(layerInfoUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch layer info: ${response.status}`);
        return null;
      }
      
      const layerInfo = await response.json();
      return layerInfo.drawingInfo || null;
    } catch (error) {
        console.error('Failed to get layer drawing info:', error);
      return null;
    }
  }

  // Get feature layer information from ArcGIS service
  private async getFeatureLayerInfo(featureServiceUrl: string): Promise<any> {
    const layerInfoUrl = `${featureServiceUrl}?f=json`;
    const infoResponse = await fetch(layerInfoUrl);
    return await infoResponse.json();
  }

  // Query all features with pagination support

  private async queryAllFeatures(featureServiceUrl: string, maxRecordCount: number): Promise<any[]> {
    let allFeatures: any[] = [];         
    let resultOffset = 0;                // Starting position for the current request (initially 0)
    let hasMore = true;                  // Boolean flag to control the pagination loop

    while (hasMore) {
        // Create query parameters for the current request
        const queryParams = new URLSearchParams({
            'where': '1=1',                  // "1=1" means "select all features"
            'outFields': '*',                // all Fields (attributes) of the features
            'f': 'geojson',                  // Response format: GeoJSON (standardized geographic data format)
            'outSR': '4326',                 // Output spatial reference: WGS 84 (standard latitude/longitude coordinate system)
            'returnGeometry': 'true',        // Include the shape/location data of features (not just attributes)
            'resultOffset': resultOffset.toString(),  // Tell the server where to start returning records from
            'resultRecordCount': maxRecordCount.toString(), // Maximum number of records to return in this request
            'geometryPrecision': '6'         // Limit coordinate decimal places (reduces file size and improves performance)
        });

        // Construct the full query URL with all parameters
        const queryUrl = `${featureServiceUrl}/query?${queryParams.toString()}`;
        const response = await fetch(queryUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const geojsonData = await response.json();

        // Check if the response has features and add them to our collection
        if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
            allFeatures = allFeatures.concat(geojsonData.features);

            // Update the offset for the next request (move to the next "page")
            resultOffset += geojsonData.features.length;

            hasMore = geojsonData.features.length === maxRecordCount;
        } else {
            hasMore = false;
        }
    }
    return allFeatures;
  }

  // Create and add GeoJSON layer to the map with proper styling,     // GeoJSON is a standard format for representing geographic features


  private createAndAddGeoJSONLayer(allFeatures: any[], layerConfig: LayerConfig, drawingInfo: DrawingInfo | null): L.GeoJSON {
    // Create the complete GeoJSON object. It wraps all features in a "FeatureCollection" structure
    const completeGeoJSON = {
        type: 'FeatureCollection' as const,
        features: allFeatures
    } as any;
    
    // Create style function based on drawing info
    const styleFunction = this.styleService.createStyleFunction(drawingInfo);
    
    // Create a marker cluster group for text labels
    const textClusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 25,  
      disableClusteringAtZoom: 19,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      iconCreateFunction: function(cluster: any) {
          // Get the first marker's text from the cluster
          const firstMarker = cluster.getAllChildMarkers()[0];
          const textContent = firstMarker.options.icon.options.html;
          
          return L.divIcon({
              html: textContent,
              className: styles.textLabel,
              iconSize: [100, 20]
          });
      }
    });
    
    // Create a GeoJSON layer optimized for performance
    const geoJsonLayer = L.geoJSON(completeGeoJSON, {
        // Style function for lines and polygons
        style: (feature) => {
            const style = styleFunction(feature);
            // Special handling for polygon layers to have some transparency
            if (layerConfig.title && layerConfig.title.includes('Polys')) {
                style.fillOpacity = style.fillOpacity || 0.6; 
                style.weight = style.weight || 1;
            }
            return style;
        },

        // Function to create markers for point features
        pointToLayer: (feature, latlng) => {
            const style = styleFunction(feature);
            return L.circleMarker(latlng, {
                ...style,
                radius: style.radius || 5
            });
        },
        // Add text labels for each feature
        onEachFeature: (feature, layer) => {
          const textValue = feature.properties?.Text;
          if (textValue && textValue.trim()) {
              let position: L.LatLng;
              if (feature.geometry.type === 'Point') {
                  const coords = feature.geometry.coordinates;
                  position = L.latLng(coords[1], coords[0]);
              } else {
                  // For polygons/lines, use the centroid from the layer
                  position = (layer as any).getBounds().getCenter();
              }
              
              // Create a marker for the text label
              const textMarker = L.marker(position, {
                  icon: L.divIcon({
                      html: textValue,
                      className: styles.textLabel,
                      iconSize: [100, 20]
                  })
              });
              textClusterGroup.addLayer(textMarker);
          }
        },
        // Disable all interactivity for better performance
        interactive: false,
        bubblingMouseEvents: false
    });
    geoJsonLayer.addTo(this.map!);
    textClusterGroup.addTo(this.map!); 
    return geoJsonLayer;
  }
}