import * as L from 'leaflet';

/**
 * Add watermark to the map
 */
export function addWatermark(map: L.Map): void {
  if (!map) return;

  // Create a custom Leaflet control for the watermark
  const WatermarkControl = L.Control.extend({
    options: {
      position: 'bottomleft' // Position at bottom left corner
    },

    onAdd: function(map: L.Map) {
      // Create the watermark container
      const container = L.DomUtil.create('div', 'leaflet-control-watermark');
      
      // Style the container
      container.style.cssText = `
        background: rgba(255, 255, 255, 0.7);
        padding: 8px 12px;
        border-radius: 5px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.2;
      `;
      
      // Add the title
      const title = L.DomUtil.create('div', '', container);
      title.innerHTML = '<strong style="font-size: 14px; color: #333;">Powered by ViCon</strong>';
      
      // Add the subtitle
      const subtitle = L.DomUtil.create('div', '', container);
      subtitle.innerHTML = '<span style="font-size: 12px; color: #666;">Build digitally first.</span>';
      
      // Prevent map interactions on the watermark
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      
      return container;
    }
  });

  // Add the watermark control to the map
  new WatermarkControl().addTo(map);
}