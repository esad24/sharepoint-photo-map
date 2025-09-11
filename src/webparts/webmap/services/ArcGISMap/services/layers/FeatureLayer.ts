/* ========================================================================== */
/* services/FeatureLayerService.ts                                            */
/* - Service for handling ArcGIS feature layer operations                     */
/* ========================================================================== */

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

  /**
   * Add an ArcGIS Feature Layer with proper styling (Optimized for performance)
   * 
   */
  public async addArcGISFeatureLayer(layerConfig: LayerConfig): Promise<void> {
    // Safety checks - make sure we have everything we need
    if (!this.map || !layerConfig || !layerConfig.url) return;

    const featureServiceUrl = layerConfig.url;
    //console.log(`Loading feature layer: ${layerConfig.title} from ${featureServiceUrl}`);
    
    try {
        // First, get the layer info to understand the data structure
        const layerInfo = await this.getFeatureLayerInfo(featureServiceUrl);
        if (!layerInfo) return;

        // Get the maximum record count from layer info
        const maxRecordCount = layerInfo.maxRecordCount || 1000;
      
        // Get drawing info for styling
        const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);
        
        // Query all features - handle pagination if needed
        const allFeatures = await this.queryAllFeatures(featureServiceUrl, maxRecordCount);
        
        if (allFeatures.length > 0) {
            // Create and add the complete GeoJSON layer
            const geoJsonLayer = this.createAndAddGeoJSONLayer(allFeatures, layerConfig, drawingInfo);

            // Automatically zoom to show all features
            this.getBounds(geoJsonLayer);
        }
    } 
    catch (error) {
            // Log errors but don't crash the entire map
            // This ensures that if one layer fails, other layers can still load
            // console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
    }
  }

  /**
   * Get layer styling information from ArcGIS service
   */
  private async getLayerDrawingInfo(serviceUrl: string): Promise<DrawingInfo | null> {
    try {
      // Ensure we're getting the correct layer info URL
      const url = String(serviceUrl);
      // Add JSON format parameter to the URL (?f=json tells ArcGIS to return JSON data)
      const layerInfoUrl = url.includes('?') ? `${url}&f=json` : `${url}?f=json`;
      //console.log('Fetching layer info from:', layerInfoUrl);
      
      // Fetch layer metadata (information about the layer)
      const response = await fetch(layerInfoUrl);
      if (!response.ok) {
        //console.warn(`Failed to fetch layer info: ${response.status}`);
        return null;
      }
      
      // Parse JSON response
      const layerInfo = await response.json();
      //console.log('Layer info:', layerInfo);
      
      // Return drawing info if available, otherwise null
      return layerInfo.drawingInfo || null;
    } catch (error) {
      // console.error('Failed to get layer drawing info:', error);
      return null;
    }
  }

  /**
   * Get feature layer information from ArcGIS service
   */
  private async getFeatureLayerInfo(featureServiceUrl: string): Promise<any> {
    const layerInfoUrl = `${featureServiceUrl}?f=json`;
    const infoResponse = await fetch(layerInfoUrl);
    return await infoResponse.json();
  }

  /**
   * Query all features with pagination support
   */
  private async queryAllFeatures(featureServiceUrl: string, maxRecordCount: number): Promise<any[]> {
    let allFeatures: any[] = [];         // Array to store all fetched features across multiple pages
    let resultOffset = 0;                // Starting position for the current request (initially 0)
    let hasMore = true;                  // Boolean flag to control the pagination loop

    while (hasMore) {
        // Create query parameters for the current request
        const queryParams = new URLSearchParams({
            'where': '1=1',                  // "1=1" means "select all features" (always true condition)
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

        // Send the HTTP GET request to the ArcGIS Feature Service
        const response = await fetch(queryUrl);
        if (!response.ok) {
            // If the request fails, throw an error with the HTTP status code
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON (GeoJSON format)
        const geojsonData = await response.json();

        // Check if the response has features and add them to our collection
        if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
            // Add current batch of features to the master list
            allFeatures = allFeatures.concat(geojsonData.features);

            // Update the offset for the next request (move to the next "page")
            resultOffset += geojsonData.features.length;

            // If we received a full batch (max count), assume there may be more features to load
            // If we got fewer than the maximum, we've probably reached the end
            hasMore = geojsonData.features.length === maxRecordCount;
        } else {
            // If no features returned, we've reached the end
            hasMore = false;
        }
    }

    //console.log(`Total features fetched: ${allFeatures.length}`);
    return allFeatures;
  }

  /**
   * Create and add GeoJSON layer to the map with proper styling
   */
  private createAndAddGeoJSONLayer(allFeatures: any[], layerConfig: LayerConfig, drawingInfo: DrawingInfo | null): L.GeoJSON {
    // Create the complete GeoJSON object
    // GeoJSON is a standard format for representing geographic features
    // It wraps all features in a "FeatureCollection" structure
    const completeGeoJSON = {
        type: 'FeatureCollection' as const,
        features: allFeatures
    } as any;
    
    // Create style function based on drawing info
    const styleFunction = this.styleService.createStyleFunction(drawingInfo);
    
    // CREATE MARKER CLUSTER GROUP FOR TEXT LABELS
    const textClusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 25,  // Distance to cluster (pixels)
      disableClusteringAtZoom: 19,  // Stop clustering at high zoom
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
        // This function is called for each feature to determine its appearance
        style: (feature) => {
            const style = styleFunction(feature);
            // Ensure polygon visibility
            // Special handling for polygon layers to make sure they're visible
            if (layerConfig.title && layerConfig.title.includes('Polys')) {
                style.fillOpacity = style.fillOpacity || 0.6; // Make sure polygons have some transparency
                style.weight = style.weight || 1; // Keep border lines thin for performance
            }
            return style;
        },
        // Function to create markers for point features
        // Instead of default markers (which can be slow), use simple circles
        pointToLayer: (feature, latlng) => {
            const style = styleFunction(feature);
            // Use circle markers instead of default markers for better performance
            return L.circleMarker(latlng, {
                ...style,
                radius: style.radius || 5  // Provide a default radius if undefined
            });
        },
        // Add text labels for each feature
        onEachFeature: (feature, layer) => {
          const textValue = feature.properties?.Text;
          if (textValue && textValue.trim()) {
              // GET POSITION FROM FEATURE GEOMETRY DIRECTLY
              let position: L.LatLng;
              
              if (feature.geometry.type === 'Point') {
                  const coords = feature.geometry.coordinates;
                  position = L.latLng(coords[1], coords[0]);
              } else {
                  // For polygons/lines, use the centroid from the layer
                  position = (layer as any).getBounds().getCenter();
              }
              
              // CREATE TEXT MARKER FOR CLUSTERING
              const textMarker = L.marker(position, {
                  icon: L.divIcon({
                      html: textValue,
                      className: styles.textLabel,
                      iconSize: [100, 20]
                  })
              });
              
              // ADD TO CLUSTER GROUP INSTEAD OF TOOLTIP
              textClusterGroup.addLayer(textMarker);
          }
      },
        
        // Disable all interactivity for better performance
        interactive: false,
        bubblingMouseEvents: false
    });

    // Add the layer to the map
    geoJsonLayer.addTo(this.map!);
    textClusterGroup.addTo(this.map!);  // ADD CLUSTER GROUP TO MAP

    
    //console.log(`Successfully added feature layer: ${layerConfig.title} with ${allFeatures.length} features`);

    return geoJsonLayer;
  }

  private getBounds(geoJsonLayer: L.GeoJSON): void {
    try {
      const bounds = geoJsonLayer.getBounds();
      
      // Extract corner coordinates for MapViewService
      if (bounds.isValid() && this.mapViewService) {
        const boundsArray = [
          bounds.getSouthWest(),
          bounds.getNorthEast(),
          bounds.getNorthWest(),
          bounds.getSouthEast()
        ];
        this.mapViewService.setFeatureBounds(boundsArray);
      }
    } catch (error) {
      //console.error('Error fitting map to features:', error);
    }
  }
}