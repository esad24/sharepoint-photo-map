/* ============================================================= */
/* Helpers – security                                           */
/* ============================================================= */

/**
 * Escapes an identifier (like a list title or column name) for safe inclusion
 * in a SharePoint OData REST API URL. It first doubles any single quotes (' → '')
 * as required by the OData spec, and then URI-encodes the result to handle
 * spaces, slashes, and other special characters.
 * @param id The identifier string to escape.
 * @returns A URL-safe, OData-safe identifier.
 */
export function escODataIdentifier(id: string): string { //  SECURITY
const doubled = id.replace(/'/g, "''");
return encodeURIComponent(doubled);
}

/**
 * A lightweight URL sanitizer to prevent Cross-Site Scripting (XSS) attacks.
 * It ensures that a URL string points to a valid 'http:' or 'https:' protocol.
 * It uses the browser's built-in URL parser for robustness.
 * @param url The URL string to sanitize.
 * @returns A safe URL or an empty string if the URL is invalid/unsafe.
 */
export function sanitizeUrl(url: string): string {
try {
    // The second argument provides a base URL for relative paths.
    const u = new URL(url, window.location.origin);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
} 
catch { return ''; } // Return empty string if URL parsing fails.
}

/**
 * Escapes a string for safe use within an HTML attribute value. This prevents
 * an attacker from breaking out of an attribute and injecting malicious HTML or scripts.
 * @param v The string value to escape.
 * @returns A sanitized string safe for HTML attributes.
 */
export function escAttr(v: string): string { // SECURITY
return v.replace(/&/g,  '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;');
}

/**
 * Simple ArcGIS URL validator - just checks it's HTTPS and contains maps.arcgis.com
 * @param url The ArcGIS URL to validate
 * @returns The sanitized URL or null if invalid
 */

/**
 * Allowed ArcGIS domains for security validation
 */
const ALLOWED_ARCGIS_DOMAINS: string[] = [
    'maps.arcgis.com',
    'mapsdevext.arcgis.com', 
    'maps.arcgis.de',
    'maps.arcgis.eu'
  ];
  
  /**
 * Simple ArcGIS URL validator - checks HTTPS and allowed domains
 * @param url The ArcGIS URL to validate
 * @returns The sanitized URL or null if invalid
 */
export function validateArcGISUrl(url: string): string | null {
    if (!url) return null;
    
    try {
      const parsedUrl = new URL(url.trim());
      
      // Must be HTTPS protocol
      if (parsedUrl.protocol !== 'https:') {
        return null;
      }
      
      // Check if hostname ends with any allowed domain (compatible with older JS)
      const hostname = parsedUrl.hostname.toLowerCase();
      const isValidDomain = ALLOWED_ARCGIS_DOMAINS.some(domain => {
        return hostname === domain || hostname.indexOf('.' + domain) === hostname.length - domain.length - 1;
      });
      
      if (isValidDomain) {
        return parsedUrl.href;
      }
    } catch {
      // Invalid URL format
    }
    
    return null;
  }