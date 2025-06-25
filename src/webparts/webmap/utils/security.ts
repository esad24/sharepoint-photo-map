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
