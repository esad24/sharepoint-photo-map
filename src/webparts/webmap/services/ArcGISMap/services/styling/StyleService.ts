// Service for creating style functions and handling renderers              

import { SymbolConverter } from './SymbolConverter';
import { DrawingInfo, FeatureStyle } from '../../types/ArcGISTypes';

export class StyleService {
  private symbolConverter: SymbolConverter;

  constructor() {
    this.symbolConverter = new SymbolConverter();
  }

  // Create style function for GeoJSON layer based on ArcGIS renderer

  public createStyleFunction(drawingInfo: DrawingInfo | null): (feature: any) => FeatureStyle {

    return (feature: any) => {
      // Default style if no drawing info is available
      const defaultStyle: FeatureStyle = {
        color: '#3388ff',      // Line/border color (blue)
        weight: 2,             // Line width in pixels
        opacity: 0.8,          // Line opacity 
        fillOpacity: 0.4,      // Fill opacity for polygons
        fillColor: '#3388ff'   // Fill color for polygons
      };

      // Return default if no drawing info
      if (!drawingInfo || !drawingInfo.renderer) {
        return defaultStyle;
      }

      const renderer = drawingInfo.renderer;
      
      // Handle simple renderer
      if (renderer.type === 'simple' && renderer.symbol) {
        return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.symbol);
      }
      
      return defaultStyle; // Fallback to default style if nothing else works
    };
  }
}