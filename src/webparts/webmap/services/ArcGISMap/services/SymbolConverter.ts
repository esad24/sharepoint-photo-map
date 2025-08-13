/* ========================================================================== */
/* services/SymbolConverter.ts                                                */
/* - Service for converting ESRI symbols to Leaflet styles                    */
/* ========================================================================== */

import { esriColorToCSS } from '../utils/ColorConverter';
import { FeatureStyle } from '../types/ArcGISTypes';

export class SymbolConverter {
  /**
   * Convert ESRI symbol to Leaflet style
   * 
   * ┌─────────────────────────────────────────────────────────────────────────┐
   * │ SYMBOL CONVERSION:                                                      │
   * │                                                                         │
   * │ ESRI and Leaflet use different formats for describing how features     │
   * │ should look. This is like translating between two different languages  │
   * │ that describe the same thing.                                          │
   * │                                                                         │
   * │ ESRI might say:   "esriSLS with color [255,0,0] and width 3"          │
   * │ Leaflet wants:    "{ color: 'rgb(255,0,0)', weight: 3 }"              │
   * └─────────────────────────────────────────────────────────────────────────┘
   */
  public convertEsriSymbolToLeafletStyle(symbol: any): FeatureStyle {
    const style: FeatureStyle = {}; // Initialize empty style object
    
    // Handle Simple Line Symbol (for roads, boundaries, etc.)
    if (symbol.type === 'esriSLS') {
      this.convertLineSymbol(symbol, style);
    } 
    // Handle Simple Fill Symbol (for areas like buildings, zones, etc.)
    else if (symbol.type === 'esriSFS') {
      this.convertFillSymbol(symbol, style);
    } 
    // Handle Simple Marker Symbol (for point locations like buildings, landmarks, etc.)
    else if (symbol.type === 'esriSMS') {
      this.convertMarkerSymbol(symbol, style);
    }
    
    return style; // Return the converted style object for Leaflet to use
  }

  /**
   * Convert ESRI Simple Line Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Line Symbol (esriSLS)
   * @param style  - Style object to populate
   */
  private convertLineSymbol(symbol: any, style: FeatureStyle): void {
    style.color = esriColorToCSS(symbol.color); // Convert color format
    style.weight = symbol.width || 2; // Line width in pixels, default to 2
    // Calculate opacity from alpha channel if present
    style.opacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
    
    // Handle line style patterns (solid, dashed, dotted, etc.)
    if (symbol.style === 'esriSLSDash') {
      style.dashArray = '5,5'; // 5 pixels line, 5 pixels gap, repeat
    } else if (symbol.style === 'esriSLSDot') {
      style.dashArray = '2,2'; // 2 pixels dot, 2 pixels gap, repeat
    } else if (symbol.style === 'esriSLSDashDot') {
      style.dashArray = '5,2,2,2'; // Dash-dot-dash-dot pattern
    }
  }

  /**
   * Convert ESRI Simple Fill Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Fill Symbol (esriSFS)  
   * @param style  - Style object to populate
   */
  private convertFillSymbol(symbol: any, style: FeatureStyle): void {
    style.fillColor = esriColorToCSS(symbol.color); // Interior color of the polygon
    // Calculate fill opacity from alpha channel
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
    
    // Handle outline (border) of polygon
    if (symbol.outline) {
      style.color = esriColorToCSS(symbol.outline.color); // Border color
      style.weight = symbol.outline.width || 1; // Border width in pixels
      // Calculate border opacity
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }

  /**
   * Convert ESRI Simple Marker Symbol to Leaflet style
   * 
   * @param symbol - ESRI Simple Marker Symbol (esriSMS)
   * @param style  - Style object to populate  
   */
  private convertMarkerSymbol(symbol: any, style: FeatureStyle): void {
    style.radius = symbol.size || 6; // Circle radius in pixels
    style.fillColor = esriColorToCSS(symbol.color); // Fill color of the circle
    // Calculate fill opacity
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
    
    // Handle outline (border) of point marker
    if (symbol.outline) {
      style.color = esriColorToCSS(symbol.outline.color); // Border color
      style.weight = symbol.outline.width || 1; // Border width
      // Calculate border opacity
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }
}