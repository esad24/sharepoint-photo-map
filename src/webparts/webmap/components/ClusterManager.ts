/* ========================================================================== */
/* ClusterManager.ts                                                          */
/* - Manages marker clustering and popup interactions                         */
/* ========================================================================== */

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { IClusterClickEvent, IWebmapListItem } from '../types/IWebmapTypes';
import { sanitizeUrl, escAttr } from '../utils/Security';
import styles from '../WebmapWebPart.module.scss';

export class ClusterManager {
  private markerCluster: L.MarkerClusterGroup | undefined;
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
    this.initializeClusterLayer();
  }

  /**
   * Initialize the marker cluster group.
   * This groups nearby markers together to avoid cluttering the map
   */
  private initializeClusterLayer(): void {
    this.markerCluster = L.markerClusterGroup({
      // `iconCreateFunction` is a customization that defines how a cluster icon looks.
      // This function is called for each cluster to create its visual representation
      iconCreateFunction: (cluster) => {
        // Get the first marker in the cluster to use its image for the cluster icon.
        // This makes the cluster show a preview of what's inside
        const first: L.Marker = cluster.getAllChildMarkers()[0]; // Use the specific L.Marker type instead of 'any'.
        const img = sanitizeUrl(first?.options.data?.img as string); // Safely get and sanitize the image URL

        const count  = cluster.getChildCount(); // How many markers are in this cluster.
        const digits = String(count).length;     // Number of digits in the count (1, 2, 3, etc.).
        const badgeH = 22; // Height of the count badge in pixels.
        // Dynamically calculate the width of the badge to fit the count number.
        // Single digit = 22px wide, each additional digit adds 10px
        const badgeW = digits === 1 ? badgeH : badgeH + (digits - 1) * 10;

        // The HTML for the custom cluster icon.
        // Note the use of `escAttr` for security when inserting the image URL.
        const html = `
          <div style="position:relative;width:60px;height:60px;display:inline-block;">
            <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;">
              <img src="${escAttr(img)}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div style="
              position:absolute;top:-8px;right:-8px;width:${badgeW}px;height:${badgeH}px;
              background:#007AFF;color:#fff;font:700 12px/1 'Segoe UI',sans-serif;
              padding:0 4px;border-radius:9999px;display:flex;align-items:center;
              justify-content:center;box-shadow:0 0 2px rgba(0,0,0,.25);">
              ${count}
            </div>
          </div>
        `;

        // Return a Leaflet DivIcon with our custom HTML
        // className: '' prevents Leaflet from adding default styles
        // iconSize: [60, 60] tells Leaflet the size of our icon
        return L.divIcon({ html, className: '', iconSize: [60, 60] });
      },
      zoomToBoundsOnClick: false, // Disable the default behavior of zooming in when a cluster is clicked.
      showCoverageOnHover: false // Don't show the coverage area of the cluster on hover (blue outline).
    });

    // Add the newly created cluster layer to the map.
    this.map.addLayer(this.markerCluster);

    // Set up gallery popup on cluster click
    this.setupClusterClickHandler();
  }

  /**
   * Gallery popup on cluster click
   * Since zoomToBoundsOnClick is false, we can define our own click behavior.
   * This creates a photo gallery popup when clicking on a cluster
   */
  private setupClusterClickHandler(): void {
    if (!this.markerCluster) return;

    this.markerCluster.on('clusterclick', (e: IClusterClickEvent) => { // Use a specific event type instead of 'any'.
      const markers = e.layer.getAllChildMarkers(); // Get all individual markers within the clicked cluster
      if (!markers.length) return; // Exit if no markers (shouldn't happen but good to check)

      // Create a simple image gallery from all the images within the cluster.
      const imgList = markers.map(m => sanitizeUrl(m.options.data?.img as string)); // Extract and sanitize all image URLs
      let current = 0; // Index of the currently displayed image in the gallery.

      // Programmatically create the HTML elements for the gallery popup using Leaflet's DOM utilities.
      const container = L.DomUtil.create('div', styles.galleryContainer); // Main container with gallery styles

      // Create a wrapper link for the image
      // This allows users to click the image to open it full-size in a new tab
      const imgLink = L.DomUtil.create('a', '', container) as HTMLAnchorElement;
      imgLink.href = imgList[0]; // Set initial href to first image
      imgLink.target = '_blank'; // Open in new tab
      imgLink.rel = 'noopener noreferrer'; // Security best practice for external links
      imgLink.style.cursor = 'pointer'; // Show pointer cursor on hover

      // Create the actual image element inside the link
      const imgEl = L.DomUtil.create('img', styles.popupImg, imgLink) as HTMLImageElement;  
      imgEl.src = imgList[0]; // Set initial image to first in list

      // Create navigation container for prev/next buttons
      const nav = L.DomUtil.create('div', styles.galleryNav, container);

      // Create previous button
      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '◀'; // Left arrow character
      prevBtn.onclick = () => {
        // Move to previous image, wrapping around to end if at beginning
        current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
        imgEl.src = imgList[current]; // Update displayed image
        imgLink.href = imgList[current]; // Update the link href
      };

      // Create next button
      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = '▶'; // Right arrow character
      nextBtn.onclick = () => {
        // Move to next image, wrapping around to beginning if at end
        current = (current + 1) % imgList.length; // Cycle forwards.
        imgEl.src = imgList[current]; // Update displayed image
        imgLink.href = imgList[current]; // Update the link href
      };

      // Create and open the Leaflet popup at the cluster's location, containing the gallery.
      L.popup({ 
        className: 'photoGalleryPopup', // CSS class for styling
        maxWidth: 300 // Maximum width in pixels
      })
        .setLatLng(e.latlng) // Position at cluster location
        .setContent(container) // Set our gallery container as content
        .openOn(this.map!); // Open on the map (! tells TypeScript map is defined)
    });
  }

  /**
   * Clear all markers from the cluster layer
   */
  public clearMarkers(): void {
    this.markerCluster?.clearLayers();
  }

  /**
   * Add a marker to the cluster layer
   */
  public addMarker(lat: number, lon: number, item: IWebmapListItem, imgUrl: string): L.Marker {
    // Create a custom icon for the individual marker (not a cluster).
    // This shows the actual image as a small thumbnail on the map
    const icon = L.divIcon({
      html: `<img src="${imgUrl}" style="width:40px;height:40px;border-radius:5px;" />`,
      className: '', // Empty className prevents Leaflet default styles
      iconSize: [40, 40] // Size of the icon in pixels
    });

    // Create the Leaflet marker with coordinates, the custom icon, and our enriched data payload.
    const marker = L.marker([lat, lon], { 
      icon, // Our custom image icon
      data: item // Attach the full SharePoint item data for later use
    });

    // Bind a simple popup to the individual marker, showing its image.
    // This appears when clicking on a single (non-clustered) marker
    marker.bindPopup(`
      <div>
        <a href="${imgUrl}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
          <img src="${imgUrl}" class="${styles.popupImg}" />
        </a>
      </div>
    `);

    // Add the final marker to the cluster layer.
    // The cluster layer will automatically group it with nearby markers
    this.markerCluster!.addLayer(marker);

    return marker;
  }

  public getClusterGroup(): L.MarkerClusterGroup | undefined {
    return this.markerCluster;
  }

  public dispose(): void {
    this.markerCluster?.clearLayers();
    this.markerCluster = undefined;
  }
}