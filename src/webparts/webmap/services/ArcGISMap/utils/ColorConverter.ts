/* ========================================================================== */
/* utils/ColorConverter.ts                                                    */
/* - Utilities for converting between ESRI and CSS color formats              */
/* ========================================================================== */

/**
 * Convert ESRI color array to CSS color string
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ COLOR FORMATS:                                                          │
 * │ • ESRI uses arrays like [255, 0, 0, 128] for red with 50% transparency │
 * │ • CSS uses strings like "rgba(255, 0, 0, 0.5)" for the same color     │
 * │ • We need to convert between these formats                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param esriColor - Array of [Red, Green, Blue, Alpha] values (0-255 each)
 * @returns CSS color string
 */
export function esriColorToCSS(esriColor: number[]): string {
    // Default to blue if color is invalid
    if (!esriColor || esriColor.length < 3) return '#3388ff';
    
    // Destructure color components, default alpha to 255 (fully opaque)
    const [r, g, b, a = 255] = esriColor;
    
    // Use rgba if transparency is specified
    if (a < 255) {
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`; // Convert alpha from 0-255 to 0-1 scale
    }
    // Use rgb for fully opaque colors (slightly more efficient)
    return `rgb(${r}, ${g}, ${b})`;
  }