/* ========================================================================== */
/* ClusterIcon.ts                                                             */
/* - Generates HTML for cluster icons with image and count badge              */
/* ========================================================================== */

import { escAttr } from '../utils/Security';

export const createClusterIconHtml = (imageUrl: string, count: number): string => {
  const digits = String(count).length;
  const badgeH = 22
  const badgeW = digits === 1 ? 22 : 22 + (digits - 1) * 10;

  return `
    <div style="position:relative;width:60px;height:60px;display:inline-block;">
      <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;">
        <img src="${escAttr(imageUrl)}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="
        position:absolute;top:-8px;right:-8px;width:${badgeW}px;height:${badgeH}px;
        background:#007AFF;color:#fff;font:700 12px/1 'Segoe UI',sans-serif;
        padding:0 4px;border-radius:9999px;display:flex;align-items:center;
        justify-content:center;box-shadow:0 0 2px rgba(0,0,0,.25);">
        ${count}
      </div>
  </div>
  `;
};