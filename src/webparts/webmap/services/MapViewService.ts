/* ========================================================================== */
/* services/MapView.ts                                                        */
/* - Service for managing map view and bounds                                 */
/* - Coordinates between image markers and feature layers                     */
/* - Handles automatic zoom to fit all content                                */
/* ========================================================================== */

import * as L from 'leaflet';

/**
 * Hochtief default view coordinates
 * Used when no content is available to display
 */
const HOCHTIEF_DEFAULT_VIEW = {
  lat: 51.4239,    // Hochtief headquarters latitude
  lon: 6.9985,     // Hochtief headquarters longitude
  zoom: 15         // Default zoom level
};

/**
 * Service for managing map view and bounds
 * Coordinates between different data sources to ensure optimal map view
 */
export class MapViewService {
  private map: L.Map;
  private imageBounds: L.LatLng[] = [];     // Bounds for image markers
  private featureBounds: L.LatLng[] = [];   // Bounds for feature layers
  
  constructor(map: L.Map) {
    this.map = map;
  }

  /**
   * Set bounds for image markers
   * Called by DataService after images are loaded
   */
  public setImageBounds(bounds: L.LatLng[]): void {
    this.imageBounds = [...bounds]; // Create a copy to avoid reference issues
    console.log(`MapView: Updated image bounds - ${bounds.length} points`);
    this.updateMapView();
  }

  /**
   * Set bounds for feature layers
   * Called by FeatureLayerService after features are loaded
   */
  public setFeatureBounds(bounds: L.LatLng[]): void {
    this.featureBounds = [...bounds]; // Create a copy to avoid reference issues
    console.log(`MapView: Updated feature bounds - ${bounds.length} points`);
    this.updateMapView();
  }

  /**
   * Clear all bounds (useful when refreshing data)
   */
  public clearBounds(): void {
    this.imageBounds = [];
    this.featureBounds = [];
    console.log('MapView: Cleared all bounds');
  }

  /**
   * Main method to update map view based on current bounds
   * Implements the logic for different scenarios
   */
  private updateMapView(): void {
    try {
      // Combine all available bounds
      const allBounds = [...this.imageBounds, ...this.featureBounds];
      
      if (allBounds.length === 0) {
        // No content available - set Hochtief default view
        console.log('MapView: No content available, setting Hochtief default view');
        this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
        return;
      }

      if (allBounds.length === 1) {
        // Only one point - center on it with reasonable zoom
        console.log('MapView: Single point detected, centering with default zoom');
        const point = allBounds[0];
        this.map.setView([point.lat, point.lng], 16); // Zoom level 16 for single points
        return;
      }

      // Multiple points - fit all bounds
      console.log(`MapView: Multiple points detected (${allBounds.length}), fitting to bounds`);
      
      // Create LatLngBounds object from all points
      const boundsGroup = new L.LatLngBounds(allBounds);
      
      // Fit the map to show all points with some padding
      this.map.fitBounds(boundsGroup, {
        padding: [20, 20], // Add 20px padding on all sides
        maxZoom: 18        // Don't zoom in too close even for nearby points
      });

      // Log the final bounds for debugging
      const center = boundsGroup.getCenter();
      console.log(`MapView: Set view to center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
      
    } catch (error) {
      // If anything goes wrong with bounds calculation, fall back to default view
      console.error('MapView: Error updating map view, falling back to default:', error);
      this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
    }
  }

  /**
   * Force immediate view update
   * Useful for manual triggers or debugging
   */
  public forceUpdateView(): void {
    console.log('MapView: Force updating view');
    this.updateMapView();
  }

  /**
   * Get current bounds summary for debugging
   */
  public getBoundsSummary(): { images: number; features: number; total: number } {
    return {
      images: this.imageBounds.length,
      features: this.featureBounds.length,
      total: this.imageBounds.length + this.featureBounds.length
    };
  }

  /**
   * Check if map has any content to display
   */
  public hasContent(): boolean {
    return this.imageBounds.length > 0 || this.featureBounds.length > 0;
  }

  /**
   * Set default Hochtief view manually
   * Useful for reset operations
   */
  public setDefaultView(): void {
    console.log('MapView: Setting Hochtief default view');
    this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
  }
}