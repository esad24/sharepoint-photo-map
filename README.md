# Photo Map Web Part

A SharePoint Framework (SPFx) web part that displays geotagged photos from a SharePoint document library on an interactive Leaflet map. Supports OpenStreetMap and ArcGIS-based basemaps, with clustered photo markers and a gallery popup.

---

## Features

- **Interactive Leaflet map** with clustered photo markers
- **Two map modes:**
  - General Map — OpenStreetMap tiles
  - Project Map — ArcGIS Web Map (with optional satellite imagery)
- **Photo clustering** — nearby images are grouped into a cluster icon showing a preview thumbnail and count badge
- **Gallery popup** — clicking a cluster opens a navigable photo gallery; clicking a single marker opens an individual photo preview
- **Click-to-open** — clicking any photo in a popup opens it in a new tab
- **ArcGIS feature layers** — renders operational layers from an ArcGIS Web Map including points, lines, and polygons with full ESRI renderer support (simple, unique value)
- **Configurable coordinate fields** — map images using latitude/longitude fields from the document library
- **Rate limiting** — built-in SharePoint API rate limiter (2,500 requests per 6-minute window)
- **Loading indicator** with progress messages
- **ViCon watermark** displayed on the map

---

## Prerequisites

- Node.js 22.x
- SharePoint Framework 1.21.x
- A SharePoint document library containing images with numeric latitude/longitude columns

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
gulp serve
```

This opens the SharePoint Workbench at the URL configured in `config/serve.json`.

### Build for production

```bash
gulp bundle --ship
gulp package-solution --ship
```

The packaged solution will be at `solution/webmap.sppkg`. Upload it to your SharePoint App Catalog to deploy.

---

## Configuration

Open the web part property pane to configure:

| Setting | Description |
|---|---|
| **Map Type** | `General Map` (OpenStreetMap) or `Project Map` (ArcGIS) |
| **ArcGIS Web Map URL** | Required when using Project Map. Format: `https://<org>.maps.arcgis.com/apps/mapviewer/index.html?webmap=<id>` |
| **Map View** | `Open Street Map` or `Satellite` (only applies to Project Map) |
| **Document Library** | SharePoint document library containing your images |
| **Location Method** | Currently only `Select latitude and longitude fields` is supported |
| **Latitude Field** | The library column containing decimal latitude values |
| **Longitude Field** | The library column containing decimal longitude values |

Click **Load** after configuring to render markers on the map.

---

## Supported ArcGIS URL Domains

For security, only the following ArcGIS domains are accepted:

- `maps.arcgis.com`
- `mapsdevext.arcgis.com`
- `maps.arcgis.de`
- `maps.arcgis.eu`

URLs must use HTTPS.

---

## Supported Image Formats

`.jpg`, `.jpeg`, `.png`

---

## Notes

- **EXIF-based GPS extraction** is implemented but currently disabled pending production readiness. The `ExifExtraction` service is available in `services/ExifExtraction.ts` for future use.
- **Caching** — a basic in-memory cache for library results exists in `cache/SPLibraryItems.ts` but is currently disabled due to a known issue with stale data. It is planned for a future release.
---