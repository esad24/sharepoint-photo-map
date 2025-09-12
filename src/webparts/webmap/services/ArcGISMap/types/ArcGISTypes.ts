// Type definitions for ArcGIS-related data structures                      

export interface LayerConfig {
    title?: string;
    layerType?: string;
    url?: string;
    opacity?: number;
    layers?: any[];
    defaultVisibility?: boolean;
    id?: number;
  }
  
  export interface DrawingInfo {
    renderer?: any;
  }
  
  export interface WebmapData {
    operationalLayers?: any[];
  }
  
  export interface FeatureStyle {
    color?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
    fillColor?: string;
    radius?: number;
    dashArray?: string;
  }