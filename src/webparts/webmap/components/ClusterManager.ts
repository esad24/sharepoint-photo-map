// Manages marker clustering and popup interactions                         


import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { IClusterClickEvent } from '../types/IWebmapTypes';
import styles from '../WebmapWebPart.module.scss';
import { createClusterIconHtml } from './ClusterIcon';

export interface IMapItemData {
  lat: number;
  lon: number;
  imgUrl: string;
}

export class ClusterManager {
  private markerCluster: L.MarkerClusterGroup | undefined;
  private map: L.Map;

  // Cache for Cluster Icons HTML
  private clusterIconCache: Map<string, L.DivIcon> = new Map();

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
        const img = (first?.options as any).imgUrl as string; // Access imgUrl directly
        const count  = cluster.getChildCount();

        const cacheKey = `${img}-${count}`;
        if (this.clusterIconCache.has(cacheKey)) return this.clusterIconCache.get(cacheKey)!;

        const html = createClusterIconHtml(img, count);
        const icon = L.divIcon({ html, className: '', iconSize: [70, 70] });
        this.clusterIconCache.set(cacheKey, icon); // save cache
        return icon;
      },
      zoomToBoundsOnClick: false, // Disable the default behavior of zooming in when a cluster is clicked.
      showCoverageOnHover: false, // Don't show the coverage area of the cluster on hover (blue outline)
      spiderfyOnMaxZoom: false, // Disable spiderfying to avoid cluttered popups
      chunkedLoading: true, // Load markers in chunks for better performance with many markers
      chunkInterval: 200, // Time in ms between chunks

      removeOutsideVisibleBounds: true, // Remove markers outside the current view to save memory
      animate: false,
      animateAddingMarkers: false

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
      const imgList = markers.map(m => (m.options as any).imgUrl as string); 
      let current = 0; // Index of the currently displayed image in the gallery.

      const container = L.DomUtil.create('div', styles.galleryContainer); // Main container with gallery styles

      // Create clickable image element
      const imgEl = L.DomUtil.create('img', styles.popupImg, container) as HTMLImageElement;
      imgEl.src = imgList[0];
      imgEl.loading = 'lazy'
      imgEl.style.cursor = 'pointer';
      
      // Add event listener for new tab opening
      imgEl.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(imgList[current], '_blank', 'noopener,noreferrer');
      });

      
      const caption = L.DomUtil.create('div', '', container);
      caption.innerHTML = `${current + 1} of ${imgList.length}`;
      caption.style.paddingTop = '4px';


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
        caption.innerHTML = `${current + 1} of ${imgList.length}`;
      };

      // Create next button
      const nextBtn = L.DomUtil.create('button', '', nav);
      nextBtn.innerHTML = ''; // Right arrow character
      nextBtn.className = styles.galleryNavNext;
      nextBtn.onclick = () => {
        current = (current + 1) % imgList.length;  // Move to next image, wrapping around to beginning if at end
        imgEl.src = imgList[current];
        caption.innerHTML = `${current + 1} of ${imgList.length}`;
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


  public addMarker(lat: number, lon: number, imgUrl: string): L.Marker {
    // Create a custom icon for individual marker 
    const icon = L.divIcon({
      html: `<img src="${imgUrl}" loading="lazy" style="width:60px;height:60px;border-radius:6px;" />`,
      className: '', 
      iconSize: [60, 60] 
    });

    const marker = L.marker([lat, lon], { 
      icon,
      imgUrl // Store image URL directly in marker options
    } as any);
  
    // Create popup content with event listener
    marker.bindPopup(() => {this.markerCluster = L.markerClusterGroup();

      const popupContent = L.DomUtil.create('div');
      const imgElement = L.DomUtil.create('img', styles.popupImg, popupContent) as HTMLImageElement;
      imgElement.src = imgUrl;
      imgElement.loading = 'lazy';
      imgElement.style.cursor = 'pointer';
      
      // Add event listener for new tab opening
      imgElement.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(imgUrl, '_blank', 'noopener,noreferrer');
      });
      return popupContent;
    });
    
    this.markerCluster!.addLayer(marker);
    return marker;
  }

  public getClusterGroup(): L.MarkerClusterGroup | undefined {
    return this.markerCluster;
  }

  public clearMarkers(): void {
    this.markerCluster?.clearLayers();
  }

  public dispose(): void {
    this.markerCluster?.clearLayers();
    this.markerCluster?.off(); // Remove all event listeners
    this.markerCluster = undefined;
    this.clusterIconCache.clear(); // Cache auch leeren
  }
}