/* ========================================================================== */
/* ToastManager.ts                                                            */
/* - Utility for showing toast notifications                                  */
/* ========================================================================== */

import styles from '../WebmapWebPart.module.scss';

export class ToastManager {
  /**
   * Shows a toast notification
   */
  public static show(message: string, type: 'info' | 'error' = 'info'): void {
    // Create a new div element for the toast notification
    const toast = document.createElement('div');
    // Apply CSS classes - base toast class plus error class if type is 'error'
    toast.className = `${styles.toast} ${type === 'error' ? styles.toastError : ''}`;
    toast.textContent = message; // Set the message text
  
    // Add animation manually (optional, fallback for older browsers)
    // This makes the toast slide up from the bottom
    toast.style.animation = 'slideUp 0.3s ease-out';
  
    // Add the toast to the page body
    document.body.appendChild(toast);
  
    // Set up automatic removal after 3 seconds
    setTimeout(() => {
      // Animate sliding down before removal
      toast.style.animation = 'slideDown 0.3s ease-in';
      // Wait for animation to complete, then remove from DOM
      setTimeout(() => {
        if (toast.parentElement) {
          document.body.removeChild(toast);
        }
      }, 300); // 300ms matches the animation duration
    }, 3000); // Show for 3 seconds
  }
}