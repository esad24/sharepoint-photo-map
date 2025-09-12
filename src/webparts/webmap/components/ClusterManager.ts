// Manages marker clustering and popup interactions                         


import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { IClusterClickEvent } from '../types/IWebmapTypes';
import { sanitizeUrl, escAttr } from '../utils/Security';
import styles from '../WebmapWebPart.module.scss';
import { createClusterIconHtml } from './ClusterIcon';

export class ClusterManager {
  private markerCluster: L.MarkerClusterGroup | undefined;
  private map: L.Map;

  constructor(map: L.Map) {
    this.map = map;
    this.initializeClusterLayer();
  }


  //This groups nearby markers together to avoid cluttering the map
  private initializeClusterLayer(): void {
    this.markerCluster = L.markerClusterGroup({
      // `iconCreateFunction` is a customization that defines how a cluster icon looks.
      iconCreateFunction: (cluster) => {
        const first: L.Marker = cluster.getAllChildMarkers()[0]; // FIrst image for the cluster icon
        const img = sanitizeUrl((first?.options as any).imgUrl as string); // Access imgUrl directly
        const count  = cluster.getChildCount();

        const html = createClusterIconHtml(img, count);

        // Return a Leaflet DivIcon with our custom HTML
        return L.divIcon({ html, className: '', iconSize: [70, 70] });
      },
      zoomToBoundsOnClick: false, // Disable the default behavior of zooming in when a cluster is clicked.
      showCoverageOnHover: false // Don't show the coverage area of the cluster on hover (blue outline)
    });
    this.map.addLayer(this.markerCluster);

    // Set up gallery popup on cluster click
    this.setupClusterClickHandler();
  }

  // This creates a photo gallery popup when clicking on a cluster
  private setupClusterClickHandler(): void {
    if (!this.markerCluster) return;

    this.markerCluster.on('clusterclick', (e: IClusterClickEvent) => {
      const markers = e.layer.getAllChildMarkers(); // Get all individual markers within the clicked cluster
      if (!markers.length) return; 

      // Create a simple image gallery from all the images within the cluster.
      const imgList = markers.map(m => sanitizeUrl((m.options as any).imgUrl as string)); 
      let current = 0; // Index of the currently displayed image in the gallery.
      const container = L.DomUtil.create('div', styles.galleryContainer); // Main container with gallery styles



      // Create clickable image element
      const imgEl = L.DomUtil.create('img', styles.popupImg, container) as HTMLImageElement;
      imgEl.src = imgList[0];
      imgEl.style.cursor = 'pointer';
      
      // Add event listener for new tab opening
      imgEl.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(imgList[current], '_blank', 'noopener,noreferrer');
      });


      // navigation container for prev/next buttons
      const nav = L.DomUtil.create('div', styles.galleryNav, container);

      // previous button
      const prevBtn = L.DomUtil.create('button', '', nav);
      prevBtn.innerHTML = '';
      prevBtn.className = styles.galleryNavPrev;
      prevBtn.onclick = () => {
        // Move to previous image, wrapping around to end if at beginning
        current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
        imgEl.src = imgList[current]; // Update displayed image
      };

      // Create next button
      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = ''; // Right arrow character
      nextBtn.className = styles.galleryNavNext;
      nextBtn.onclick = () => {
        current = (current + 1) % imgList.length;  // Move to next image, wrapping around to beginning if at end
        imgEl.src = imgList[current]; 
      };

      // Create and open the Leaflet popup at the cluster's location, containing the gallery.
      L.popup({ 
        className: 'photoGalleryPopup', 
        maxWidth: 300 
      })
        .setLatLng(e.latlng) 
        .setContent(container) 
        .openOn(this.map!);
    });
  }


  public clearMarkers(): void {
    this.markerCluster?.clearLayers();
  }


  public addMarker(lat: number, lon: number, imgUrl: string): L.Marker {
    // Create a custom icon for individual marker 
    const icon = L.divIcon({
      html: `<img src="${imgUrl}" style="width:60px;height:60px;border-radius:6px;" />`,
      className: '', 
      iconSize: [60, 60] 
    });

    const marker = L.marker([lat, lon], { 
      icon,
      imgUrl // Store image URL directly in marker options
    } as any);
  
    // Create popup content with event listener
    const popupContent = L.DomUtil.create('div');
    const imgElement = L.DomUtil.create('img', styles.popupImg, popupContent) as HTMLImageElement;
    imgElement.src = imgUrl;
    imgElement.style.cursor = 'pointer';
    
    // Add event listener for new tab opening
    imgElement.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.open(imgUrl, '_blank', 'noopener,noreferrer');
    });
    
    marker.bindPopup(popupContent);
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