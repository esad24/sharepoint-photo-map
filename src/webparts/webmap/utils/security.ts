// Helpers – security                                         

/**
 * Escapes an identifier (like a list title or column name) for safe inclusion
 * in a SharePoint OData REST API URL. It first doubles any single quotes (' → '')
 * as required by the OData spec, and then URI-encodes the result to handle
 * spaces, slashes, and other special characters.
 */
export function escODataIdentifier(id: string): string { 
const doubled = id.replace(/'/g, "''");
return encodeURIComponent(doubled);
}

/**
 * A lightweight URL sanitizer to prevent Cross-Site Scripting (XSS) attacks.
 * It ensures that a URL string points to a valid 'http:' or 'https:' protocol.
 * It uses the browser's built-in URL parser for robustness.
 */
export function sanitizeUrl(url: string): string {
try {
    // The second argument provides a base URL for relative paths.
    const u = new URL(url, window.location.origin);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
} 
catch { return ''; }
}

/**
 * Escapes a string for safe use within an HTML attribute value. This prevents
 * an attacker from breaking out of an attribute and injecting malicious HTML or scripts.
 */
export function escAttr(v: string): string { 
return v.replace(/&/g,  '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;');
}


// Simple ArcGIS URL validator, just checks it's HTTPS and contains maps.arcgis.com
 
const ALLOWED_ARCGIS_DOMAINS: string[] = [
    'maps.arcgis.com',
    'mapsdevext.arcgis.com', 
    'maps.arcgis.de',
    'maps.arcgis.eu'
  ];
  
export function validateArcGISUrl(url: string): string | null {
    if (!url) return null;
    
    try {
      const parsedUrl = new URL(url.trim());
      
      // Must be HTTPS protocol
      if (parsedUrl.protocol !== 'https:') {
        return null;
      }
      
      const hostname = parsedUrl.hostname.toLowerCase();
      const isValidDomain = ALLOWED_ARCGIS_DOMAINS.some(domain => {
        return hostname === domain || hostname.endsWith('.' + domain);
      });
      
      if (isValidDomain) {
        return parsedUrl.href;
      }
    } catch {
      console.error('Invalid URL format');
    }
    return null;
  }