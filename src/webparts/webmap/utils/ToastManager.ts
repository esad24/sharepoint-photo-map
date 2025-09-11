import styles from '../WebmapWebPart.module.scss';

export class ToastManager {
  public static show(message: string, type: 'info' | 'error' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `${styles.toast} ${type === 'error' ? styles.toastError : ''}`;
    toast.textContent = message; 
    toast.style.animation = 'slideUp 0.3s ease-out';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentElement) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000); 
  }
}