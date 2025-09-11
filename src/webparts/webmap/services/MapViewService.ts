// Service for managing map view and bounds                                 
// Handles automatic zoom to fit all images                             

import * as L from 'leaflet';

import { HOCHTIEF_DEFAULT_VIEW } from '../constants/constants';


export class MapViewService {
private map: L.Map;
private imageBounds: L.LatLng[] = [];     // Bounds for image markers

constructor(map: L.Map) {
  this.map = map;
}
public setImageBounds(bounds: L.LatLng[]): void {
  this.imageBounds = [...bounds]; // Create a copy to avoid reference issues
  this.updateMapView();
}



// Clear all bounds

public clearBounds(): void {
  this.imageBounds = [];

}

private updateMapView(): void {
  try {

    const allBounds = [...this.imageBounds];
    
    if (allBounds.length === 0) {
      // No content available - set Hochtief default view
      this.setDefaultView();
      return;
    }

    if (allBounds.length === 1) {
      // Only one point - center on it with reasonable zoom
      const point = allBounds[0];
      this.map.setView([point.lat, point.lng], 16); // Zoom level 16 for single points
      return;
    }

    // Multiple points - fit all bounds
    // Create LatLngBounds object from all points
    const boundsGroup = new L.LatLngBounds(allBounds);
    
        this.map.fitBounds(boundsGroup, {
      padding: [20, 20], // Add 20px padding on all sides
      maxZoom: 18       
    });

    
  } catch (error) {
    // If anything goes wrong with bounds calculation, fall back to default view
    this.setDefaultView()  }
}

public forceUpdateView(): void {
  this.updateMapView();
}


public hasContent(): boolean {
  return this.imageBounds.length > 0;
}


public setDefaultView(): void {
  this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
}
}