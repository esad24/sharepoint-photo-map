//Service for converting ESRI symbols to Leaflet styles                    

import { esriColorToCSS } from './ColorConverter';
import { FeatureStyle } from '../../types/ArcGISTypes';

export class SymbolConverter {

  // Convert ESRI symbol to Leaflet style
  public convertEsriSymbolToLeafletStyle(symbol: any): FeatureStyle {
    const style: FeatureStyle = {}; 
    
    // Handle Simple Line Symbol
    if (symbol.type === 'esriSLS') {
      this.convertLineSymbol(symbol, style);
    } 
    // Handle Simple Fill Symbol
    else if (symbol.type === 'esriSFS') {
      this.convertFillSymbol(symbol, style);
    } 
    // Handle Simple Marker Symbol 
    else if (symbol.type === 'esriSMS') {
      this.convertMarkerSymbol(symbol, style);
    }
    
    return style; 
  }

  // Convert ESRI Simple Line Symbol to Leaflet style

  private convertLineSymbol(symbol: any, style: FeatureStyle): void {
    style.color = esriColorToCSS(symbol.color); 
    style.weight = symbol.width || 2;
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

  // Convert ESRI Simple Fill Symbol to Leaflet style

  private convertFillSymbol(symbol: any, style: FeatureStyle): void {
    style.fillColor = esriColorToCSS(symbol.color);
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
    
    // Handle outline of polygon
    if (symbol.outline) {
      style.color = esriColorToCSS(symbol.outline.color); 
      style.weight = symbol.outline.width || 1; 
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }

  // Convert ESRI Simple Marker Symbol to Leaflet style

  private convertMarkerSymbol(symbol: any, style: FeatureStyle): void {
    style.radius = symbol.size || 6; 
    style.fillColor = esriColorToCSS(symbol.color);
    style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
    
    // Handle outline of point marker
    if (symbol.outline) {
      style.color = esriColorToCSS(symbol.outline.color); 
      style.weight = symbol.outline.width || 1;
      style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ? 
        symbol.outline.color[3] / 255 : 1;
    }
  }
}