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
      if (renderer.type === 'simple' && renderer.symbol) {   // test für render type 'uniqueValue'
        return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.symbol);
      }

      // Handle unique value renderer
      if (renderer.type === 'uniqueValue' && renderer.uniqueValueInfos && renderer.field1) {
        const fieldName = renderer.field1;
        const fieldValue = feature?.properties?.[fieldName];
  
        if (fieldValue !== null) {
          const match = renderer.uniqueValueInfos.find(
            (info: any) => info.value === fieldValue
          );
  
          if (match && match.symbol) {
            return this.symbolConverter.convertEsriSymbolToLeafletStyle(match.symbol);
          }
        }
      }

      // If a default symbol is defined, use it
      if (renderer.defaultSymbol) {
        return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
      }


      // More cases (like class breaks) can be added here as needed

      //


      return defaultStyle; // Fallback to default style if nothing else works
    };
  }
}