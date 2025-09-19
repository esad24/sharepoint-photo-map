import  styles from '../WebmapWebPart.module.scss';

export function showLoader(loaderId: string): void {
    const loader = document.getElementById(loaderId);
    if (loader) {
    loader.style.display = 'flex';
    }
}
    
export function hideLoader(loaderId: string): void {
    const loader = document.getElementById(loaderId);
    if (loader) {
    loader.style.display = 'none';
    }
}

export function updateLoader(loaderId: string, message: string): void {
    const loader = document.getElementById(loaderId);
    if (loader) {
        const textElem = loader.querySelector(`.${styles.loaderText}`);
        if (textElem) {
            textElem.textContent = message;
        }
    }
}
