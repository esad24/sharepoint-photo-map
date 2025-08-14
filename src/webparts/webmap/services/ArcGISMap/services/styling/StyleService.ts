/* ========================================================================== */
/* services/StyleService.ts                                                   */
/* - Service for creating style functions and handling renderers              */
/* ========================================================================== */

import { SymbolConverter } from './SymbolConverter';
import { DrawingInfo, FeatureStyle } from '../../types/ArcGISTypes';

export class StyleService {
  private symbolConverter: SymbolConverter;

  constructor() {
    this.symbolConverter = new SymbolConverter();
  }

  /**
   * Create style function for GeoJSON layer based on ArcGIS renderer
   */
  public createStyleFunction(drawingInfo: DrawingInfo | null): (feature: any) => FeatureStyle {
    // Return a function that takes a feature and returns its style
    return (feature: any) => {
      // Default style if no drawing info is available
      // This ensures features are visible even if styling fails
      const defaultStyle: FeatureStyle = {
        color: '#3388ff',      // Line/border color (blue)
        weight: 2,             // Line width in pixels
        opacity: 0.8,          // Line opacity (0 = invisible, 1 = fully opaque)
        fillOpacity: 0.4,      // Fill opacity for polygons
        fillColor: '#3388ff'   // Fill color for polygons
      };

      // Return default if no drawing info
      if (!drawingInfo || !drawingInfo.renderer) {
        return defaultStyle;
      }

      const renderer = drawingInfo.renderer;
      
      // Handle unique value renderer (most common for categorical data)
      if (renderer.type === 'uniqueValue') {
        return this.handleUniqueValueRenderer(renderer, feature, defaultStyle);
      }
      
      // Handle simple renderer
      if (renderer.type === 'simple' && renderer.symbol) {
        return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.symbol);
      }
      
      return defaultStyle; // Fallback to default style if nothing else works
    };
  }

  /**
   * Handle unique value renderer styling
   */
  private handleUniqueValueRenderer(renderer: any, feature: any, defaultStyle: FeatureStyle): FeatureStyle {
    // Get the value of the field used for rendering (e.g., "highway", "local_road")
    const fieldValue = feature.properties[renderer.field1];
    
    // Find matching unique value info
    // Look for a styling rule that matches this feature's field value
    const matchingInfo = renderer.uniqueValueInfos?.find((info: any) => 
      info.value === fieldValue || info.value === String(fieldValue) // Check both exact and string match
    );
    
    // If found, convert the ESRI symbol to Leaflet style
    if (matchingInfo && matchingInfo.symbol) {
      return this.symbolConverter.convertEsriSymbolToLeafletStyle(matchingInfo.symbol);
    }
    
    // Use default symbol if no specific match found
    if (renderer.defaultSymbol) {
      return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
    }

    return defaultStyle;
  }
}