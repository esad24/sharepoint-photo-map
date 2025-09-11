import * as L from 'leaflet';

export function addWatermark(map: L.Map): void {
  if (!map) return;
  const WatermarkControl = L.Control.extend({
    options: {
      position: 'bottomleft' 
    },
    onAdd: function(map: L.Map) {
      const container = L.DomUtil.create('div', 'leaflet-control-watermark');
      container.style.cssText = `
        background: rgba(255, 255, 255, 0.7);
        padding: 8px 12px;
        border-radius: 5px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.2;
      `;
      const title = L.DomUtil.create('div', '', container);
      title.innerHTML = '<strong style="font-size: 14px; color: #333;">Powered by ViCon</strong>';

      const subtitle = L.DomUtil.create('div', '', container);
      subtitle.innerHTML = '<span style="font-size: 12px; color: #666;">Build digitally first.</span>';

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      
      return container;
    }
  });
  new WatermarkControl().addTo(map);
}