
export function extractWebmapId(url: string): string | null {
if (!url) return null; // Return null if no URL provided

// Pattern: https://{domain}.maps.arcgis.com/apps/mapviewer/index.html?webmap={webmap_id}
// This regex pattern matches the standard ArcGIS web map URL format
const urlPattern = /https?:\/\/[^\/]+\.maps\.arcgis\.com\/apps\/mapviewer\/index\.html\?webmap=([a-zA-Z0-9]+)/;
const match = url.match(urlPattern);

if (match && match[1]) {
    return match[1]; // Return the captured webmap ID
}

// Also check for webmap ID in other common ArcGIS URL formats
// Sometimes the URL might be formatted differently
const webmapPattern = /webmap=([a-zA-Z0-9]+)/;
const webmapMatch = url.match(webmapPattern);

if (webmapMatch && webmapMatch[1]) {
    return webmapMatch[1]; // Return the captured webmap ID
}

return null; // No valid webmap ID found
}

/**
 * Extract domain from ArcGIS URL
 */
export function extractArcGISDomain(url: string): string | null {
if (!url) return null; // Return null if no URL provided

// Pattern to extract the domain part (e.g., "hochtiefinfra" from "hochtiefinfra.maps.arcgis.com")
// This captures the subdomain before .maps.arcgis.com
const domainPattern = /https?:\/\/([^\/]+)\.maps\.arcgis\.com/;
const match = url.match(domainPattern);

if (match && match[1]) {
    return match[1]; // Return the captured domain
}

return null; // No valid domain found
}
