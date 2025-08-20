(()=>{ var __RUSHSTACK_CURRENT_SCRIPT__ = document.currentScript; define("55b7bc1d-e7a3-4bfd-b392-1fcb62ad93ca_0.0.1", ["@microsoft/sp-core-library","@microsoft/sp-webpart-base","leaflet","@microsoft/sp-property-pane","@microsoft/sp-http"], (__WEBPACK_EXTERNAL_MODULE__676__, __WEBPACK_EXTERNAL_MODULE__642__, __WEBPACK_EXTERNAL_MODULE__973__, __WEBPACK_EXTERNAL_MODULE__877__, __WEBPACK_EXTERNAL_MODULE__909__) => { return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 493:
/*!******************************************************!*\
  !*** ./lib/webparts/webmap/WebmapWebPart.module.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".webmap_67f2c4c9{color:\"[theme:bodyText, default: #323130]\";color:var(--bodyText);overflow:hidden;padding:1em}.webmap_67f2c4c9.teams_67f2c4c9{font-family:Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif}.welcome_67f2c4c9{text-align:center}.welcomeImage_67f2c4c9{max-width:420px;width:100%}.mapContainer_67f2c4c9{border-radius:20px;box-shadow:0 0 10px rgba(0,0,0,.2);height:600px;width:100%}.popupImg_67f2c4c9{border-radius:10px;max-height:300px;max-width:300px}.galleryContainer_67f2c4c9{align-items:center;display:flex;flex-direction:column;text-align:center;width:300px}.photoGalleryPopup_67f2c4c9 .leaflet-popup-content,.photoGalleryPopup_67f2c4c9 .leaflet-popup-content-wrapper{margin:0!important;padding:0!important}.leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.3)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:hsla(0,0%,100%,.15);border:1px solid hsla(0,0%,100%,.3)}.galleryNav_67f2c4c9{display:flex;gap:10px;justify-content:center;margin-top:8px}.galleryNavPrev_67f2c4c9:before{transform:rotate(135deg)}.galleryNavNext_67f2c4c9:before,.galleryNavPrev_67f2c4c9:before{border:solid #000;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px}.galleryNavNext_67f2c4c9:before{transform:rotate(-45deg)}.links_67f2c4c9 a{color:\"[theme:link, default:#03787c]\";color:var(--link);text-decoration:none}.links_67f2c4c9 a:hover{color:\"[theme:linkHovered, default: #014446]\";color:var(--linkHovered);text-decoration:underline}.toast_67f2c4c9{animation:slideUp_67f2c4c9 .3s ease-out;background-color:#1976d2;border-radius:4px;bottom:20px;box-shadow:0 2px 5px rgba(0,0,0,.2);color:#fff;font-family:Segoe UI,sans-serif;left:50%;padding:16px 24px;position:fixed;transform:translateX(-50%);z-index:9999}.toastError_67f2c4c9{background-color:#d32f2f}@keyframes slideUp_67f2c4c9{0%{opacity:0;transform:translateX(-50%) translateY(100%)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes slideDown_67f2c4c9{0%{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(100%)}}.textLabel_67f2c4c9{background:0 0;border:none;box-shadow:none;color:#fff;font-weight:400;padding:0;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvQkdMVXNlcjAxL0RvY3VtZW50cy9Gb3RvTWFwL3NoYXJlcG9pbnQtcGhvdG8tbWFwL3NyYy93ZWJwYXJ0cy93ZWJtYXAvV2VibWFwV2ViUGFydC5tb2R1bGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxpQkFHRSwwQ0FBQSxDQUNBLHFCQUFBLENBSEEsZUFBQSxDQUNBLFdBRUEsQ0FDQSxnQ0FDRSxzRkFBQSxDQUlKLGtCQUNFLGlCQUFBLENBR0YsdUJBRUUsZUFBQSxDQURBLFVBQ0EsQ0FHRix1QkFHRSxrQkFBQSxDQUNBLGtDQUFBLENBSEEsWUFBQSxDQUNBLFVBRUEsQ0FJRixtQkFHRSxrQkFBQSxDQURBLGdCQUFBLENBREEsZUFFQSxDQUlGLDJCQUlFLGtCQUFBLENBRkEsWUFBQSxDQUNBLHFCQUFBLENBRUEsaUJBQUEsQ0FKQSxXQUlBLENBTUUsOEdBRUUsa0JBQUEsQ0FDQSxtQkFBQSxDQU1OLCtCQUlFLGtCQUFBLENBRUEsb0NBQUEsQ0FHRixrREFQRSwwQkFBQSxDQUNBLGtDQUFBLENBRkEsOEJBQUEsQ0FJQSxtQ0FRQSxDQUtGLHFCQUVFLFlBQUEsQ0FFQSxRQUFBLENBREEsc0JBQUEsQ0FGQSxjQUdBLENBR0YsZ0NBTUUsd0JBQUEsQ0FHRixnRUFORSxpQkFBQSxDQUFBLHdCQUFBLENBRkEsVUFBQSxDQUdBLG9CQUFBLENBQ0EsV0FVQSxDQU5GLGdDQU1FLHdCQUFBLENBS0Esa0JBRUUscUNBQUEsQ0FDQSxpQkFBQSxDQUZBLG9CQUVBLENBRUEsd0JBRUUsNkNBQUEsQ0FDQSx3QkFBQSxDQUZBLHlCQUVBLENBTU4sZ0JBWUUsdUNBQUEsQ0FQQSx3QkFBQSxDQUdBLGlCQUFBLENBTkEsV0FBQSxDQU9BLG1DQUFBLENBSEEsVUFBQSxDQUtBLCtCQUFBLENBUkEsUUFBQSxDQUlBLGlCQUFBLENBTkEsY0FBQSxDQUdBLDBCQUFBLENBTUEsWUFFQSxDQUdGLHFCQUNFLHdCQUFBLENBR0YsNEJBQ0UsR0FFRSxTQUFBLENBREEsMkNBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSx3Q0FDQSxDQUFBLENBSUosOEJBQ0UsR0FFRSxTQUFBLENBREEsd0NBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSwyQ0FDQSxDQUFBLENBS0osb0JBQ0UsY0FBQSxDQUNBLFdBQUEsQ0FDQSxlQUFBLENBQ0EsVUFBQSxDQU1BLGVBQUEsQ0FDQSxTQUFBLENBTkEsMkVBTUEiLCJmaWxlIjoiV2VibWFwV2ViUGFydC5tb2R1bGUuY3NzIn0= */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  webmap_67f2c4c9: "webmap_67f2c4c9",
  teams_67f2c4c9: "teams_67f2c4c9",
  welcome_67f2c4c9: "welcome_67f2c4c9",
  welcomeImage_67f2c4c9: "welcomeImage_67f2c4c9",
  mapContainer_67f2c4c9: "mapContainer_67f2c4c9",
  popupImg_67f2c4c9: "popupImg_67f2c4c9",
  galleryContainer_67f2c4c9: "galleryContainer_67f2c4c9",
  photoGalleryPopup_67f2c4c9: "photoGalleryPopup_67f2c4c9",
  "leaflet-popup-content": "leaflet-popup-content",
  "leaflet-popup-content-wrapper": "leaflet-popup-content-wrapper",
  "leaflet-popup-tip": "leaflet-popup-tip",
  galleryNav_67f2c4c9: "galleryNav_67f2c4c9",
  galleryNavPrev_67f2c4c9: "galleryNavPrev_67f2c4c9",
  galleryNavNext_67f2c4c9: "galleryNavNext_67f2c4c9",
  links_67f2c4c9: "links_67f2c4c9",
  toast_67f2c4c9: "toast_67f2c4c9",
  slideUp_67f2c4c9: "slideUp_67f2c4c9",
  toastError_67f2c4c9: "toastError_67f2c4c9",
  textLabel_67f2c4c9: "textLabel_67f2c4c9",
  slideDown_67f2c4c9: "slideDown_67f2c4c9"
});


/***/ }),

/***/ 152:
/*!***************************************************************************!*\
  !*** ./node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 323);
// Imports


_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".marker-cluster-small{background-color:hsla(91,60%,72%,.6)}.marker-cluster-small div{background-color:rgba(110,204,57,.6)}.marker-cluster-medium{background-color:rgba(241,211,87,.6)}.marker-cluster-medium div{background-color:rgba(240,194,12,.6)}.marker-cluster-large{background-color:hsla(18,97%,72%,.6)}.marker-cluster-large div{background-color:rgba(241,128,23,.6)}.leaflet-oldie .marker-cluster-small{background-color:#b5e28c}.leaflet-oldie .marker-cluster-small div{background-color:#6ecc39}.leaflet-oldie .marker-cluster-medium{background-color:#f1d357}.leaflet-oldie .marker-cluster-medium div{background-color:#f0c20c}.leaflet-oldie .marker-cluster-large{background-color:#fd9c73}.leaflet-oldie .marker-cluster-large div{background-color:#f18017}.marker-cluster{background-clip:padding-box;border-radius:20px}.marker-cluster div{border-radius:15px;font:12px Helvetica Neue,Arial,Helvetica,sans-serif;height:30px;margin-left:5px;margin-top:5px;text-align:center;width:30px}.marker-cluster span{line-height:30px}", true);


/***/ }),

/***/ 897:
/*!*******************************************************************!*\
  !*** ./node_modules/leaflet.markercluster/dist/MarkerCluster.css ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 323);
// Imports


_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".leaflet-cluster-anim .leaflet-marker-icon,.leaflet-cluster-anim .leaflet-marker-shadow{transition:transform .3s ease-out,opacity .3s ease-in}.leaflet-cluster-spider-leg{transition:stroke-dashoffset .3s ease-out,stroke-opacity .3s ease-in}", true);


/***/ }),

/***/ 796:
/*!***********************************************!*\
  !*** ./node_modules/leaflet/dist/leaflet.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 323);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css-loader/dist/runtime/getUrl.js */ 780);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _images_layers_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/layers.png */ 601);
/* harmony import */ var _images_layers_2x_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./images/layers-2x.png */ 426);
/* harmony import */ var _images_marker_icon_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./images/marker-icon.png */ 927);
// Imports






var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_images_layers_png__WEBPACK_IMPORTED_MODULE_2__)
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_images_layers_2x_png__WEBPACK_IMPORTED_MODULE_3__)
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_images_marker_icon_png__WEBPACK_IMPORTED_MODULE_4__)
_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".leaflet-image-layer,.leaflet-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane,.leaflet-pane>canvas,.leaflet-pane>svg,.leaflet-tile,.leaflet-tile-container,.leaflet-zoom-box{left:0;position:absolute;top:0}.leaflet-container{overflow:hidden}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile{-webkit-user-drag:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{height:1600px;-webkit-transform-origin:0 0;width:1600px}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-height:none!important;max-width:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer{max-height:none!important;max-width:none!important;padding:0;width:auto}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{box-sizing:border-box;height:0;width:0;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{height:1px;width:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{pointer-events:visiblePainted;pointer-events:auto;position:relative;z-index:800}.leaflet-bottom,.leaflet-top{pointer-events:none;position:absolute;z-index:1000}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{clear:both;float:left}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-pan-anim .leaflet-tile,.leaflet-zoom-anim .leaflet-tile{transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-control,.leaflet-popup-pane{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:grabbing}.leaflet-image-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-image-layer.leaflet-interactive,.leaflet-marker-icon.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{background:hsla(0,0%,100%,.5);border:2px dotted #38f}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{border-radius:4px;box-shadow:0 1px 5px rgba(0,0,0,.65)}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;color:#000;display:block;height:26px;line-height:26px;text-align:center;text-decoration:none;width:26px}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:focus,.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom:none;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.leaflet-bar a.leaflet-disabled{background-color:#f4f4f4;color:#bbb;cursor:default}.leaflet-touch .leaflet-bar a{height:30px;line-height:30px;width:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{background:#fff;border-radius:5px;box-shadow:0 1px 5px rgba(0,0,0,.4)}.leaflet-control-layers-toggle{background-image:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");height:36px;width:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{height:44px;width:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{background:#fff;color:#333;padding:6px 10px 6px 6px}.leaflet-control-layers-scrollbar{overflow-x:hidden;overflow-y:scroll;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{border-top:1px solid #ddd;height:0;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ")}.leaflet-container .leaflet-control-attribution{background:#fff;background:hsla(0,0%,100%,.8);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{color:#333;line-height:1.4;padding:0 5px}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:focus,.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;height:.6669em;vertical-align:baseline!important;width:1em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{background:hsla(0,0%,100%,.8);border:2px solid #777;border-top:none;box-sizing:border-box;line-height:1.1;padding:2px 5px 1px;text-shadow:1px 1px #fff;white-space:nowrap}.leaflet-control-scale-line:not(:first-child){border-bottom:none;border-top:2px solid #777;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers{box-shadow:none}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-layers{background-clip:padding-box;border:2px solid rgba(0,0,0,.2)}.leaflet-popup{margin-bottom:20px;position:absolute;text-align:center}.leaflet-popup-content-wrapper{border-radius:12px;padding:1px;text-align:left}.leaflet-popup-content{font-size:13px;font-size:1.08333em;line-height:1.3;margin:13px 24px 13px 20px;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{height:20px;left:50%;margin-left:-20px;margin-top:-1px;overflow:hidden;pointer-events:none;position:absolute;width:40px}.leaflet-popup-tip{height:17px;margin:-10px auto 0;padding:1px;pointer-events:auto;transform:rotate(45deg);width:17px}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.4);color:#333}.leaflet-container a.leaflet-popup-close-button{background:transparent;border:none;color:#757575;font:16px/24px Tahoma,Verdana,sans-serif;height:24px;position:absolute;right:0;text-align:center;text-decoration:none;top:0;width:24px}.leaflet-container a.leaflet-popup-close-button:focus,.leaflet-container a.leaflet-popup-close-button:hover{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678,M12=0.70710678,M21=-0.70710678,M22=0.70710678);margin:0 auto;width:24px}.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{background-color:#fff;border:1px solid #fff;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.4);color:#222;padding:6px;pointer-events:none;position:absolute;-webkit-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before,.leaflet-tooltip-top:before{background:transparent;border:6px solid transparent;content:\"\";pointer-events:none;position:absolute}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{border-top-color:#fff;bottom:0;margin-bottom:-12px}.leaflet-tooltip-bottom:before{border-bottom-color:#fff;margin-left:-6px;margin-top:-12px;top:0}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{margin-top:-6px;top:50%}.leaflet-tooltip-left:before{border-left-color:#fff;margin-right:-12px;right:0}.leaflet-tooltip-right:before{border-right-color:#fff;left:0;margin-left:-12px}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}", true);


/***/ }),

/***/ 641:
/*!**********************************************************!*\
  !*** ./lib/webparts/webmap/WebmapWebPart.module.scss.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./WebmapWebPart.module.css */ 493);
const styles = {
    webmap: 'webmap_67f2c4c9',
    teams: 'teams_67f2c4c9',
    welcome: 'welcome_67f2c4c9',
    welcomeImage: 'welcomeImage_67f2c4c9',
    mapContainer: 'mapContainer_67f2c4c9',
    popupImg: 'popupImg_67f2c4c9',
    galleryContainer: 'galleryContainer_67f2c4c9',
    photoGalleryPopup: 'photoGalleryPopup_67f2c4c9',
    galleryNav: 'galleryNav_67f2c4c9',
    galleryNavPrev: 'galleryNavPrev_67f2c4c9',
    galleryNavNext: 'galleryNavNext_67f2c4c9',
    links: 'links_67f2c4c9',
    toast: 'toast_67f2c4c9',
    slideUp: 'slideUp_67f2c4c9',
    toastError: 'toastError_67f2c4c9',
    textLabel: 'textLabel_67f2c4c9',
    slideDown: 'slideDown_67f2c4c9'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 607:
/*!******************************************************!*\
  !*** ./lib/webparts/webmap/assets/ViconWatermark.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addWatermark: () => (/* binding */ addWatermark)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Add watermark to the map
 */
function addWatermark(map) {
    if (!map)
        return;
    // Create a custom Leaflet control for the watermark
    const WatermarkControl = leaflet__WEBPACK_IMPORTED_MODULE_0__.Control.extend({
        options: {
            position: 'bottomleft' // Position at bottom left corner
        },
        onAdd: function (map) {
            // Create the watermark container
            const container = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('div', 'leaflet-control-watermark');
            // Style the container
            container.style.cssText = `
        background: rgba(255, 255, 255, 0.7);
        padding: 8px 12px;
        border-radius: 5px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.2;
      `;
            // Add the title
            const title = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('div', '', container);
            title.innerHTML = '<strong style="font-size: 14px; color: #333;">Powered by ViCon</strong>';
            // Add the subtitle
            const subtitle = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('div', '', container);
            subtitle.innerHTML = '<span style="font-size: 12px; color: #666;">Build digitally first.</span>';
            // Prevent map interactions on the watermark
            leaflet__WEBPACK_IMPORTED_MODULE_0__.DomEvent.disableClickPropagation(container);
            leaflet__WEBPACK_IMPORTED_MODULE_0__.DomEvent.disableScrollPropagation(container);
            return container;
        }
    });
    // Add the watermark control to the map
    new WatermarkControl().addTo(map);
}


/***/ }),

/***/ 940:
/*!*******************************************************!*\
  !*** ./lib/webparts/webmap/components/ClusterIcon.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createClusterIconHtml: () => (/* binding */ createClusterIconHtml)
/* harmony export */ });
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Security */ 415);
/* ========================================================================== */
/* ClusterIcon.ts                                                             */
/* - Generates HTML for cluster icons with image and count badge              */
/* ========================================================================== */

const createClusterIconHtml = (imageUrl, count) => {
    const digits = String(count).length;
    const badgeH = 22;
    const badgeW = digits === 1 ? 22 : 22 + (digits - 1) * 10;
    return `
    <div style="position:relative;width:60px;height:60px;display:inline-block;">
      <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;">
        <img src="${(0,_utils_Security__WEBPACK_IMPORTED_MODULE_0__.escAttr)(imageUrl)}" style="width:100%;height:100%;object-fit:cover;" />
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


/***/ }),

/***/ 482:
/*!**********************************************************!*\
  !*** ./lib/webparts/webmap/components/ClusterManager.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClusterManager: () => (/* binding */ ClusterManager)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! leaflet.markercluster */ 528);
/* harmony import */ var leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var leaflet_markercluster_dist_MarkerCluster_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! leaflet.markercluster/dist/MarkerCluster.css */ 897);
/* harmony import */ var leaflet_markercluster_dist_MarkerCluster_Default_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! leaflet.markercluster/dist/MarkerCluster.Default.css */ 152);
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/Security */ 415);
/* harmony import */ var _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../WebmapWebPart.module.scss */ 641);
/* harmony import */ var _ClusterIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ClusterIcon */ 940);
/* ========================================================================== */
/* ClusterManager.ts                                                          */
/* - Manages marker clustering and popup interactions                         */
/* ========================================================================== */






 // Import the new CSS file
class ClusterManager {
    constructor(map) {
        this.map = map;
        this.initializeClusterLayer();
    }
    /**
     * Initialize the marker cluster group.
     * This groups nearby markers together to avoid cluttering the map
     */
    initializeClusterLayer() {
        this.markerCluster = leaflet__WEBPACK_IMPORTED_MODULE_0__.markerClusterGroup({
            // `iconCreateFunction` is a customization that defines how a cluster icon looks.
            // This function is called for each cluster to create its visual representation
            iconCreateFunction: (cluster) => {
                var _a;
                // Get the first marker in the cluster to use its image for the cluster icon.
                // This makes the cluster show a preview of what's inside
                const first = cluster.getAllChildMarkers()[0]; // Use the specific L.Marker type instead of 'any'.
                const img = (0,_utils_Security__WEBPACK_IMPORTED_MODULE_5__.sanitizeUrl)((_a = first === null || first === void 0 ? void 0 : first.options.data) === null || _a === void 0 ? void 0 : _a.img); // Safely get and sanitize the image URL
                const count = cluster.getChildCount(); // How many markers are in this cluster.
                const html = (0,_ClusterIcon__WEBPACK_IMPORTED_MODULE_6__.createClusterIconHtml)(img, count);
                // Return a Leaflet DivIcon with our custom HTML
                // className: '' prevents Leaflet from adding default styles
                // iconSize: [60, 60] tells Leaflet the size of our icon
                return leaflet__WEBPACK_IMPORTED_MODULE_0__.divIcon({ html, className: '', iconSize: [60, 60] });
            },
            zoomToBoundsOnClick: false, // Disable the default behavior of zooming in when a cluster is clicked.
            showCoverageOnHover: false // Don't show the coverage area of the cluster on hover (blue outline).
        });
        // Add the newly created cluster layer to the map.
        this.map.addLayer(this.markerCluster);
        // Set up gallery popup on cluster click
        this.setupClusterClickHandler();
    }
    /**
     * Gallery popup on cluster click
     * Since zoomToBoundsOnClick is false, we can define our own click behavior.
     * This creates a photo gallery popup when clicking on a cluster
     */
    setupClusterClickHandler() {
        if (!this.markerCluster)
            return;
        this.markerCluster.on('clusterclick', (e) => {
            const markers = e.layer.getAllChildMarkers(); // Get all individual markers within the clicked cluster
            if (!markers.length)
                return; // Exit if no markers (shouldn't happen but good to check)
            // Create a simple image gallery from all the images within the cluster.
            const imgList = markers.map(m => { var _a; return (0,_utils_Security__WEBPACK_IMPORTED_MODULE_5__.sanitizeUrl)((_a = m.options.data) === null || _a === void 0 ? void 0 : _a.img); }); // Extract and sanitize all image URLs
            let current = 0; // Index of the currently displayed image in the gallery.
            // Programmatically create the HTML elements for the gallery popup using Leaflet's DOM utilities.
            const container = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('div', _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].galleryContainer); // Main container with gallery styles
            // Create a wrapper link for the image
            // This allows users to click the image to open it full-size in a new tab
            const imgLink = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('a', '', container);
            imgLink.href = imgList[0]; // Set initial href to first image
            imgLink.target = '_blank'; // Open in new tab
            imgLink.rel = 'noopener noreferrer'; // Security best practice for external links
            imgLink.style.cursor = 'pointer'; // Show pointer cursor on hover
            // Create the actual image element inside the link
            const imgEl = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('img', _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].popupImg, imgLink);
            imgEl.src = imgList[0]; // Set initial image to first in list
            // Create navigation container for prev/next buttons
            const nav = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('div', _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].galleryNav, container);
            // Create previous button
            const prevBtn = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('button', '', nav);
            prevBtn.innerHTML = '';
            prevBtn.className = _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].galleryNavPrev;
            prevBtn.onclick = () => {
                // Move to previous image, wrapping around to end if at beginning
                current = (current - 1 + imgList.length) % imgList.length; // Cycle backwards.
                imgEl.src = imgList[current]; // Update displayed image
                imgLink.href = imgList[current]; // Update the link href
            };
            // Create next button
            const nextBtn = leaflet__WEBPACK_IMPORTED_MODULE_0__.DomUtil.create('button', '', nav);
            nextBtn.innerHTML = ''; // Right arrow character
            nextBtn.className = _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].galleryNavNext;
            nextBtn.onclick = () => {
                // Move to next image, wrapping around to beginning if at end
                current = (current + 1) % imgList.length; // Cycle forwards.
                imgEl.src = imgList[current]; // Update displayed image
                imgLink.href = imgList[current]; // Update the link href
            };
            // Create and open the Leaflet popup at the cluster's location, containing the gallery.
            leaflet__WEBPACK_IMPORTED_MODULE_0__.popup({
                className: 'photoGalleryPopup', // CSS class for styling
                maxWidth: 300 // Maximum width in pixels
            })
                .setLatLng(e.latlng) // Position at cluster location
                .setContent(container) // Set our gallery container as content
                .openOn(this.map); // Open on the map (! tells TypeScript map is defined)
        });
    }
    /**
     * Clear all markers from the cluster layer
     */
    clearMarkers() {
        var _a;
        (_a = this.markerCluster) === null || _a === void 0 ? void 0 : _a.clearLayers();
    }
    /**
     * Add a marker to the cluster layer
     */
    addMarker(lat, lon, item, imgUrl) {
        // Create a custom icon for the individual marker (not a cluster).
        // This shows the actual image as a small thumbnail on the map
        const icon = leaflet__WEBPACK_IMPORTED_MODULE_0__.divIcon({
            html: `<img src="${imgUrl}" style="width:40px;height:40px;border-radius:5px;" />`,
            className: '', // Empty className prevents Leaflet default styles
            iconSize: [40, 40] // Size of the icon in pixels
        });
        // Create the Leaflet marker with coordinates, the custom icon, and our enriched data payload.
        const marker = leaflet__WEBPACK_IMPORTED_MODULE_0__.marker([lat, lon], {
            icon, // Our custom image icon
            data: item // Attach the full SharePoint item data for later use
        });
        // Bind a simple popup to the individual marker, showing its image.
        // This appears when clicking on a single (non-clustered) marker
        marker.bindPopup(`
      <div>
        <a href="${imgUrl}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
          <img src="${imgUrl}" class="${_WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].popupImg}" />
        </a>
      </div>
    `);
        // Add the final marker to the cluster layer.
        // The cluster layer will automatically group it with nearby markers
        this.markerCluster.addLayer(marker);
        return marker;
    }
    getClusterGroup() {
        return this.markerCluster;
    }
    dispose() {
        var _a;
        (_a = this.markerCluster) === null || _a === void 0 ? void 0 : _a.clearLayers();
        this.markerCluster = undefined;
    }
}


/***/ }),

/***/ 230:
/*!******************************************************!*\
  !*** ./lib/webparts/webmap/components/MapManager.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapManager: () => (/* binding */ MapManager)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var leaflet_dist_leaflet_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! leaflet/dist/leaflet.css */ 796);
/* harmony import */ var _services_ArcGISMap_ArcGISMapMain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/ArcGISMap/ArcGISMapMain */ 185);
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Security */ 415);
/* harmony import */ var _assets_ViconWatermark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/ViconWatermark */ 607);
/* harmony import */ var _services_ArcGISMap_services_ArcGISUrlService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/ArcGISMap/services/ArcGISUrlService */ 57);
/* ========================================================================== */
/* MapManager.ts                                                              */
/* - Handles Leaflet map initialization and management                        */
/* - Manages map layers and base tiles                                        */
/* ========================================================================== */






const HOCHTIEF_DEFAULT_VIEW = {
    lat: 51.4239, // Hochtief headquarters latitude
    lon: 6.9985, // Hochtief headquarters longitude
    zoom: 15 // Default zoom level
};
const OPEN_STREET_MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png	'; // OpenStreetMap tile URL
class MapManager {
    constructor(mapId) {
        this.mapId = mapId;
    }
    /**
     * Initializes or refreshes the Leaflet map instance. This method handles
     * cleanup of old instances and setup of the map, layers, and events.
     */
    initializeMap(properties) {
        /* 1. Dispose previous instance (avoid "Map container is already initialized") */
        if (this.map) {
            this.map.remove(); // Clean up all map resources and event listeners
            this.map = undefined; // Clear the reference
        }
        /* 2. Create fresh map */
        // Initialize a new map on the 'map' div, setting an initial view (coordinates and zoom level).
        this.map = leaflet__WEBPACK_IMPORTED_MODULE_0__.map(this.mapId).setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom); // Default view over Hochtief location
        /* 3. Add base layer based on map type */
        if (properties.mapType === 'project' && properties.arcgisMapUrl) {
            const mapView = properties.mapView || 'openstreetmap'; // Default to OpenStreetMap if not set
            this.addArcGISLayer(properties.arcgisMapUrl, mapView); // Add ArcGIS layer if map type is 'project'
        }
        else {
            this.addOpenStreetMapLayer();
        }
        /* 4. Add watermark */
        (0,_assets_ViconWatermark__WEBPACK_IMPORTED_MODULE_3__.addWatermark)(this.map); // Add the ViCon watermark to the map
        return this.map;
    }
    // Add OpenStreetMap tile layer
    addOpenStreetMapLayer() {
        if (!this.map)
            return; // Safety check - exit if map doesn't exist
        leaflet__WEBPACK_IMPORTED_MODULE_0__.tileLayer(OPEN_STREET_MAP_TILE_URL, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors', // Legal attribution required by OSM
        }).addTo(this.map);
    }
    addArcGISLayer(arcgisMapUrl, mapView) {
        //  Validate the ArcGIS URL before using it
        const validatedUrl = (0,_utils_Security__WEBPACK_IMPORTED_MODULE_4__.validateArcGISUrl)(arcgisMapUrl);
        if (validatedUrl) {
            // Use your existing extraction methods (they're fine)
            const webmapId = (0,_services_ArcGISMap_services_ArcGISUrlService__WEBPACK_IMPORTED_MODULE_5__.extractWebmapId)(validatedUrl);
            const domain = (0,_services_ArcGISMap_services_ArcGISUrlService__WEBPACK_IMPORTED_MODULE_5__.extractArcGISDomain)(validatedUrl);
            if (webmapId && domain && this.map) {
                this.arcgisMap = new _services_ArcGISMap_ArcGISMapMain__WEBPACK_IMPORTED_MODULE_2__.ArcGISMapService(this.map);
                this.arcgisMap.addArcGISTileLayer(webmapId, domain, mapView);
            }
            else {
                console.error('Could not extract webmap ID or domain from ArcGIS URL');
                this.addOpenStreetMapLayer();
            }
        }
        else {
            console.error('Invalid ArcGIS map URL - must be HTTPS and from maps.arcgis.com');
            this.addOpenStreetMapLayer();
        }
    }
    // Add a method to set MapViewService on the ArcGIS service after creation
    setMapViewService(mapViewService) {
        if (this.arcgisMap) {
            this.arcgisMap.setMapViewService(mapViewService);
        }
    }
    getMap() {
        return this.map;
    }
    dispose() {
        var _a;
        // Completely remove the map instance and its event listeners.
        // The ?. operator safely calls remove() only if map exists
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.remove();
        this.map = undefined;
        this.arcgisMap = undefined;
    }
}


/***/ }),

/***/ 105:
/*!***************************************************************!*\
  !*** ./lib/webparts/webmap/components/PropertyPaneManager.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PropertyPaneManager: () => (/* binding */ PropertyPaneManager)
/* harmony export */ });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ 877);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/sp-http */ 909);
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Security */ 415);
/* ========================================================================== */
/* PropertyPaneManager.ts                                                     */
/* - Manages property pane configuration and dynamic field loading            */
/* ========================================================================== */



class PropertyPaneManager {
    constructor(context, properties) {
        this.context = context;
        this.properties = properties;
        this.cache = {
            libraries: [],
            fields: [],
            siteForLibraries: null,
            libraryForFields: null
        };
    }
    /**
     * Defines the configuration for the web part's property pane (the settings panel).
     */
    getConfiguration() {
        // Start with the base groups
        // Groups organize related settings together
        const groups = [
            {
                groupName: 'Map Configuration',
                groupFields: [
                    (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('mapType', {
                        label: 'Map Type',
                        options: [
                            { key: 'general', text: 'General Map - OpenStreetMap' },
                            { key: 'project', text: 'Project Map - ArcGIS Web Map' }
                        ],
                        selectedKey: this.properties.mapType || 'general' // Default to OSM if not set
                    })
                ]
            }
        ];
        // If ArcGIS is selected, show URL field
        // This demonstrates conditional property pane fields
        if (this.properties.mapType === 'project') {
            groups[0].groupFields.push((0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneTextField)('arcgisMapUrl', {
                label: 'ArcGIS Web Map URL',
                description: 'Enter the ArcGIS web map URL (e.g., https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx)',
                placeholder: 'https://domain.maps.arcgis.com/apps/mapviewer/index.html?webmap=xxxxx',
                value: this.properties.arcgisMapUrl
            }), (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('mapView', {
                label: 'Map View',
                options: [
                    { key: 'openstreetmap', text: 'OpenStreetMap' },
                    { key: 'satellite', text: 'Satellite' }
                ],
                selectedKey: this.properties.mapView || 'openstreetmap' // Default to OpenStreetMap
            }));
        }
        // Data source configuration group
        groups.push({
            groupName: 'Data Source Configuration',
            groupFields: [
                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('libraryName', {
                    label: 'Document Library',
                    options: this.cache.libraries, // Dynamically loaded list of libraries
                    disabled: !this.cache.libraries.length // Disable if no libraries loaded yet
                }),
                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('locationMethod', {
                    label: 'Location Method',
                    options: [
                        { key: 'exif', text: 'Extract from Image EXIF Data' },
                        { key: 'manual', text: 'Select latitude and longitude fields' }
                    ],
                    selectedKey: this.properties.locationMethod || 'exif' // Default to EXIF
                })
            ]
        });
        // If manual method is selected, show field selectors
        // Another example of conditional fields based on user selection
        if (this.properties.locationMethod === 'manual') {
            groups.push({
                groupName: 'Coordinate Fields',
                groupFields: [
                    (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('latField', {
                        label: 'Latitude Field',
                        options: this.cache.fields, // Dynamically loaded list of fields from selected library
                        disabled: !this.cache.fields.length // Disable if no fields loaded yet
                    }),
                    (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneDropdown)('lonField', {
                        label: 'Longitude Field',
                        options: this.cache.fields, // Same list of fields
                        disabled: !this.cache.fields.length
                    })
                ]
            });
        }
        return {
            pages: [
                {
                    header: { description: '' }, // No header description
                    groups: groups // All our configured groups
                }
            ]
        };
    }
    /**
     * Load available SharePoint document libraries
     */
    async loadLibraries() {
        const site = this.context.pageContext.web.absoluteUrl; // Get current site URL
        // Check if we need to fetch libraries (i.e., if the site context has changed).
        // This caching prevents unnecessary API calls
        if (site !== this.cache.siteForLibraries) {
            // Clear all cached options and selections.
            // This ensures we start fresh when the site changes
            this.cache.libraries = [];
            this.cache.fields = [];
            this.properties.libraryName = '';
            this.properties.latField = '';
            this.properties.lonField = '';
            this.cache.siteForLibraries = site; // Update the cache key.
            try {
                // Fetch all non-hidden document libraries from the current site.
                // BaseTemplate 101 = Document Library in SharePoint
                const librariesUrl = `${site}/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq 101`;
                const response = await this.context.spHttpClient.get(librariesUrl, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_1__.SPHttpClient.configurations.v1);
                const json = await response.json();
                // Map the API response to the format required by PropertyPaneDropdown.
                // Use the specific ISPList interface instead of 'any'.
                this.cache.libraries = json.value.map((l) => ({
                    key: l.Title, // Use title as both key and display text
                    text: l.Title
                }));
                // Refresh the property pane to show the newly loaded libraries.
                this.context.propertyPane.refresh();
            }
            catch (err) {
                console.error('Webmap → library enumeration failed:', err);
            }
        }
    }
    /**
     * Load fields for the selected library
     */
    async loadFields(libraryName) {
        // Only load fields if we're using manual method
        // EXIF method doesn't need field selection
        if (this.properties.locationMethod !== 'manual')
            return;
        if (libraryName !== this.cache.libraryForFields) {
            // Clear old field options and selections.
            this.cache.fields = [];
            this.properties.latField = '';
            this.properties.lonField = '';
            this.cache.libraryForFields = libraryName; // Update the cache key.
            try {
                const site = this.context.pageContext.web.absoluteUrl;
                // Fetch all non-hidden, non-readonly fields for the newly selected library.
                // escODataIdentifier ensures special characters in library name are properly encoded
                const fieldsUrl = `${site}/_api/web/lists/getByTitle('${(0,_utils_Security__WEBPACK_IMPORTED_MODULE_2__.escODataIdentifier)(libraryName)}')/fields` +
                    `?$filter=Hidden eq false and ReadOnlyField eq false`;
                const response = await this.context.spHttpClient.get(fieldsUrl, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_1__.SPHttpClient.configurations.v1);
                const json = await response.json();
                // Only show field types that are likely to contain the required data.
                // Text fields might contain coordinates as strings
                // Number fields would contain numeric lat/lon values
                // URL fields might contain location data in some custom implementations
                const okTypes = ['Text', 'Number', 'URL'];
                // FIX: Use the specific ISPField interface instead of 'any'.
                this.cache.fields = json.value
                    .filter((f) => okTypes.indexOf(f.TypeAsString) !== -1) // Filter to allowed types
                    .map((f) => ({
                    key: f.InternalName, // Use the internal name for API calls.
                    text: f.Title // Show the user-friendly display name.
                }));
                // Refresh the property pane to show the new field options.
                this.context.propertyPane.refresh();
            }
            catch (err) {
                console.error('Webmap → field enumeration failed:', err);
            }
        }
    }
    getCache() {
        return this.cache;
    }
    clearFieldCache() {
        this.cache.fields = [];
        this.cache.libraryForFields = null;
        this.properties.latField = '';
        this.properties.lonField = '';
    }
}


/***/ }),

/***/ 185:
/*!*****************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/ArcGISMapMain.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArcGISMapService: () => (/* binding */ ArcGISMapService)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_layers_FeatureLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/layers/FeatureLayer */ 510);
/* harmony import */ var _services_layers_MapServiceLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/layers/MapServiceLayer */ 347);
/* ========================================================================== */
/* ArcGISMapService.ts                                                        */
/* - Service class for handling ArcGIS map layers and operations             */
/* - Now accepts webmap ID as parameter instead of hardcoding                */
/* ========================================================================== */
/*
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT IS ARCGIS?
 * ═══════════════════════════════════════════════════════════════════════════
 * ArcGIS is a mapping platform by Esri that allows organizations to create,
 * manage, and share interactive maps and spatial data.
 *
 * KEY CONCEPTS:
 * ────────────────────────────────────────────────────────────────────────────
 * • Webmap    - A saved map configuration that includes layers, styling, and settings
 * • Layer     - A collection of geographic features (like roads, buildings, or boundaries)
 * • Feature   - An individual map element (like a specific road or building)
 * • Tile      - Small square images that make up the map background
 * • Service   - A web endpoint that provides map data or functionality
 */
// Import Leaflet library for map functionality
// Leaflet is a popular open-source JavaScript library for interactive maps

// Import modularized services


// Basemap tile URLs
const IMAGERY_TILE_URL = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const OPEN_STREET_MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
class ArcGISMapService {
    constructor(map) {
        this.map = map; // Store map reference for use in methods
        this.featureLayerService = new _services_layers_FeatureLayer__WEBPACK_IMPORTED_MODULE_1__.FeatureLayerService(map);
        this.mapServiceLayerService = new _services_layers_MapServiceLayer__WEBPACK_IMPORTED_MODULE_2__.MapServiceLayerService(map);
    }
    setMapViewService(mapViewService) {
        this.mapViewService = mapViewService;
        // Update the FeatureLayerService with the MapViewService
        this.featureLayerService = new _services_layers_FeatureLayer__WEBPACK_IMPORTED_MODULE_1__.FeatureLayerService(this.map, mapViewService);
    }
    /**
     * Add ArcGIS tile layer to the map
     *
     * ┌─────────────────────────────────────────────────────────────────────────┐
     * │ WHAT ARE TILES?                                                         │
     * │                                                                         │
     * │ Maps are made up of small square images called "tiles" (usually         │
     * │ 256x256 pixels). When you zoom or pan a map, your browser downloads     │
     * │ the specific tiles needed for that view.                                │
     * └─────────────────────────────────────────────────────────────────────────┘
     *
     * @param webmapId - The ArcGIS webmap ID extracted from the URL (unique identifier for a saved map)
     * @param domain   - The ArcGIS domain (e.g., 'hochtiefinfra' from 'hochtiefinfra.maps.arcgis.com')
     */
    addArcGISTileLayer(webmapId, domain, mapView) {
        // Safety check - ensure all required parameters exist
        if (!this.map || !webmapId || !domain || !mapView)
            return;
        try {
            // add ArcGIS basemap tiles
            if (mapView === 'satellite') {
                leaflet__WEBPACK_IMPORTED_MODULE_0__.tileLayer(IMAGERY_TILE_URL, {
                    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community',
                    maxZoom: 19, // Maximum zoom level supported by this tile service
                    id: 'imagery-tile' // Identifier for this layer (useful for debugging)
                }).addTo(this.map);
            }
            else {
                leaflet__WEBPACK_IMPORTED_MODULE_0__.tileLayer(OPEN_STREET_MAP_TILE_URL, {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors', // Legal attribution required by OSM
                    maxZoom: 19, // Maximum zoom level supported by this tile service
                    id: 'osm-tile' // Identifier for this layer (useful for debugging)
                }).addTo(this.map);
            }
        }
        catch (error) {
            console.error('Failed to add ArcGIS tile layer:', error);
        }
        // Add vector tile layer with proper styling
        // This adds the actual webmap content (roads, buildings, etc.) on top of the base imagery
        this.addArcGISVectorLayer(webmapId, domain);
    }
    /**
     * Add ArcGIS vector layer (webmap content)
     *
     * ┌─────────────────────────────────────────────────────────────────────────┐
     * │ WHAT IS A VECTOR LAYER?                                                 │
     * │                                                                         │
     * │ Unlike tiles (which are images), vector layers contain actual           │
     * │ geometric data:                                                         │
     * │ • Points   (like building locations)                                    │
     * │ • Lines    (like roads or pipelines)                                    │
     * │ • Polygons (like property boundaries or zones)                          │
     * │                                                                         │
     * │ This data can be styled, queried, and interacted with programmatically. │
     * └─────────────────────────────────────────────────────────────────────────┘
     *
     * @param webmapId - The ArcGIS webmap ID
     * @param domain   - The ArcGIS domain (e.g., 'hochtiefinfra')
     */
    addArcGISVectorLayer(webmapId, domain) {
        // Safety check for required parameters
        if (!this.map || !webmapId || !domain)
            return;
        // Construct the webmap URL using the provided domain
        // This URL returns JSON data describing the webmap configuration
        const webmapUrl = `https://${domain}.maps.arcgis.com/sharing/rest/content/items/${webmapId}/data?f=json`;
        console.log(`Fetching webmap from: ${webmapUrl}`);
        // Fetch webmap definition
        fetch(webmapUrl)
            .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON response
        })
            .then(webmapData => {
            // Validate that we received a valid object
            if (webmapData && typeof webmapData === 'object') {
                console.log('Webmap data:', webmapData);
                // Process operational layers from the webmap
                this.processOperationalLayers(webmapData);
            }
        })
            .catch(error => {
            // Handle errors gracefully - don't crash the entire application
            console.warn('Could not load webmap data:', error);
            console.warn(`Please check if the domain '${domain}' and webmap ID '${webmapId}' are correct.`);
        });
    }
    /**
     * Process operational layers from webmap data
     */
    processOperationalLayers(webmapData) {
        if (!webmapData.operationalLayers || !Array.isArray(webmapData.operationalLayers)) {
            return;
        }
        // Loop through each layer defined in the webmap
        webmapData.operationalLayers.forEach((layer) => {
            console.log('Processing layer:', layer.title, layer.layerType);
            // Handle Group Layers (like BR_Leverkusen_01)
            if (layer && layer.layerType === 'GroupLayer' && layer.layers && Array.isArray(layer.layers)) {
                this.processGroupLayer(layer);
            }
            // Handle direct ArcGIS Feature Layers
            else if (layer && layer.layerType === 'ArcGISFeatureLayer' && layer.url) {
                this.featureLayerService.addArcGISFeatureLayer(layer);
            }
            // Handle direct ArcGIS Map Service Layers
            else if (layer && layer.layerType === 'ArcGISMapServiceLayer' && layer.url) {
                this.mapServiceLayerService.addArcGISMapServiceLayer(layer);
            }
        });
    }
    /**
     * Process group layers and their sublayers
     */
    processGroupLayer(layer) {
        console.log(`Found Group Layer: ${layer.title} with ${layer.layers.length} sublayers`);
        // Process each sublayer within the group
        layer.layers.forEach((sublayer) => {
            console.log('Processing sublayer:', sublayer.title, sublayer.layerType, sublayer.url);
            // Feature layers contain vector data (points, lines, polygons)
            // These are individual geographic features that can be styled and queried
            if (sublayer && sublayer.layerType === 'ArcGISFeatureLayer' && sublayer.url) {
                // Remove the visibility check - load all layers
                // This ensures all layers are loaded regardless of their default visibility
                // (Users can turn layers on/off later if needed)
                this.featureLayerService.addArcGISFeatureLayer(sublayer);
            }
        });
    }
}


/***/ }),

/***/ 57:
/*!*****************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/ArcGISUrlService.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractArcGISDomain: () => (/* binding */ extractArcGISDomain),
/* harmony export */   extractWebmapId: () => (/* binding */ extractWebmapId)
/* harmony export */ });
function extractWebmapId(url) {
    if (!url)
        return null; // Return null if no URL provided
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
function extractArcGISDomain(url) {
    if (!url)
        return null; // Return null if no URL provided
    // Pattern to extract the domain part (e.g., "hochtiefinfra" from "hochtiefinfra.maps.arcgis.com")
    // This captures the subdomain before .maps.arcgis.com
    const domainPattern = /https?:\/\/([^\/]+)\.maps\.arcgis\.com/;
    const match = url.match(domainPattern);
    if (match && match[1]) {
        return match[1]; // Return the captured domain
    }
    return null; // No valid domain found
}


/***/ }),

/***/ 510:
/*!********************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/layers/FeatureLayer.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeatureLayerService: () => (/* binding */ FeatureLayerService)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! leaflet.markercluster */ 528);
/* harmony import */ var leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(leaflet_markercluster__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styling_StyleService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styling/StyleService */ 707);
/* harmony import */ var _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../WebmapWebPart.module.scss */ 641);
/* ========================================================================== */
/* services/FeatureLayerService.ts                                            */
/* - Service for handling ArcGIS feature layer operations                     */
/* ========================================================================== */




class FeatureLayerService {
    constructor(map, mapViewService) {
        this.map = map;
        this.styleService = new _styling_StyleService__WEBPACK_IMPORTED_MODULE_3__.StyleService();
        this.mapViewService = mapViewService;
    }
    /**
     * Add an ArcGIS Feature Layer with proper styling (Optimized for performance)
     *
     * ┌─────────────────────────────────────────────────────────────────────────┐
     * │ WHAT IS A FEATURE LAYER?                                                │
     * │                                                                         │
     * │ A feature layer contains individual geographic features (vector data):  │
     * │ • Each road segment, building outline, or property boundary is a        │
     * │   separate "feature"                                                    │
     * │ • Features have both geometry (shape/location) and attributes           │
     * │   (properties/data)                                                     │
     * │ • Example: A building feature might have geometry (rectangle outline)   │
     * │   and attributes (address, owner, year built, etc.)                     │
     * │                                                                         │
     * │ PERFORMANCE CONSIDERATIONS:                                             │
     * │ Feature layers can contain thousands of individual features. Loading    │
     * │ and rendering all of them can be slow, so this method includes several  │
     * │ optimizations.                                                          │
     * └─────────────────────────────────────────────────────────────────────────┘
     */
    async addArcGISFeatureLayer(layerConfig) {
        // Safety checks - make sure we have everything we need
        if (!this.map || !layerConfig || !layerConfig.url)
            return;
        const featureServiceUrl = layerConfig.url;
        console.log(`Loading feature layer: ${layerConfig.title} from ${featureServiceUrl}`);
        try {
            // First, get the layer info to understand the data structure
            const layerInfo = await this.getFeatureLayerInfo(featureServiceUrl);
            if (!layerInfo)
                return;
            // Get the maximum record count from layer info
            const maxRecordCount = layerInfo.maxRecordCount || 1000;
            // Get drawing info for styling
            const drawingInfo = layerInfo.drawingInfo || await this.getLayerDrawingInfo(featureServiceUrl);
            // Query all features - handle pagination if needed
            const allFeatures = await this.queryAllFeatures(featureServiceUrl, maxRecordCount);
            if (allFeatures.length > 0) {
                // Create and add the complete GeoJSON layer
                const geoJsonLayer = this.createAndAddGeoJSONLayer(allFeatures, layerConfig, drawingInfo);
                // Automatically zoom to show all features
                this.getBounds(geoJsonLayer);
            }
        }
        catch (error) {
            // Log errors but don't crash the entire map
            // This ensures that if one layer fails, other layers can still load
            console.error(`Failed to load feature layer ${layerConfig.title || 'Unknown'}:`, error);
        }
    }
    /**
     * Get layer styling information from ArcGIS service
     */
    async getLayerDrawingInfo(serviceUrl) {
        try {
            // Ensure we're getting the correct layer info URL
            const url = String(serviceUrl);
            // Add JSON format parameter to the URL (?f=json tells ArcGIS to return JSON data)
            const layerInfoUrl = url.indexOf('?') !== -1 ? `${url}&f=json` : `${url}?f=json`;
            console.log('Fetching layer info from:', layerInfoUrl);
            // Fetch layer metadata (information about the layer)
            const response = await fetch(layerInfoUrl);
            if (!response.ok) {
                console.warn(`Failed to fetch layer info: ${response.status}`);
                return null;
            }
            // Parse JSON response
            const layerInfo = await response.json();
            console.log('Layer info:', layerInfo);
            // Return drawing info if available, otherwise null
            return layerInfo.drawingInfo || null;
        }
        catch (error) {
            console.error('Failed to get layer drawing info:', error);
            return null;
        }
    }
    /**
     * Get feature layer information from ArcGIS service
     */
    async getFeatureLayerInfo(featureServiceUrl) {
        const layerInfoUrl = `${featureServiceUrl}?f=json`;
        const infoResponse = await fetch(layerInfoUrl);
        return await infoResponse.json();
    }
    /**
     * Query all features with pagination support
     */
    async queryAllFeatures(featureServiceUrl, maxRecordCount) {
        let allFeatures = []; // Array to store all fetched features across multiple pages
        let resultOffset = 0; // Starting position for the current request (initially 0)
        let hasMore = true; // Boolean flag to control the pagination loop
        while (hasMore) {
            // Create query parameters for the current request
            const queryParams = new URLSearchParams({
                'where': '1=1', // SQL-like query: "1=1" means "select all features" (always true condition)
                'outFields': '*', // Limit returned fields to only what's needed for styling (performance optimization)
                'f': 'geojson', // Response format: GeoJSON (standardized geographic data format)
                'outSR': '4326', // Output spatial reference: WGS 84 (standard latitude/longitude coordinate system)
                'returnGeometry': 'true', // Include the shape/location data of features (not just attributes)
                'resultOffset': resultOffset.toString(), // Tell the server where to start returning records from
                'resultRecordCount': maxRecordCount.toString(), // Maximum number of records to return in this request
                'geometryPrecision': '6' // Limit coordinate decimal places (reduces file size and improves performance)
            });
            // Construct the full query URL with all parameters
            const queryUrl = `${featureServiceUrl}/query?${queryParams.toString()}`;
            // Send the HTTP GET request to the ArcGIS Feature Service
            const response = await fetch(queryUrl);
            if (!response.ok) {
                // If the request fails, throw an error with the HTTP status code
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the response as JSON (GeoJSON format)
            const geojsonData = await response.json();
            // Check if the response has features and add them to our collection
            if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
                // Add current batch of features to the master list
                allFeatures = allFeatures.concat(geojsonData.features);
                // Update the offset for the next request (move to the next "page")
                resultOffset += geojsonData.features.length;
                // If we received a full batch (max count), assume there may be more features to load
                // If we got fewer than the maximum, we've probably reached the end
                hasMore = geojsonData.features.length === maxRecordCount;
            }
            else {
                // If no features returned, we've reached the end
                hasMore = false;
            }
        }
        console.log(`Total features fetched: ${allFeatures.length}`);
        return allFeatures;
    }
    /**
     * Create and add GeoJSON layer to the map with proper styling
     */
    createAndAddGeoJSONLayer(allFeatures, layerConfig, drawingInfo) {
        // Create the complete GeoJSON object
        // GeoJSON is a standard format for representing geographic features
        // It wraps all features in a "FeatureCollection" structure
        const completeGeoJSON = {
            type: 'FeatureCollection',
            features: allFeatures
        };
        // Create style function based on drawing info
        const styleFunction = this.styleService.createStyleFunction(drawingInfo);
        // CREATE MARKER CLUSTER GROUP FOR TEXT LABELS
        const textClusterGroup = leaflet__WEBPACK_IMPORTED_MODULE_0__.markerClusterGroup({
            maxClusterRadius: 25, // Distance to cluster (pixels)
            disableClusteringAtZoom: 19, // Stop clustering at high zoom
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            iconCreateFunction: function (cluster) {
                // Get the first marker's text from the cluster
                const firstMarker = cluster.getAllChildMarkers()[0];
                const textContent = firstMarker.options.icon.options.html;
                return leaflet__WEBPACK_IMPORTED_MODULE_0__.divIcon({
                    html: textContent,
                    className: _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].textLabel,
                    iconSize: [100, 20]
                });
            }
        });
        // Create a GeoJSON layer optimized for performance
        const geoJsonLayer = leaflet__WEBPACK_IMPORTED_MODULE_0__.geoJSON(completeGeoJSON, {
            // Style function for lines and polygons
            // This function is called for each feature to determine its appearance
            style: (feature) => {
                const style = styleFunction(feature);
                // Ensure polygon visibility
                // Special handling for polygon layers to make sure they're visible
                if (layerConfig.title && layerConfig.title.includes('Polys')) {
                    style.fillOpacity = style.fillOpacity || 0.6; // Make sure polygons have some transparency
                    style.weight = style.weight || 1; // Keep border lines thin for performance
                }
                return style;
            },
            // Function to create markers for point features
            // Instead of default markers (which can be slow), use simple circles
            pointToLayer: (feature, latlng) => {
                const style = styleFunction(feature);
                // Use circle markers instead of default markers for better performance
                return leaflet__WEBPACK_IMPORTED_MODULE_0__.circleMarker(latlng, Object.assign(Object.assign({}, style), { radius: style.radius || 5 // Provide a default radius if undefined
                 }));
            },
            // Add text labels for each feature
            onEachFeature: (feature, layer) => {
                var _a;
                const textValue = (_a = feature.properties) === null || _a === void 0 ? void 0 : _a.Text;
                if (textValue && textValue.trim()) {
                    // GET POSITION FROM FEATURE GEOMETRY DIRECTLY
                    let position;
                    if (feature.geometry.type === 'Point') {
                        const coords = feature.geometry.coordinates;
                        position = leaflet__WEBPACK_IMPORTED_MODULE_0__.latLng(coords[1], coords[0]);
                    }
                    else {
                        // For polygons/lines, use the centroid from the layer
                        position = layer.getBounds().getCenter();
                    }
                    // CREATE TEXT MARKER FOR CLUSTERING
                    const textMarker = leaflet__WEBPACK_IMPORTED_MODULE_0__.marker(position, {
                        icon: leaflet__WEBPACK_IMPORTED_MODULE_0__.divIcon({
                            html: textValue,
                            className: _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].textLabel,
                            iconSize: [100, 20]
                        })
                    });
                    // ADD TO CLUSTER GROUP INSTEAD OF TOOLTIP
                    textClusterGroup.addLayer(textMarker);
                }
            },
            // Disable all interactivity for better performance
            interactive: false,
            bubblingMouseEvents: false
        });
        // Add the layer to the map
        geoJsonLayer.addTo(this.map);
        textClusterGroup.addTo(this.map); // ADD CLUSTER GROUP TO MAP
        console.log(`Successfully added feature layer: ${layerConfig.title} with ${allFeatures.length} features`);
        return geoJsonLayer;
    }
    getBounds(geoJsonLayer) {
        try {
            const bounds = geoJsonLayer.getBounds();
            // Extract corner coordinates for MapViewService
            if (bounds.isValid() && this.mapViewService) {
                const boundsArray = [
                    bounds.getSouthWest(),
                    bounds.getNorthEast(),
                    bounds.getNorthWest(),
                    bounds.getSouthEast()
                ];
                this.mapViewService.setFeatureBounds(boundsArray);
            }
        }
        catch (error) {
            console.error('Error fitting map to features:', error);
        }
    }
}


/***/ }),

/***/ 347:
/*!***********************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/layers/MapServiceLayer.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapServiceLayerService: () => (/* binding */ MapServiceLayerService)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* ========================================================================== */
/* services/MapServiceLayerService.ts                                         */
/* - Service for handling ArcGIS map service layer operations                 */
/* ========================================================================== */

class MapServiceLayerService {
    constructor(map) {
        this.map = map;
    }
    /**
     * Add an ArcGIS Map Service Layer
     *
     * ┌─────────────────────────────────────────────────────────────────────────┐
     * │ WHAT IS A MAP SERVICE LAYER?                                            │
     * │                                                                         │
     * │ Unlike feature layers (which send individual features), map service     │
     * │ layers provide pre-rendered images (tiles) of the map data. This is     │
     * │ like the difference between:                                            │
     * │ • Feature Layer: Sending you the blueprints to draw a house             │
     * │ • Map Service:   Sending you a photograph of the house                  │
     * │                                                                         │
     * │ WHEN TO USE MAP SERVICES:                                               │
     * │ • When you have complex data that would be slow to render as            │
     * │   individual features                                                   │
     * │ • When you don't need to interact with individual features              │
     * │ • When you want consistent styling that matches the original ArcGIS     │
     * │   map                                                                   │
     * └─────────────────────────────────────────────────────────────────────────┘
     */
    addArcGISMapServiceLayer(layerConfig) {
        // Safety checks
        if (!this.map || !layerConfig)
            return;
        const baseUrl = layerConfig.url;
        if (!baseUrl)
            return;
        console.log(`Adding map service layer: ${layerConfig.title} from ${baseUrl}`);
        // For each sublayer, add as a tile layer
        // Map services can contain multiple sublayers (like separate layers for roads, labels, boundaries)
        if (layerConfig.layers && Array.isArray(layerConfig.layers)) {
            this.addMapServiceSublayers(layerConfig, baseUrl);
        }
        else {
            // If no sublayers defined, try to add the entire service as one tile layer
            this.addSingleMapServiceLayer(layerConfig, baseUrl);
        }
    }
    /**
     * Add sublayers from a map service
     */
    addMapServiceSublayers(layerConfig, baseUrl) {
        layerConfig.layers.forEach((sublayer) => {
            // Only add sublayers that are visible by default and have a valid ID
            if (sublayer && sublayer.defaultVisibility && typeof sublayer.id !== 'undefined') {
                // Construct tile URL pattern for this specific sublayer
                // The server will generate tiles on-demand for this sublayer
                // {z}/{y}/{x} will be replaced by Leaflet with actual tile coordinates
                const tileUrl = `${baseUrl}/${sublayer.id}/tile/{z}/{y}/{x}`;
                // Create and add tile layer to the map
                leaflet__WEBPACK_IMPORTED_MODULE_0__.tileLayer(tileUrl, {
                    opacity: layerConfig.opacity || 1, // Layer transparency (0 = invisible, 1 = fully opaque)
                    attribution: 'ArcGIS Map Service' // Credit text shown in map corner
                }).addTo(this.map);
                console.log(`Added sublayer ${sublayer.id} as tile layer`);
            }
        });
    }
    /**
     * Add a single map service layer (no sublayers)
     */
    addSingleMapServiceLayer(layerConfig, baseUrl) {
        // Some map services are simple and don't have multiple sublayers
        const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`;
        leaflet__WEBPACK_IMPORTED_MODULE_0__.tileLayer(tileUrl, {
            opacity: layerConfig.opacity || 1,
            attribution: 'ArcGIS Map Service'
        }).addTo(this.map);
        console.log(`Added map service as tile layer: ${layerConfig.title}`);
    }
}


/***/ }),

/***/ 486:
/*!***********************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/styling/ColorConverter.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   esriColorToCSS: () => (/* binding */ esriColorToCSS)
/* harmony export */ });
/* ========================================================================== */
/* utils/ColorConverter.ts                                                    */
/* - Utilities for converting between ESRI and CSS color formats              */
/* ========================================================================== */
/**
 * @param esriColor - Array of [Red, Green, Blue, Alpha] values (0-255 each)
 * @returns CSS color string
 */
function esriColorToCSS(esriColor) {
    // Default to blue if color is invalid
    if (!esriColor || esriColor.length < 3)
        return '#3388ff';
    // Destructure color components, default alpha to 255 (fully opaque)
    const [r, g, b, a = 255] = esriColor;
    // Use rgba if transparency is specified
    if (a < 255) {
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`; // Convert alpha from 0-255 to 0-1 scale
    }
    // Use rgb for fully opaque colors (slightly more efficient)
    return `rgb(${r}, ${g}, ${b})`;
}


/***/ }),

/***/ 707:
/*!*********************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/styling/StyleService.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyleService: () => (/* binding */ StyleService)
/* harmony export */ });
/* harmony import */ var _SymbolConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SymbolConverter */ 879);
/* ========================================================================== */
/* services/StyleService.ts                                                   */
/* - Service for creating style functions and handling renderers              */
/* ========================================================================== */

class StyleService {
    constructor() {
        this.symbolConverter = new _SymbolConverter__WEBPACK_IMPORTED_MODULE_0__.SymbolConverter();
    }
    /**
     * Create style function for GeoJSON layer based on ArcGIS renderer
     */
    createStyleFunction(drawingInfo) {
        // Return a function that takes a feature and returns its style
        return (feature) => {
            // Default style if no drawing info is available
            // This ensures features are visible even if styling fails
            const defaultStyle = {
                color: '#3388ff', // Line/border color (blue)
                weight: 2, // Line width in pixels
                opacity: 0.8, // Line opacity (0 = invisible, 1 = fully opaque)
                fillOpacity: 0.4, // Fill opacity for polygons
                fillColor: '#3388ff' // Fill color for polygons
            };
            // Return default if no drawing info
            if (!drawingInfo || !drawingInfo.renderer) {
                return defaultStyle;
            }
            const renderer = drawingInfo.renderer;
            // Handle unique value renderer (most common for categorical data)
            if (renderer.type === 'uniqueValue') {
                return this.handleUniqueValueRenderer(renderer, feature, defaultStyle);
            }
            // Handle simple renderer
            if (renderer.type === 'simple' && renderer.symbol) {
                return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.symbol);
            }
            return defaultStyle; // Fallback to default style if nothing else works
        };
    }
    /**
     * Handle unique value renderer styling
     */
    handleUniqueValueRenderer(renderer, feature, defaultStyle) {
        var _a;
        // Get the value of the field used for rendering (e.g., "highway", "local_road")
        const fieldValue = feature.properties[renderer.field1];
        // Find matching unique value info
        // Look for a styling rule that matches this feature's field value
        const matchingInfo = (_a = renderer.uniqueValueInfos) === null || _a === void 0 ? void 0 : _a.find((info) => info.value === fieldValue || info.value === String(fieldValue) // Check both exact and string match
        );
        // If found, convert the ESRI symbol to Leaflet style
        if (matchingInfo && matchingInfo.symbol) {
            return this.symbolConverter.convertEsriSymbolToLeafletStyle(matchingInfo.symbol);
        }
        // Use default symbol if no specific match found
        if (renderer.defaultSymbol) {
            return this.symbolConverter.convertEsriSymbolToLeafletStyle(renderer.defaultSymbol);
        }
        return defaultStyle;
    }
}


/***/ }),

/***/ 879:
/*!************************************************************************************!*\
  !*** ./lib/webparts/webmap/services/ArcGISMap/services/styling/SymbolConverter.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SymbolConverter: () => (/* binding */ SymbolConverter)
/* harmony export */ });
/* harmony import */ var _ColorConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorConverter */ 486);
/* ========================================================================== */
/* services/SymbolConverter.ts                                                */
/* - Service for converting ESRI symbols to Leaflet styles                    */
/* ========================================================================== */

class SymbolConverter {
    /**
     * Convert ESRI symbol to Leaflet style
     */
    convertEsriSymbolToLeafletStyle(symbol) {
        const style = {}; // Initialize empty style object
        // Handle Simple Line Symbol (for roads, boundaries, etc.)
        if (symbol.type === 'esriSLS') {
            this.convertLineSymbol(symbol, style);
        }
        // Handle Simple Fill Symbol (for areas like buildings, zones, etc.)
        else if (symbol.type === 'esriSFS') {
            this.convertFillSymbol(symbol, style);
        }
        // Handle Simple Marker Symbol (for point locations like buildings, landmarks, etc.)
        else if (symbol.type === 'esriSMS') {
            this.convertMarkerSymbol(symbol, style);
        }
        return style; // Return the converted style object for Leaflet to use
    }
    /**
     * Convert ESRI Simple Line Symbol to Leaflet style
     *
     * @param symbol - ESRI Simple Line Symbol (esriSLS)
     * @param style  - Style object to populate
     */
    convertLineSymbol(symbol, style) {
        style.color = (0,_ColorConverter__WEBPACK_IMPORTED_MODULE_0__.esriColorToCSS)(symbol.color); // Convert color format
        style.weight = symbol.width || 2; // Line width in pixels, default to 2
        // Calculate opacity from alpha channel if present
        style.opacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
        // Handle line style patterns (solid, dashed, dotted, etc.)
        if (symbol.style === 'esriSLSDash') {
            style.dashArray = '5,5'; // 5 pixels line, 5 pixels gap, repeat
        }
        else if (symbol.style === 'esriSLSDot') {
            style.dashArray = '2,2'; // 2 pixels dot, 2 pixels gap, repeat
        }
        else if (symbol.style === 'esriSLSDashDot') {
            style.dashArray = '5,2,2,2'; // Dash-dot-dash-dot pattern
        }
    }
    /**
     * Convert ESRI Simple Fill Symbol to Leaflet style
     *
     * @param symbol - ESRI Simple Fill Symbol (esriSFS)
     * @param style  - Style object to populate
     */
    convertFillSymbol(symbol, style) {
        style.fillColor = (0,_ColorConverter__WEBPACK_IMPORTED_MODULE_0__.esriColorToCSS)(symbol.color); // Interior color of the polygon
        // Calculate fill opacity from alpha channel
        style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 0.6;
        // Handle outline (border) of polygon
        if (symbol.outline) {
            style.color = (0,_ColorConverter__WEBPACK_IMPORTED_MODULE_0__.esriColorToCSS)(symbol.outline.color); // Border color
            style.weight = symbol.outline.width || 1; // Border width in pixels
            // Calculate border opacity
            style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ?
                symbol.outline.color[3] / 255 : 1;
        }
    }
    /**
     * Convert ESRI Simple Marker Symbol to Leaflet style
     *
     * @param symbol - ESRI Simple Marker Symbol (esriSMS)
     * @param style  - Style object to populate
     */
    convertMarkerSymbol(symbol, style) {
        style.radius = symbol.size || 6; // Circle radius in pixels
        style.fillColor = (0,_ColorConverter__WEBPACK_IMPORTED_MODULE_0__.esriColorToCSS)(symbol.color); // Fill color of the circle
        // Calculate fill opacity
        style.fillOpacity = symbol.color && symbol.color.length > 3 ? symbol.color[3] / 255 : 1;
        // Handle outline (border) of point marker
        if (symbol.outline) {
            style.color = (0,_ColorConverter__WEBPACK_IMPORTED_MODULE_0__.esriColorToCSS)(symbol.outline.color); // Border color
            style.weight = symbol.outline.width || 1; // Border width
            // Calculate border opacity
            style.opacity = symbol.outline.color && symbol.outline.color.length > 3 ?
                symbol.outline.color[3] / 255 : 1;
        }
    }
}


/***/ }),

/***/ 320:
/*!*****************************************************!*\
  !*** ./lib/webparts/webmap/services/DataService.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataService: () => (/* binding */ DataService)
/* harmony export */ });
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-http */ 909);
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var exif_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! exif-js */ 222);
/* harmony import */ var exif_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(exif_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Security */ 415);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_2__);
/* ========================================================================== */
/* DataService.ts                                                             */
/* - Service for fetching data from SharePoint document libraries             */
/* - Handles both manual coordinate and EXIF-based location extraction        */
/* ========================================================================== */
// Import necessary SharePoint and web part libraries

// EXIF-js library for reading GPS data from image metadata

// Security utilities for safely handling user input and URLs


const bounds = [];
/**
 * Service class for handling all data fetching operations
 */
class DataService {
    constructor(context, mapViewService) {
        this.context = context; // Store context for later use
        this.mapViewService = mapViewService;
    }
    /**
     * Main method to fetch data based on configured properties
     * This is the entry point that other classes call
     */
    async fetchMapData(properties) {
        // Currently only supports document libraries, but could be extended
        // for other data sources (lists, external APIs, etc.)
        return this.fetchDocumentLibraryData(properties);
    }
    /**
     * Fetches data from Document Library
     * This method handles the entire process of getting images and their locations
     */
    async fetchDocumentLibraryData(properties) {
        // Destructure properties for easier access
        const { libraryName, locationMethod, latField, lonField } = properties;
        // Initialize result object with empty arrays
        const result = { items: [], errors: [] };
        // Check if library name is provided
        if (!libraryName) {
            return result;
        }
        // Validate manual method has required fields
        // If user selected manual coordinate entry, both fields must be specified
        if (locationMethod === 'manual' && (!latField || !lonField)) {
            result.errors.push('Please select both latitude and longitude fields');
            return result;
        }
        // Get the current SharePoint site URL
        const site = this.context.pageContext.web.absoluteUrl;
        // Escape the library name to handle special characters safely
        const libraryPart = (0,_utils_Security__WEBPACK_IMPORTED_MODULE_3__.escODataIdentifier)(libraryName);
        try {
            // Build select fields - always include FileRef and FileLeafRef
            // FileRef = full path to file, FileLeafRef = just the filename
            const baseFields = ['FileRef', 'FileLeafRef'];
            // Add lat/lon fields if using manual method
            // This ensures we fetch the coordinate data from SharePoint
            if (locationMethod === 'manual' && latField && lonField) {
                baseFields.push(latField);
                baseFields.push(lonField);
            }
            // Convert field array to comma-separated string for API
            // Also escape each field name for safety
            const selectFields = baseFields
                .map(f => (0,_utils_Security__WEBPACK_IMPORTED_MODULE_3__.escODataIdentifier)(f))
                .join(',');
            // Build the SharePoint REST API URL
            // FSObjType eq 0 filters to only files (not folders)
            const url = `${site}/_api/web/lists/getByTitle('${libraryPart}')/items?$select=${selectFields}&$filter=FSObjType eq 0`;
            // Make the API call to SharePoint
            const response = await this.context.spHttpClient.get(url, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1);
            const json = await response.json();
            const items = json.value; // Extract the array of items
            // Counter for images without GPS data (for error message)
            let noGpsCount = 0;
            // Process each item returned from SharePoint
            for (const item of items) {
                const fileName = item.FileLeafRef; // Get the filename
                const fileUrl = `${site}${item.FileRef}`; // Build full URL to file
                // Check if it's an image file based on the file extension
                if (!this.isImageFile(fileUrl))
                    continue; // Skip non-image files
                // For document libraries, always use the file URL as the image
                const img = fileUrl;
                // Initialize coordinate variables
                let lat = null;
                let lon = null;
                if (locationMethod === 'manual') {
                    // Manual method: Get coordinates from specified fields
                    // Check if both fields have values
                    if (item[latField] && item[lonField]) {
                        // Parse string values to numbers
                        lat = parseFloat(item[latField]);
                        lon = parseFloat(item[lonField]);
                    }
                }
                else {
                    // EXIF method: Extract from image EXIF data
                    // This is asynchronous as it needs to load the image
                    const gpsData = await this.extractGPSFromExif(img);
                    if (gpsData) {
                        lat = gpsData.lat;
                        lon = gpsData.lon;
                    }
                    else {
                        noGpsCount++; // Increment counter for error message
                    }
                }
                // Skip if no valid coordinates
                // Check for null, undefined, or NaN values
                if (!lat || !lon || isNaN(lat) || isNaN(lon))
                    continue;
                // Create marker data
                // Sanitize the image URL for security
                const sanitizedImg = (0,_utils_Security__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrl)(img);
                if (!sanitizedImg)
                    continue; // Skip if URL is invalid
                // Create enriched object with all item data plus image URL
                const enriched = Object.assign(Object.assign({}, item), { img: sanitizedImg, // Add sanitized image URL
                    fileName // Add filename for convenience
                 });
                // Add to results array
                result.items.push({
                    lat,
                    lon,
                    img: sanitizedImg,
                    data: enriched
                });
            }
            // Add appropriate error messages
            // Only show EXIF error if some images were missing GPS data
            if (locationMethod === 'exif' && noGpsCount === 1) {
                result.errors.push(`1 image has no EXIF GPS data and will not be displayed.`);
            }
            else if (locationMethod === 'exif' && noGpsCount > 1) {
                result.errors.push(`${noGpsCount} images have no EXIF GPS data and will not be displayed.`);
            }
        }
        catch (err) {
            // Log detailed error for developers
            console.error('Webmap → document library fetch failed:', err);
            // Show user-friendly error message
            result.errors.push('Failed to load images from document library');
        }
        this.getBounds(result.items); // Collect all coordinates for map bounds
        return result;
    }
    /**
     * Extracts GPS coordinates from image EXIF data
     * EXIF (Exchangeable Image File Format) data contains metadata embedded in images
     * This includes camera settings, date/time, and sometimes GPS location
     */
    extractGPSFromExif(imageUrl) {
        return new Promise((resolve) => {
            // Create a new Image object to load the image
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS to allow reading image data
            // Handler for when image loads successfully
            img.onload = function () {
                // Use EXIF library to extract metadata
                // 'this' refers to the image element
                exif_js__WEBPACK_IMPORTED_MODULE_1__.getData(img, function () {
                    // Extract GPS-related tags from EXIF data
                    const lat = exif_js__WEBPACK_IMPORTED_MODULE_1__.getTag(this, 'GPSLatitude'); // Latitude array [degrees, minutes, seconds]
                    const lon = exif_js__WEBPACK_IMPORTED_MODULE_1__.getTag(this, 'GPSLongitude'); // Longitude array [degrees, minutes, seconds]
                    const latRef = exif_js__WEBPACK_IMPORTED_MODULE_1__.getTag(this, 'GPSLatitudeRef'); // N or S (North/South)
                    const lonRef = exif_js__WEBPACK_IMPORTED_MODULE_1__.getTag(this, 'GPSLongitudeRef'); // E or W (East/West)
                    // Check if we have both latitude and longitude
                    if (lat && lon) {
                        // Convert GPS coordinates from degrees/minutes/seconds to decimal
                        const decimalLat = DataService.convertDMSToDD(lat, latRef);
                        const decimalLon = DataService.convertDMSToDD(lon, lonRef);
                        // Return coordinates if conversion was successful
                        if (decimalLat !== null && decimalLon !== null) {
                            resolve({ lat: decimalLat, lon: decimalLon });
                        }
                        else {
                            resolve(null); // Conversion failed
                        }
                    }
                    else {
                        resolve(null); // No GPS data in EXIF
                    }
                });
            };
            // Handler for image load errors
            img.onerror = () => {
                resolve(null); // Return null if image fails to load
            };
            // Start loading the image
            img.src = imageUrl;
        });
    }
    /**
     * Converts GPS coordinates from degrees/minutes/seconds to decimal degrees
     * GPS coordinates in EXIF are stored as [degrees, minutes, seconds]
     * Map libraries expect decimal degrees (e.g., 51.4239 instead of 51° 25' 26.04")
     */
    static convertDMSToDD(dms, ref) {
        // Validate input array has all three components
        if (!dms || dms.length !== 3)
            return null;
        // Convert using the formula: decimal = degrees + (minutes/60) + (seconds/3600)
        let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
        // Apply hemisphere correction
        // Southern and Western coordinates are negative
        if (ref === 'S' || ref === 'W') {
            dd = dd * -1;
        }
        return dd;
    }
    /**
     * Checks if a file is an image based on its extension
     * This is a simple check that looks at the file extension
     */
    isImageFile(fileUrl) {
        // List of common image file extensions
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        // Extract filename from URL (everything after last /)
        const fileName = fileUrl.split('/').pop() || fileUrl;
        // Get the file extension (everything after last .)
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        // Check if extension is in our list
        return imageExtensions.indexOf(ext) !== -1;
    }
    /**
     * Collect all coordinates and call MapViewService to set bounds
     */
    getBounds(items) {
        const bounds = [];
        for (const item of items) {
            bounds.push(leaflet__WEBPACK_IMPORTED_MODULE_2__.latLng(item.lat, item.lon));
        }
        // Pass bounds to MapViewService
        if (this.mapViewService) {
            this.mapViewService.setImageBounds(bounds);
        }
    }
}


/***/ }),

/***/ 989:
/*!********************************************************!*\
  !*** ./lib/webparts/webmap/services/MapViewService.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapViewService: () => (/* binding */ MapViewService)
/* harmony export */ });
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! leaflet */ 973);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* ========================================================================== */
/* services/MapView.ts                                                        */
/* - Service for managing map view and bounds                                 */
/* - Coordinates between image markers and feature layers                     */
/* - Handles automatic zoom to fit all content                                */
/* ========================================================================== */

/**
 * Hochtief default view coordinates
 * Used when no content is available to display
 */
const HOCHTIEF_DEFAULT_VIEW = {
    lat: 51.4239, // Hochtief headquarters latitude
    lon: 6.9985, // Hochtief headquarters longitude
    zoom: 15 // Default zoom level
};
/**
 * Service for managing map view and bounds
 * Coordinates between different data sources to ensure optimal map view
 */
class MapViewService {
    constructor(map) {
        this.imageBounds = []; // Bounds for image markers
        this.featureBounds = []; // Bounds for feature layers
        this.map = map;
    }
    /**
     * Set bounds for image markers
     * Called by DataService after images are loaded
     */
    setImageBounds(bounds) {
        this.imageBounds = [...bounds]; // Create a copy to avoid reference issues
        console.log(`MapView: Updated image bounds - ${bounds.length} points`);
        this.updateMapView();
    }
    /**
     * Set bounds for feature layers
     * Called by FeatureLayerService after features are loaded
     */
    setFeatureBounds(bounds) {
        this.featureBounds = [...bounds]; // Create a copy to avoid reference issues
        console.log(`MapView: Updated feature bounds - ${bounds.length} points`);
        this.updateMapView();
    }
    /**
     * Clear all bounds (useful when refreshing data)
     */
    clearBounds() {
        this.imageBounds = [];
        this.featureBounds = [];
        console.log('MapView: Cleared all bounds');
    }
    /**
     * Main method to update map view based on current bounds
     * Implements the logic for different scenarios
     */
    updateMapView() {
        try {
            // Combine all available bounds
            const allBounds = [...this.imageBounds, ...this.featureBounds];
            if (allBounds.length === 0) {
                // No content available - set Hochtief default view
                console.log('MapView: No content available, setting Hochtief default view');
                this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
                return;
            }
            if (allBounds.length === 1) {
                // Only one point - center on it with reasonable zoom
                console.log('MapView: Single point detected, centering with default zoom');
                const point = allBounds[0];
                this.map.setView([point.lat, point.lng], 16); // Zoom level 16 for single points
                return;
            }
            // Multiple points - fit all bounds
            console.log(`MapView: Multiple points detected (${allBounds.length}), fitting to bounds`);
            // Create LatLngBounds object from all points
            const boundsGroup = new leaflet__WEBPACK_IMPORTED_MODULE_0__.LatLngBounds(allBounds);
            // Fit the map to show all points with some padding
            this.map.fitBounds(boundsGroup, {
                padding: [20, 20], // Add 20px padding on all sides
                maxZoom: 18 // Don't zoom in too close even for nearby points
            });
            // Log the final bounds for debugging
            const center = boundsGroup.getCenter();
            console.log(`MapView: Set view to center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
        }
        catch (error) {
            // If anything goes wrong with bounds calculation, fall back to default view
            console.error('MapView: Error updating map view, falling back to default:', error);
            this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
        }
    }
    /**
     * Force immediate view update
     * Useful for manual triggers or debugging
     */
    forceUpdateView() {
        console.log('MapView: Force updating view');
        this.updateMapView();
    }
    /**
     * Get current bounds summary for debugging
     */
    getBoundsSummary() {
        return {
            images: this.imageBounds.length,
            features: this.featureBounds.length,
            total: this.imageBounds.length + this.featureBounds.length
        };
    }
    /**
     * Check if map has any content to display
     */
    hasContent() {
        return this.imageBounds.length > 0 || this.featureBounds.length > 0;
    }
    /**
     * Set default Hochtief view manually
     * Useful for reset operations
     */
    setDefaultView() {
        console.log('MapView: Setting Hochtief default view');
        this.map.setView([HOCHTIEF_DEFAULT_VIEW.lat, HOCHTIEF_DEFAULT_VIEW.lon], HOCHTIEF_DEFAULT_VIEW.zoom);
    }
}


/***/ }),

/***/ 415:
/*!***********************************************!*\
  !*** ./lib/webparts/webmap/utils/Security.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   escAttr: () => (/* binding */ escAttr),
/* harmony export */   escODataIdentifier: () => (/* binding */ escODataIdentifier),
/* harmony export */   sanitizeUrl: () => (/* binding */ sanitizeUrl),
/* harmony export */   validateArcGISUrl: () => (/* binding */ validateArcGISUrl)
/* harmony export */ });
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
function escODataIdentifier(id) {
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
function sanitizeUrl(url) {
    try {
        // The second argument provides a base URL for relative paths.
        const u = new URL(url, window.location.origin);
        return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
    }
    catch (_a) {
        return '';
    } // Return empty string if URL parsing fails.
}
/**
 * Escapes a string for safe use within an HTML attribute value. This prevents
 * an attacker from breaking out of an attribute and injecting malicious HTML or scripts.
 * @param v The string value to escape.
 * @returns A sanitized string safe for HTML attributes.
 */
function escAttr(v) {
    return v.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
/**
 * Simple ArcGIS URL validator - just checks it's HTTPS and contains maps.arcgis.com
 * @param url The ArcGIS URL to validate
 * @returns The sanitized URL or null if invalid
 */
/**
 * Allowed ArcGIS domains for security validation
 */
const ALLOWED_ARCGIS_DOMAINS = [
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
function validateArcGISUrl(url) {
    if (!url)
        return null;
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
    }
    catch (_a) {
        // Invalid URL format
    }
    return null;
}


/***/ }),

/***/ 776:
/*!***************************************************!*\
  !*** ./lib/webparts/webmap/utils/ToastManager.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToastManager: () => (/* binding */ ToastManager)
/* harmony export */ });
/* harmony import */ var _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WebmapWebPart.module.scss */ 641);
/* ========================================================================== */
/* ToastManager.ts                                                            */
/* - Utility for showing toast notifications                                  */
/* ========================================================================== */

class ToastManager {
    /**
     * Shows a toast notification
     */
    static show(message, type = 'info') {
        // Create a new div element for the toast notification
        const toast = document.createElement('div');
        // Apply CSS classes - base toast class plus error class if type is 'error'
        toast.className = `${_WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_0__["default"].toast} ${type === 'error' ? _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_0__["default"].toastError : ''}`;
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


/***/ }),

/***/ 323:
/*!***********************************************************************************************************!*\
  !*** ./node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClearStyleOptions: () => (/* binding */ ClearStyleOptions),
/* harmony export */   Mode: () => (/* binding */ Mode),
/* harmony export */   clearStyles: () => (/* binding */ clearStyles),
/* harmony export */   configureLoadStyles: () => (/* binding */ configureLoadStyles),
/* harmony export */   configureRunMode: () => (/* binding */ configureRunMode),
/* harmony export */   detokenize: () => (/* binding */ detokenize),
/* harmony export */   flush: () => (/* binding */ flush),
/* harmony export */   loadStyles: () => (/* binding */ loadStyles),
/* harmony export */   loadTheme: () => (/* binding */ loadTheme),
/* harmony export */   splitStyles: () => (/* binding */ splitStyles)
/* harmony export */ });
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * In sync mode, styles are registered as style elements synchronously with loadStyles() call.
 * In async mode, styles are buffered and registered as batch in async timer for performance purpose.
 */
var Mode;
(function (Mode) {
    Mode[Mode["sync"] = 0] = "sync";
    Mode[Mode["async"] = 1] = "async";
})(Mode || (Mode = {}));
/**
 * Themable styles and non-themable styles are tracked separately
 * Specify ClearStyleOptions when calling clearStyles API to specify which group of registered styles should be cleared.
 */
var ClearStyleOptions;
(function (ClearStyleOptions) {
    /** only themable styles will be cleared */
    ClearStyleOptions[ClearStyleOptions["onlyThemable"] = 1] = "onlyThemable";
    /** only non-themable styles will be cleared */
    ClearStyleOptions[ClearStyleOptions["onlyNonThemable"] = 2] = "onlyNonThemable";
    /** both themable and non-themable styles will be cleared */
    ClearStyleOptions[ClearStyleOptions["all"] = 3] = "all";
})(ClearStyleOptions || (ClearStyleOptions = {}));
// Store the theming state in __themeState__ global scope for reuse in the case of duplicate
// load-themed-styles hosted on the page.
var _root = typeof window === 'undefined' ? __webpack_require__.g : window; // eslint-disable-line @typescript-eslint/no-explicit-any
// Nonce string to inject into script tag if one provided. This is used in CSP (Content Security Policy).
var _styleNonce = _root && _root.CSPSettings && _root.CSPSettings.nonce;
var _themeState = initializeThemeState();
/**
 * Matches theming tokens. For example, "[theme: themeSlotName, default: #FFF]" (including the quotes).
 */
var _themeTokenRegex = /[\'\"]\[theme:\s*(\w+)\s*(?:\,\s*default:\s*([\\"\']?[\.\,\(\)\#\-\s\w]*[\.\,\(\)\#\-\w][\"\']?))?\s*\][\'\"]/g;
var now = function () {
    return typeof performance !== 'undefined' && !!performance.now ? performance.now() : Date.now();
};
function measure(func) {
    var start = now();
    func();
    var end = now();
    _themeState.perf.duration += end - start;
}
/**
 * initialize global state object
 */
function initializeThemeState() {
    var state = _root.__themeState__ || {
        theme: undefined,
        lastStyleElement: undefined,
        registeredStyles: []
    };
    if (!state.runState) {
        state = __assign(__assign({}, state), { perf: {
                count: 0,
                duration: 0
            }, runState: {
                flushTimer: 0,
                mode: Mode.sync,
                buffer: []
            } });
    }
    if (!state.registeredThemableStyles) {
        state = __assign(__assign({}, state), { registeredThemableStyles: [] });
    }
    _root.__themeState__ = state;
    return state;
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
function loadStyles(styles, loadAsync) {
    if (loadAsync === void 0) { loadAsync = false; }
    measure(function () {
        var styleParts = Array.isArray(styles) ? styles : splitStyles(styles);
        var _a = _themeState.runState, mode = _a.mode, buffer = _a.buffer, flushTimer = _a.flushTimer;
        if (loadAsync || mode === Mode.async) {
            buffer.push(styleParts);
            if (!flushTimer) {
                _themeState.runState.flushTimer = asyncLoadStyles();
            }
        }
        else {
            applyThemableStyles(styleParts);
        }
    });
}
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
function configureLoadStyles(loadStylesFn) {
    _themeState.loadStyles = loadStylesFn;
}
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
function configureRunMode(mode) {
    _themeState.runState.mode = mode;
}
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
function flush() {
    measure(function () {
        var styleArrays = _themeState.runState.buffer.slice();
        _themeState.runState.buffer = [];
        var mergedStyleArray = [].concat.apply([], styleArrays);
        if (mergedStyleArray.length > 0) {
            applyThemableStyles(mergedStyleArray);
        }
    });
}
/**
 * register async loadStyles
 */
function asyncLoadStyles() {
    // Use "self" to distinguish conflicting global typings for setTimeout() from lib.dom.d.ts vs Jest's @types/node
    // https://github.com/jestjs/jest/issues/14418
    return self.setTimeout(function () {
        _themeState.runState.flushTimer = 0;
        flush();
    }, 0);
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load event
 * is fired.
 * @param {string} styleText Style to register.
 * @param {IStyleRecord} styleRecord Existing style record to re-apply.
 */
function applyThemableStyles(stylesArray, styleRecord) {
    if (_themeState.loadStyles) {
        _themeState.loadStyles(resolveThemableArray(stylesArray).styleString, stylesArray);
    }
    else {
        registerStyles(stylesArray);
    }
}
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
function loadTheme(theme) {
    _themeState.theme = theme;
    // reload styles.
    reloadStyles();
}
/**
 * Clear already registered style elements and style records in theme_State object
 * @param option - specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
function clearStyles(option) {
    if (option === void 0) { option = ClearStyleOptions.all; }
    if (option === ClearStyleOptions.all || option === ClearStyleOptions.onlyNonThemable) {
        clearStylesInternal(_themeState.registeredStyles);
        _themeState.registeredStyles = [];
    }
    if (option === ClearStyleOptions.all || option === ClearStyleOptions.onlyThemable) {
        clearStylesInternal(_themeState.registeredThemableStyles);
        _themeState.registeredThemableStyles = [];
    }
}
function clearStylesInternal(records) {
    records.forEach(function (styleRecord) {
        var styleElement = styleRecord && styleRecord.styleElement;
        if (styleElement && styleElement.parentElement) {
            styleElement.parentElement.removeChild(styleElement);
        }
    });
}
/**
 * Reloads styles.
 */
function reloadStyles() {
    if (_themeState.theme) {
        var themableStyles = [];
        for (var _i = 0, _a = _themeState.registeredThemableStyles; _i < _a.length; _i++) {
            var styleRecord = _a[_i];
            themableStyles.push(styleRecord.themableStyle);
        }
        if (themableStyles.length > 0) {
            clearStyles(ClearStyleOptions.onlyThemable);
            applyThemableStyles([].concat.apply([], themableStyles));
        }
    }
}
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
function detokenize(styles) {
    if (styles) {
        styles = resolveThemableArray(splitStyles(styles)).styleString;
    }
    return styles;
}
/**
 * Resolves ThemingInstruction objects in an array and joins the result into a string.
 * @param {ThemableArray} splitStyleArray ThemableArray to resolve and join.
 */
function resolveThemableArray(splitStyleArray) {
    var theme = _themeState.theme;
    var themable = false;
    // Resolve the array of theming instructions to an array of strings.
    // Then join the array to produce the final CSS string.
    var resolvedArray = (splitStyleArray || []).map(function (currentValue) {
        var themeSlot = currentValue.theme;
        if (themeSlot) {
            themable = true;
            // A theming annotation. Resolve it.
            var themedValue = theme ? theme[themeSlot] : undefined;
            var defaultValue = currentValue.defaultValue || 'inherit';
            // Warn to console if we hit an unthemed value even when themes are provided, but only if "DEBUG" is true.
            // Allow the themedValue to be undefined to explicitly request the default value.
            if (theme &&
                !themedValue &&
                console &&
                !(themeSlot in theme) &&
                "boolean" !== 'undefined' &&
                true) {
                // eslint-disable-next-line no-console
                console.warn("Theming value not provided for \"".concat(themeSlot, "\". Falling back to \"").concat(defaultValue, "\"."));
            }
            return themedValue || defaultValue;
        }
        else {
            // A non-themable string. Preserve it.
            return currentValue.rawString;
        }
    });
    return {
        styleString: resolvedArray.join(''),
        themable: themable
    };
}
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
function splitStyles(styles) {
    var result = [];
    if (styles) {
        var pos = 0; // Current position in styles.
        var tokenMatch = void 0;
        while ((tokenMatch = _themeTokenRegex.exec(styles))) {
            var matchIndex = tokenMatch.index;
            if (matchIndex > pos) {
                result.push({
                    rawString: styles.substring(pos, matchIndex)
                });
            }
            result.push({
                theme: tokenMatch[1],
                defaultValue: tokenMatch[2] // May be undefined
            });
            // index of the first character after the current match
            pos = _themeTokenRegex.lastIndex;
        }
        // Push the rest of the string after the last match.
        result.push({
            rawString: styles.substring(pos)
        });
    }
    return result;
}
/**
 * Registers a set of style text. If it is registered too early, we will register it when the
 * window.load event is fired.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStyles(styleArray) {
    if (typeof document === 'undefined') {
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    var _a = resolveThemableArray(styleArray), styleString = _a.styleString, themable = _a.themable;
    styleElement.setAttribute('data-load-themed-styles', 'true');
    if (_styleNonce) {
        styleElement.setAttribute('nonce', _styleNonce);
    }
    styleElement.appendChild(document.createTextNode(styleString));
    _themeState.perf.count++;
    head.appendChild(styleElement);
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('styleinsert', true /* bubbleEvent */, false /* cancelable */);
    ev.args = {
        newStyle: styleElement
    };
    document.dispatchEvent(ev);
    var record = {
        styleElement: styleElement,
        themableStyle: styleArray
    };
    if (themable) {
        _themeState.registeredThemableStyles.push(record);
    }
    else {
        _themeState.registeredStyles.push(record);
    }
}


/***/ }),

/***/ 780:
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== 'string') {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, '\\n'), "\"");
  }

  return url;
};

/***/ }),

/***/ 222:
/*!**************************************!*\
  !*** ./node_modules/exif-js/exif.js ***!
  \**************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {

    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (true) {
        if ( true && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {}

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

     // EXIF 2.3 Spec
    var IFD1Tags = EXIF.IFD1Tags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0111: "StripOffsets",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x011C: "PlanarConfiguration",
        0x0128: "ResolutionUnit",
        0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
        0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
        0x0211: "YCbCrCoefficients",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x0214: "ReferenceBlackWhite"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            img.exifdata = data || {};
            var iptcdata = findIPTCinJPEG(binFile);
            img.iptcdata = iptcdata || {};
            if (EXIF.isXmpEnabled) {
               var xmpdata= findXMPinJPEG(binFile);
               img.xmpdata = xmpdata || {};               
            }
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    /**
    * Given an IFD (Image File Directory) start offset
    * returns an offset to next IFD or 0 if it's the last IFD.
    */
    function getNextIFDOffset(dataView, dirStart, bigEnd){
        //the first 2bytes means the number of directory entries contains in this IFD
        var entries = dataView.getUint16(dirStart, !bigEnd);

        // After last directory entry, there is a 4bytes of data,
        // it means an offset to next IFD.
        // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
    }

    function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
        // get the IFD1 offset
        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

        if (!IFD1OffsetPointer) {
            // console.log('******** IFD1Offset is empty, image thumb not found ********');
            return {};
        }
        else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
            // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
            return {};
        }
        // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

        // EXIF 2.3 specification for JPEG format thumbnail

        // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
        // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
        // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
        // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
        // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

        if (thumbTags['Compression']) {
            // console.log('Thumbnail image found!');

            switch (thumbTags['Compression']) {
                case 6:
                    // console.log('Thumbnail image format is JPEG');
                    if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
                    // extract the thumbnail
                        var tOffset = tiffStart + thumbTags.JpegIFOffset;
                        var tLength = thumbTags.JpegIFByteCount;
                        thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
                            type: 'image/jpeg'
                        });
                    }
                break;

            case 1:
                console.log("Thumbnail image format is TIFF, which is not implemented.");
                break;
            default:
                console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
            }
        }
        else if (thumbTags['PhotometricInterpretation'] == 2) {
            console.log("Thumbnail image format is RGB, which is not implemented.");
        }
        return thumbTags;
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        // extract thumbnail
        tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

        return tags;
    }

   function findXMPinJPEG(file) {

        if (!('DOMParser' in self)) {
            // console.warn('XML parsing not supported without DOMParser');
            return;
        }
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
           if (debug) console.log("Not a valid JPEG");
           return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            dom = new DOMParser();

        while (offset < (length-4)) {
            if (getStringFromDB(dataView, offset, 4) == "http") {
                var startOffset = offset - 1;
                var sectionLength = dataView.getUint16(offset - 2) - 1;
                var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
                var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
                xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

                var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
                //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
                //Without these namespaces, XML is thought to be invalid by parsers
                xmpString = xmpString.slice(0, indexOfXmp)
                            + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
                            + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
                            + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
                            + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
                            + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
                            + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
                            + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
                            + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
                            + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
                            + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
                            + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
                            + xmpString.slice(indexOfXmp)

                var domDocument = dom.parseFromString( xmpString, 'text/xml' );
                return xml2Object(domDocument);
            } else{
             offset++;
            }
        }
    }

    function xml2json(xml) {
        var json = {};
      
        if (xml.nodeType == 1) { // element node
          if (xml.attributes.length > 0) {
            json['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
              var attribute = xml.attributes.item(j);
              json['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType == 3) { // text node
          return xml.nodeValue;
        }
      
        // deal with children
        if (xml.hasChildNodes()) {
          for(var i = 0; i < xml.childNodes.length; i++) {
            var child = xml.childNodes.item(i);
            var nodeName = child.nodeName;
            if (json[nodeName] == null) {
              json[nodeName] = xml2json(child);
            } else {
              if (json[nodeName].push == null) {
                var old = json[nodeName];
                json[nodeName] = [];
                json[nodeName].push(old);
              }
              json[nodeName].push(xml2json(child));
            }
          }
        }
        
        return json;
    }

    function xml2Object(xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
              for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var attributes = item.attributes;
                for(var idx in attributes) {
                    var itemAtt = attributes[idx];
                    var dataKey = itemAtt.nodeName;
                    var dataValue = itemAtt.nodeValue;

                    if(dataKey !== undefined) {
                        obj[dataKey] = dataValue;
                    }
                }
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                  obj[nodeName] = xml2json(item);
                } else {
                  if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];

                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xml2json(item));
                }
              }
            } else {
              obj = xml.textContent;
            }
            return obj;
          } catch (e) {
              console.log(e.message);
          }
    }

    EXIF.enableXmp = function() {
        EXIF.isXmpEnabled = true;
    }

    EXIF.disableXmp = function() {
        EXIF.isXmpEnabled = false;
    }

    EXIF.getData = function(img, callback) {
        if (((self.Image && img instanceof self.Image)
            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
            && !img.complete)
            return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }
    
    EXIF.getIptcTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    
    EXIF.getAllIptcTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.iptcdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return EXIF;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
}.call(this));



/***/ }),

/***/ 528:
/*!******************************************************************************!*\
  !*** ./node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

/*
 * Leaflet.markercluster 1.5.3+master.e5124b2,
 * Provides Beautiful Animated Marker Clustering functionality for Leaflet, a JS library for interactive maps.
 * https://github.com/Leaflet/Leaflet.markercluster
 * (c) 2012-2017, Dave Leaver, smartrak
 */
(function (global, factory) {
	 true ? factory(exports) :
	0;
}(this, function (exports) { 'use strict';

	/*
	 * L.MarkerClusterGroup extends L.FeatureGroup by clustering the markers contained within
	 */

	var MarkerClusterGroup = L.MarkerClusterGroup = L.FeatureGroup.extend({

		options: {
			maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
			iconCreateFunction: null,
			clusterPane: L.Marker.prototype.options.pane,

			spiderfyOnEveryZoom: false,
			spiderfyOnMaxZoom: true,
			showCoverageOnHover: true,
			zoomToBoundsOnClick: true,
			singleMarkerMode: false,

			disableClusteringAtZoom: null,

			// Setting this to false prevents the removal of any clusters outside of the viewpoint, which
			// is the default behaviour for performance reasons.
			removeOutsideVisibleBounds: true,

			// Set to false to disable all animations (zoom and spiderfy).
			// If false, option animateAddingMarkers below has no effect.
			// If L.DomUtil.TRANSITION is falsy, this option has no effect.
			animate: true,

			//Whether to animate adding markers after adding the MarkerClusterGroup to the map
			// If you are adding individual markers set to true, if adding bulk markers leave false for massive performance gains.
			animateAddingMarkers: false,

			// Make it possible to provide custom function to calculate spiderfy shape positions
			spiderfyShapePositions: null,

			//Increase to increase the distance away that spiderfied markers appear from the center
			spiderfyDistanceMultiplier: 1,

			// Make it possible to specify a polyline options on a spider leg
			spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },

			// When bulk adding layers, adds markers in chunks. Means addLayers may not add all the layers in the call, others will be loaded during setTimeouts
			chunkedLoading: false,
			chunkInterval: 200, // process markers for a maximum of ~ n milliseconds (then trigger the chunkProgress callback)
			chunkDelay: 50, // at the end of each interval, give n milliseconds back to system/browser
			chunkProgress: null, // progress callback: function(processed, total, elapsed) (e.g. for a progress indicator)

			//Options to pass to the L.Polygon constructor
			polygonOptions: {}
		},

		initialize: function (options) {
			L.Util.setOptions(this, options);
			if (!this.options.iconCreateFunction) {
				this.options.iconCreateFunction = this._defaultIconCreateFunction;
			}

			this._featureGroup = L.featureGroup();
			this._featureGroup.addEventParent(this);

			this._nonPointGroup = L.featureGroup();
			this._nonPointGroup.addEventParent(this);

			this._inZoomAnimation = 0;
			this._needsClustering = [];
			this._needsRemoving = []; //Markers removed while we aren't on the map need to be kept track of
			//The bounds of the currently shown area (from _getExpandedVisibleBounds) Updated on zoom/move
			this._currentShownBounds = null;

			this._queue = [];

			this._childMarkerEventHandlers = {
				'dragstart': this._childMarkerDragStart,
				'move': this._childMarkerMoved,
				'dragend': this._childMarkerDragEnd,
			};

			// Hook the appropriate animation methods.
			var animate = L.DomUtil.TRANSITION && this.options.animate;
			L.extend(this, animate ? this._withAnimation : this._noAnimation);
			// Remember which MarkerCluster class to instantiate (animated or not).
			this._markerCluster = animate ? L.MarkerCluster : L.MarkerClusterNonAnimated;
		},

		addLayer: function (layer) {

			if (layer instanceof L.LayerGroup) {
				return this.addLayers([layer]);
			}

			//Don't cluster non point data
			if (!layer.getLatLng) {
				this._nonPointGroup.addLayer(layer);
				this.fire('layeradd', { layer: layer });
				return this;
			}

			if (!this._map) {
				this._needsClustering.push(layer);
				this.fire('layeradd', { layer: layer });
				return this;
			}

			if (this.hasLayer(layer)) {
				return this;
			}


			//If we have already clustered we'll need to add this one to a cluster

			if (this._unspiderfy) {
				this._unspiderfy();
			}

			this._addLayer(layer, this._maxZoom);
			this.fire('layeradd', { layer: layer });

			// Refresh bounds and weighted positions.
			this._topClusterLevel._recalculateBounds();

			this._refreshClustersIcons();

			//Work out what is visible
			var visibleLayer = layer,
			    currentZoom = this._zoom;
			if (layer.__parent) {
				while (visibleLayer.__parent._zoom >= currentZoom) {
					visibleLayer = visibleLayer.__parent;
				}
			}

			if (this._currentShownBounds.contains(visibleLayer.getLatLng())) {
				if (this.options.animateAddingMarkers) {
					this._animationAddLayer(layer, visibleLayer);
				} else {
					this._animationAddLayerNonAnimated(layer, visibleLayer);
				}
			}
			return this;
		},

		removeLayer: function (layer) {

			if (layer instanceof L.LayerGroup) {
				return this.removeLayers([layer]);
			}

			//Non point layers
			if (!layer.getLatLng) {
				this._nonPointGroup.removeLayer(layer);
				this.fire('layerremove', { layer: layer });
				return this;
			}

			if (!this._map) {
				if (!this._arraySplice(this._needsClustering, layer) && this.hasLayer(layer)) {
					this._needsRemoving.push({ layer: layer, latlng: layer._latlng });
				}
				this.fire('layerremove', { layer: layer });
				return this;
			}

			if (!layer.__parent) {
				return this;
			}

			if (this._unspiderfy) {
				this._unspiderfy();
				this._unspiderfyLayer(layer);
			}

			//Remove the marker from clusters
			this._removeLayer(layer, true);
			this.fire('layerremove', { layer: layer });

			// Refresh bounds and weighted positions.
			this._topClusterLevel._recalculateBounds();

			this._refreshClustersIcons();

			layer.off(this._childMarkerEventHandlers, this);

			if (this._featureGroup.hasLayer(layer)) {
				this._featureGroup.removeLayer(layer);
				if (layer.clusterShow) {
					layer.clusterShow();
				}
			}

			return this;
		},

		//Takes an array of markers and adds them in bulk
		addLayers: function (layersArray, skipLayerAddEvent) {
			if (!L.Util.isArray(layersArray)) {
				return this.addLayer(layersArray);
			}

			var fg = this._featureGroup,
			    npg = this._nonPointGroup,
			    chunked = this.options.chunkedLoading,
			    chunkInterval = this.options.chunkInterval,
			    chunkProgress = this.options.chunkProgress,
			    l = layersArray.length,
			    offset = 0,
			    originalArray = true,
			    m;

			if (this._map) {
				var started = (new Date()).getTime();
				var process = L.bind(function () {
					var start = (new Date()).getTime();

					// Make sure to unspiderfy before starting to add some layers
					if (this._map && this._unspiderfy) {
						this._unspiderfy();
					}

					for (; offset < l; offset++) {
						if (chunked && offset % 200 === 0) {
							// every couple hundred markers, instrument the time elapsed since processing started:
							var elapsed = (new Date()).getTime() - start;
							if (elapsed > chunkInterval) {
								break; // been working too hard, time to take a break :-)
							}
						}

						m = layersArray[offset];

						// Group of layers, append children to layersArray and skip.
						// Side effects:
						// - Total increases, so chunkProgress ratio jumps backward.
						// - Groups are not included in this group, only their non-group child layers (hasLayer).
						// Changing array length while looping does not affect performance in current browsers:
						// http://jsperf.com/for-loop-changing-length/6
						if (m instanceof L.LayerGroup) {
							if (originalArray) {
								layersArray = layersArray.slice();
								originalArray = false;
							}
							this._extractNonGroupLayers(m, layersArray);
							l = layersArray.length;
							continue;
						}

						//Not point data, can't be clustered
						if (!m.getLatLng) {
							npg.addLayer(m);
							if (!skipLayerAddEvent) {
								this.fire('layeradd', { layer: m });
							}
							continue;
						}

						if (this.hasLayer(m)) {
							continue;
						}

						this._addLayer(m, this._maxZoom);
						if (!skipLayerAddEvent) {
							this.fire('layeradd', { layer: m });
						}

						//If we just made a cluster of size 2 then we need to remove the other marker from the map (if it is) or we never will
						if (m.__parent) {
							if (m.__parent.getChildCount() === 2) {
								var markers = m.__parent.getAllChildMarkers(),
								    otherMarker = markers[0] === m ? markers[1] : markers[0];
								fg.removeLayer(otherMarker);
							}
						}
					}

					if (chunkProgress) {
						// report progress and time elapsed:
						chunkProgress(offset, l, (new Date()).getTime() - started);
					}

					// Completed processing all markers.
					if (offset === l) {

						// Refresh bounds and weighted positions.
						this._topClusterLevel._recalculateBounds();

						this._refreshClustersIcons();

						this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);
					} else {
						setTimeout(process, this.options.chunkDelay);
					}
				}, this);

				process();
			} else {
				var needsClustering = this._needsClustering;

				for (; offset < l; offset++) {
					m = layersArray[offset];

					// Group of layers, append children to layersArray and skip.
					if (m instanceof L.LayerGroup) {
						if (originalArray) {
							layersArray = layersArray.slice();
							originalArray = false;
						}
						this._extractNonGroupLayers(m, layersArray);
						l = layersArray.length;
						continue;
					}

					//Not point data, can't be clustered
					if (!m.getLatLng) {
						npg.addLayer(m);
						continue;
					}

					if (this.hasLayer(m)) {
						continue;
					}

					needsClustering.push(m);
				}
			}
			return this;
		},

		//Takes an array of markers and removes them in bulk
		removeLayers: function (layersArray) {
			var i, m,
			    l = layersArray.length,
			    fg = this._featureGroup,
			    npg = this._nonPointGroup,
			    originalArray = true;

			if (!this._map) {
				for (i = 0; i < l; i++) {
					m = layersArray[i];

					// Group of layers, append children to layersArray and skip.
					if (m instanceof L.LayerGroup) {
						if (originalArray) {
							layersArray = layersArray.slice();
							originalArray = false;
						}
						this._extractNonGroupLayers(m, layersArray);
						l = layersArray.length;
						continue;
					}

					this._arraySplice(this._needsClustering, m);
					npg.removeLayer(m);
					if (this.hasLayer(m)) {
						this._needsRemoving.push({ layer: m, latlng: m._latlng });
					}
					this.fire('layerremove', { layer: m });
				}
				return this;
			}

			if (this._unspiderfy) {
				this._unspiderfy();

				// Work on a copy of the array, so that next loop is not affected.
				var layersArray2 = layersArray.slice(),
				    l2 = l;
				for (i = 0; i < l2; i++) {
					m = layersArray2[i];

					// Group of layers, append children to layersArray and skip.
					if (m instanceof L.LayerGroup) {
						this._extractNonGroupLayers(m, layersArray2);
						l2 = layersArray2.length;
						continue;
					}

					this._unspiderfyLayer(m);
				}
			}

			for (i = 0; i < l; i++) {
				m = layersArray[i];

				// Group of layers, append children to layersArray and skip.
				if (m instanceof L.LayerGroup) {
					if (originalArray) {
						layersArray = layersArray.slice();
						originalArray = false;
					}
					this._extractNonGroupLayers(m, layersArray);
					l = layersArray.length;
					continue;
				}

				if (!m.__parent) {
					npg.removeLayer(m);
					this.fire('layerremove', { layer: m });
					continue;
				}

				this._removeLayer(m, true, true);
				this.fire('layerremove', { layer: m });

				if (fg.hasLayer(m)) {
					fg.removeLayer(m);
					if (m.clusterShow) {
						m.clusterShow();
					}
				}
			}

			// Refresh bounds and weighted positions.
			this._topClusterLevel._recalculateBounds();

			this._refreshClustersIcons();

			//Fix up the clusters and markers on the map
			this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);

			return this;
		},

		//Removes all layers from the MarkerClusterGroup
		clearLayers: function () {
			//Need our own special implementation as the LayerGroup one doesn't work for us

			//If we aren't on the map (yet), blow away the markers we know of
			if (!this._map) {
				this._needsClustering = [];
				this._needsRemoving = [];
				delete this._gridClusters;
				delete this._gridUnclustered;
			}

			if (this._noanimationUnspiderfy) {
				this._noanimationUnspiderfy();
			}

			//Remove all the visible layers
			this._featureGroup.clearLayers();
			this._nonPointGroup.clearLayers();

			this.eachLayer(function (marker) {
				marker.off(this._childMarkerEventHandlers, this);
				delete marker.__parent;
			}, this);

			if (this._map) {
				//Reset _topClusterLevel and the DistanceGrids
				this._generateInitialClusters();
			}

			return this;
		},

		//Override FeatureGroup.getBounds as it doesn't work
		getBounds: function () {
			var bounds = new L.LatLngBounds();

			if (this._topClusterLevel) {
				bounds.extend(this._topClusterLevel._bounds);
			}

			for (var i = this._needsClustering.length - 1; i >= 0; i--) {
				bounds.extend(this._needsClustering[i].getLatLng());
			}

			bounds.extend(this._nonPointGroup.getBounds());

			return bounds;
		},

		//Overrides LayerGroup.eachLayer
		eachLayer: function (method, context) {
			var markers = this._needsClustering.slice(),
				needsRemoving = this._needsRemoving,
				thisNeedsRemoving, i, j;

			if (this._topClusterLevel) {
				this._topClusterLevel.getAllChildMarkers(markers);
			}

			for (i = markers.length - 1; i >= 0; i--) {
				thisNeedsRemoving = true;

				for (j = needsRemoving.length - 1; j >= 0; j--) {
					if (needsRemoving[j].layer === markers[i]) {
						thisNeedsRemoving = false;
						break;
					}
				}

				if (thisNeedsRemoving) {
					method.call(context, markers[i]);
				}
			}

			this._nonPointGroup.eachLayer(method, context);
		},

		//Overrides LayerGroup.getLayers
		getLayers: function () {
			var layers = [];
			this.eachLayer(function (l) {
				layers.push(l);
			});
			return layers;
		},

		//Overrides LayerGroup.getLayer, WARNING: Really bad performance
		getLayer: function (id) {
			var result = null;

			id = parseInt(id, 10);

			this.eachLayer(function (l) {
				if (L.stamp(l) === id) {
					result = l;
				}
			});

			return result;
		},

		//Returns true if the given layer is in this MarkerClusterGroup
		hasLayer: function (layer) {
			if (!layer) {
				return false;
			}

			var i, anArray = this._needsClustering;

			for (i = anArray.length - 1; i >= 0; i--) {
				if (anArray[i] === layer) {
					return true;
				}
			}

			anArray = this._needsRemoving;
			for (i = anArray.length - 1; i >= 0; i--) {
				if (anArray[i].layer === layer) {
					return false;
				}
			}

			return !!(layer.__parent && layer.__parent._group === this) || this._nonPointGroup.hasLayer(layer);
		},

		//Zoom down to show the given layer (spiderfying if necessary) then calls the callback
		zoomToShowLayer: function (layer, callback) {

			var map = this._map;

			if (typeof callback !== 'function') {
				callback = function () {};
			}

			var showMarker = function () {
				// Assumes that map.hasLayer checks for direct appearance on map, not recursively calling
				// hasLayer on Layer Groups that are on map (typically not calling this MarkerClusterGroup.hasLayer, which would always return true)
				if ((map.hasLayer(layer) || map.hasLayer(layer.__parent)) && !this._inZoomAnimation) {
					this._map.off('moveend', showMarker, this);
					this.off('animationend', showMarker, this);

					if (map.hasLayer(layer)) {
						callback();
					} else if (layer.__parent._icon) {
						this.once('spiderfied', callback, this);
						layer.__parent.spiderfy();
					}
				}
			};

			if (layer._icon && this._map.getBounds().contains(layer.getLatLng())) {
				//Layer is visible ond on screen, immediate return
				callback();
			} else if (layer.__parent._zoom < Math.round(this._map._zoom)) {
				//Layer should be visible at this zoom level. It must not be on screen so just pan over to it
				this._map.on('moveend', showMarker, this);
				this._map.panTo(layer.getLatLng());
			} else {
				this._map.on('moveend', showMarker, this);
				this.on('animationend', showMarker, this);
				layer.__parent.zoomToBounds();
			}
		},

		//Overrides FeatureGroup.onAdd
		onAdd: function (map) {
			this._map = map;
			var i, l, layer;

			if (!isFinite(this._map.getMaxZoom())) {
				throw "Map has no maxZoom specified";
			}

			this._featureGroup.addTo(map);
			this._nonPointGroup.addTo(map);

			if (!this._gridClusters) {
				this._generateInitialClusters();
			}

			this._maxLat = map.options.crs.projection.MAX_LATITUDE;

			//Restore all the positions as they are in the MCG before removing them
			for (i = 0, l = this._needsRemoving.length; i < l; i++) {
				layer = this._needsRemoving[i];
				layer.newlatlng = layer.layer._latlng;
				layer.layer._latlng = layer.latlng;
			}
			//Remove them, then restore their new positions
			for (i = 0, l = this._needsRemoving.length; i < l; i++) {
				layer = this._needsRemoving[i];
				this._removeLayer(layer.layer, true);
				layer.layer._latlng = layer.newlatlng;
			}
			this._needsRemoving = [];

			//Remember the current zoom level and bounds
			this._zoom = Math.round(this._map._zoom);
			this._currentShownBounds = this._getExpandedVisibleBounds();

			this._map.on('zoomend', this._zoomEnd, this);
			this._map.on('moveend', this._moveEnd, this);

			if (this._spiderfierOnAdd) { //TODO FIXME: Not sure how to have spiderfier add something on here nicely
				this._spiderfierOnAdd();
			}

			this._bindEvents();

			//Actually add our markers to the map:
			l = this._needsClustering;
			this._needsClustering = [];
			this.addLayers(l, true);
		},

		//Overrides FeatureGroup.onRemove
		onRemove: function (map) {
			map.off('zoomend', this._zoomEnd, this);
			map.off('moveend', this._moveEnd, this);

			this._unbindEvents();

			//In case we are in a cluster animation
			this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '');

			if (this._spiderfierOnRemove) { //TODO FIXME: Not sure how to have spiderfier add something on here nicely
				this._spiderfierOnRemove();
			}

			delete this._maxLat;

			//Clean up all the layers we added to the map
			this._hideCoverage();
			this._featureGroup.remove();
			this._nonPointGroup.remove();

			this._featureGroup.clearLayers();

			this._map = null;
		},

		getVisibleParent: function (marker) {
			var vMarker = marker;
			while (vMarker && !vMarker._icon) {
				vMarker = vMarker.__parent;
			}
			return vMarker || null;
		},

		//Remove the given object from the given array
		_arraySplice: function (anArray, obj) {
			for (var i = anArray.length - 1; i >= 0; i--) {
				if (anArray[i] === obj) {
					anArray.splice(i, 1);
					return true;
				}
			}
		},

		/**
		 * Removes a marker from all _gridUnclustered zoom levels, starting at the supplied zoom.
		 * @param marker to be removed from _gridUnclustered.
		 * @param z integer bottom start zoom level (included)
		 * @private
		 */
		_removeFromGridUnclustered: function (marker, z) {
			var map = this._map,
			    gridUnclustered = this._gridUnclustered,
				minZoom = Math.floor(this._map.getMinZoom());

			for (; z >= minZoom; z--) {
				if (!gridUnclustered[z].removeObject(marker, map.project(marker.getLatLng(), z))) {
					break;
				}
			}
		},

		_childMarkerDragStart: function (e) {
			e.target.__dragStart = e.target._latlng;
		},

		_childMarkerMoved: function (e) {
			if (!this._ignoreMove && !e.target.__dragStart) {
				var isPopupOpen = e.target._popup && e.target._popup.isOpen();

				this._moveChild(e.target, e.oldLatLng, e.latlng);

				if (isPopupOpen) {
					e.target.openPopup();
				}
			}
		},

		_moveChild: function (layer, from, to) {
			layer._latlng = from;
			this.removeLayer(layer);

			layer._latlng = to;
			this.addLayer(layer);
		},

		_childMarkerDragEnd: function (e) {
			var dragStart = e.target.__dragStart;
			delete e.target.__dragStart;
			if (dragStart) {
				this._moveChild(e.target, dragStart, e.target._latlng);
			}		
		},


		//Internal function for removing a marker from everything.
		//dontUpdateMap: set to true if you will handle updating the map manually (for bulk functions)
		_removeLayer: function (marker, removeFromDistanceGrid, dontUpdateMap) {
			var gridClusters = this._gridClusters,
				gridUnclustered = this._gridUnclustered,
				fg = this._featureGroup,
				map = this._map,
				minZoom = Math.floor(this._map.getMinZoom());

			//Remove the marker from distance clusters it might be in
			if (removeFromDistanceGrid) {
				this._removeFromGridUnclustered(marker, this._maxZoom);
			}

			//Work our way up the clusters removing them as we go if required
			var cluster = marker.__parent,
				markers = cluster._markers,
				otherMarker;

			//Remove the marker from the immediate parents marker list
			this._arraySplice(markers, marker);

			while (cluster) {
				cluster._childCount--;
				cluster._boundsNeedUpdate = true;

				if (cluster._zoom < minZoom) {
					//Top level, do nothing
					break;
				} else if (removeFromDistanceGrid && cluster._childCount <= 1) { //Cluster no longer required
					//We need to push the other marker up to the parent
					otherMarker = cluster._markers[0] === marker ? cluster._markers[1] : cluster._markers[0];

					//Update distance grid
					gridClusters[cluster._zoom].removeObject(cluster, map.project(cluster._cLatLng, cluster._zoom));
					gridUnclustered[cluster._zoom].addObject(otherMarker, map.project(otherMarker.getLatLng(), cluster._zoom));

					//Move otherMarker up to parent
					this._arraySplice(cluster.__parent._childClusters, cluster);
					cluster.__parent._markers.push(otherMarker);
					otherMarker.__parent = cluster.__parent;

					if (cluster._icon) {
						//Cluster is currently on the map, need to put the marker on the map instead
						fg.removeLayer(cluster);
						if (!dontUpdateMap) {
							fg.addLayer(otherMarker);
						}
					}
				} else {
					cluster._iconNeedsUpdate = true;
				}

				cluster = cluster.__parent;
			}

			delete marker.__parent;
		},

		_isOrIsParent: function (el, oel) {
			while (oel) {
				if (el === oel) {
					return true;
				}
				oel = oel.parentNode;
			}
			return false;
		},

		//Override L.Evented.fire
		fire: function (type, data, propagate) {
			if (data && data.layer instanceof L.MarkerCluster) {
				//Prevent multiple clustermouseover/off events if the icon is made up of stacked divs (Doesn't work in ie <= 8, no relatedTarget)
				if (data.originalEvent && this._isOrIsParent(data.layer._icon, data.originalEvent.relatedTarget)) {
					return;
				}
				type = 'cluster' + type;
			}

			L.FeatureGroup.prototype.fire.call(this, type, data, propagate);
		},

		//Override L.Evented.listens
		listens: function (type, propagate) {
			return L.FeatureGroup.prototype.listens.call(this, type, propagate) || L.FeatureGroup.prototype.listens.call(this, 'cluster' + type, propagate);
		},

		//Default functionality
		_defaultIconCreateFunction: function (cluster) {
			var childCount = cluster.getChildCount();

			var c = ' marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
		},

		_bindEvents: function () {
			var map = this._map,
			    spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
			    showCoverageOnHover = this.options.showCoverageOnHover,
			    zoomToBoundsOnClick = this.options.zoomToBoundsOnClick,
			    spiderfyOnEveryZoom = this.options.spiderfyOnEveryZoom;

			//Zoom on cluster click or spiderfy if we are at the lowest level
			if (spiderfyOnMaxZoom || zoomToBoundsOnClick || spiderfyOnEveryZoom) {
				this.on('clusterclick clusterkeypress', this._zoomOrSpiderfy, this);
			}

			//Show convex hull (boundary) polygon on mouse over
			if (showCoverageOnHover) {
				this.on('clustermouseover', this._showCoverage, this);
				this.on('clustermouseout', this._hideCoverage, this);
				map.on('zoomend', this._hideCoverage, this);
			}
		},

		_zoomOrSpiderfy: function (e) {
			var cluster = e.layer,
			    bottomCluster = cluster;

			if (e.type === 'clusterkeypress' && e.originalEvent && e.originalEvent.keyCode !== 13) {
				return;
			}

			while (bottomCluster._childClusters.length === 1) {
				bottomCluster = bottomCluster._childClusters[0];
			}

			if (bottomCluster._zoom === this._maxZoom &&
				bottomCluster._childCount === cluster._childCount &&
				this.options.spiderfyOnMaxZoom) {

				// All child markers are contained in a single cluster from this._maxZoom to this cluster.
				cluster.spiderfy();
			} else if (this.options.zoomToBoundsOnClick) {
				cluster.zoomToBounds();
			}

			if (this.options.spiderfyOnEveryZoom) {
				cluster.spiderfy();
			}

			// Focus the map again for keyboard users.
			if (e.originalEvent && e.originalEvent.keyCode === 13) {
				this._map._container.focus();
			}
		},

		_showCoverage: function (e) {
			var map = this._map;
			if (this._inZoomAnimation) {
				return;
			}
			if (this._shownPolygon) {
				map.removeLayer(this._shownPolygon);
			}
			if (e.layer.getChildCount() > 2 && e.layer !== this._spiderfied) {
				this._shownPolygon = new L.Polygon(e.layer.getConvexHull(), this.options.polygonOptions);
				map.addLayer(this._shownPolygon);
			}
		},

		_hideCoverage: function () {
			if (this._shownPolygon) {
				this._map.removeLayer(this._shownPolygon);
				this._shownPolygon = null;
			}
		},

		_unbindEvents: function () {
			var spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
				showCoverageOnHover = this.options.showCoverageOnHover,
				zoomToBoundsOnClick = this.options.zoomToBoundsOnClick,
				spiderfyOnEveryZoom = this.options.spiderfyOnEveryZoom,
				map = this._map;

			if (spiderfyOnMaxZoom || zoomToBoundsOnClick || spiderfyOnEveryZoom) {
				this.off('clusterclick clusterkeypress', this._zoomOrSpiderfy, this);
			}
			if (showCoverageOnHover) {
				this.off('clustermouseover', this._showCoverage, this);
				this.off('clustermouseout', this._hideCoverage, this);
				map.off('zoomend', this._hideCoverage, this);
			}
		},

		_zoomEnd: function () {
			if (!this._map) { //May have been removed from the map by a zoomEnd handler
				return;
			}
			this._mergeSplitClusters();

			this._zoom = Math.round(this._map._zoom);
			this._currentShownBounds = this._getExpandedVisibleBounds();
		},

		_moveEnd: function () {
			if (this._inZoomAnimation) {
				return;
			}

			var newBounds = this._getExpandedVisibleBounds();

			this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, newBounds);
			this._topClusterLevel._recursivelyAddChildrenToMap(null, Math.round(this._map._zoom), newBounds);

			this._currentShownBounds = newBounds;
			return;
		},

		_generateInitialClusters: function () {
			var maxZoom = Math.ceil(this._map.getMaxZoom()),
				minZoom = Math.floor(this._map.getMinZoom()),
				radius = this.options.maxClusterRadius,
				radiusFn = radius;

			//If we just set maxClusterRadius to a single number, we need to create
			//a simple function to return that number. Otherwise, we just have to
			//use the function we've passed in.
			if (typeof radius !== "function") {
				radiusFn = function () { return radius; };
			}

			if (this.options.disableClusteringAtZoom !== null) {
				maxZoom = this.options.disableClusteringAtZoom - 1;
			}
			this._maxZoom = maxZoom;
			this._gridClusters = {};
			this._gridUnclustered = {};

			//Set up DistanceGrids for each zoom
			for (var zoom = maxZoom; zoom >= minZoom; zoom--) {
				this._gridClusters[zoom] = new L.DistanceGrid(radiusFn(zoom));
				this._gridUnclustered[zoom] = new L.DistanceGrid(radiusFn(zoom));
			}

			// Instantiate the appropriate L.MarkerCluster class (animated or not).
			this._topClusterLevel = new this._markerCluster(this, minZoom - 1);
		},

		//Zoom: Zoom to start adding at (Pass this._maxZoom to start at the bottom)
		_addLayer: function (layer, zoom) {
			var gridClusters = this._gridClusters,
			    gridUnclustered = this._gridUnclustered,
				minZoom = Math.floor(this._map.getMinZoom()),
			    markerPoint, z;

			if (this.options.singleMarkerMode) {
				this._overrideMarkerIcon(layer);
			}

			layer.on(this._childMarkerEventHandlers, this);

			//Find the lowest zoom level to slot this one in
			for (; zoom >= minZoom; zoom--) {
				markerPoint = this._map.project(layer.getLatLng(), zoom); // calculate pixel position

				//Try find a cluster close by
				var closest = gridClusters[zoom].getNearObject(markerPoint);
				if (closest) {
					closest._addChild(layer);
					layer.__parent = closest;
					return;
				}

				//Try find a marker close by to form a new cluster with
				closest = gridUnclustered[zoom].getNearObject(markerPoint);
				if (closest) {
					var parent = closest.__parent;
					if (parent) {
						this._removeLayer(closest, false);
					}

					//Create new cluster with these 2 in it

					var newCluster = new this._markerCluster(this, zoom, closest, layer);
					gridClusters[zoom].addObject(newCluster, this._map.project(newCluster._cLatLng, zoom));
					closest.__parent = newCluster;
					layer.__parent = newCluster;

					//First create any new intermediate parent clusters that don't exist
					var lastParent = newCluster;
					for (z = zoom - 1; z > parent._zoom; z--) {
						lastParent = new this._markerCluster(this, z, lastParent);
						gridClusters[z].addObject(lastParent, this._map.project(closest.getLatLng(), z));
					}
					parent._addChild(lastParent);

					//Remove closest from this zoom level and any above that it is in, replace with newCluster
					this._removeFromGridUnclustered(closest, zoom);

					return;
				}

				//Didn't manage to cluster in at this zoom, record us as a marker here and continue upwards
				gridUnclustered[zoom].addObject(layer, markerPoint);
			}

			//Didn't get in anything, add us to the top
			this._topClusterLevel._addChild(layer);
			layer.__parent = this._topClusterLevel;
			return;
		},

		/**
		 * Refreshes the icon of all "dirty" visible clusters.
		 * Non-visible "dirty" clusters will be updated when they are added to the map.
		 * @private
		 */
		_refreshClustersIcons: function () {
			this._featureGroup.eachLayer(function (c) {
				if (c instanceof L.MarkerCluster && c._iconNeedsUpdate) {
					c._updateIcon();
				}
			});
		},

		//Enqueue code to fire after the marker expand/contract has happened
		_enqueue: function (fn) {
			this._queue.push(fn);
			if (!this._queueTimeout) {
				this._queueTimeout = setTimeout(L.bind(this._processQueue, this), 300);
			}
		},
		_processQueue: function () {
			for (var i = 0; i < this._queue.length; i++) {
				this._queue[i].call(this);
			}
			this._queue.length = 0;
			clearTimeout(this._queueTimeout);
			this._queueTimeout = null;
		},

		//Merge and split any existing clusters that are too big or small
		_mergeSplitClusters: function () {
			var mapZoom = Math.round(this._map._zoom);

			//In case we are starting to split before the animation finished
			this._processQueue();

			if (this._zoom < mapZoom && this._currentShownBounds.intersects(this._getExpandedVisibleBounds())) { //Zoom in, split
				this._animationStart();
				//Remove clusters now off screen
				this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, this._getExpandedVisibleBounds());

				this._animationZoomIn(this._zoom, mapZoom);

			} else if (this._zoom > mapZoom) { //Zoom out, merge
				this._animationStart();

				this._animationZoomOut(this._zoom, mapZoom);
			} else {
				this._moveEnd();
			}
		},

		//Gets the maps visible bounds expanded in each direction by the size of the screen (so the user cannot see an area we do not cover in one pan)
		_getExpandedVisibleBounds: function () {
			if (!this.options.removeOutsideVisibleBounds) {
				return this._mapBoundsInfinite;
			} else if (L.Browser.mobile) {
				return this._checkBoundsMaxLat(this._map.getBounds());
			}

			return this._checkBoundsMaxLat(this._map.getBounds().pad(1)); // Padding expands the bounds by its own dimensions but scaled with the given factor.
		},

		/**
		 * Expands the latitude to Infinity (or -Infinity) if the input bounds reach the map projection maximum defined latitude
		 * (in the case of Web/Spherical Mercator, it is 85.0511287798 / see https://en.wikipedia.org/wiki/Web_Mercator#Formulas).
		 * Otherwise, the removeOutsideVisibleBounds option will remove markers beyond that limit, whereas the same markers without
		 * this option (or outside MCG) will have their position floored (ceiled) by the projection and rendered at that limit,
		 * making the user think that MCG "eats" them and never displays them again.
		 * @param bounds L.LatLngBounds
		 * @returns {L.LatLngBounds}
		 * @private
		 */
		_checkBoundsMaxLat: function (bounds) {
			var maxLat = this._maxLat;

			if (maxLat !== undefined) {
				if (bounds.getNorth() >= maxLat) {
					bounds._northEast.lat = Infinity;
				}
				if (bounds.getSouth() <= -maxLat) {
					bounds._southWest.lat = -Infinity;
				}
			}

			return bounds;
		},

		//Shared animation code
		_animationAddLayerNonAnimated: function (layer, newCluster) {
			if (newCluster === layer) {
				this._featureGroup.addLayer(layer);
			} else if (newCluster._childCount === 2) {
				newCluster._addToMap();

				var markers = newCluster.getAllChildMarkers();
				this._featureGroup.removeLayer(markers[0]);
				this._featureGroup.removeLayer(markers[1]);
			} else {
				newCluster._updateIcon();
			}
		},

		/**
		 * Extracts individual (i.e. non-group) layers from a Layer Group.
		 * @param group to extract layers from.
		 * @param output {Array} in which to store the extracted layers.
		 * @returns {*|Array}
		 * @private
		 */
		_extractNonGroupLayers: function (group, output) {
			var layers = group.getLayers(),
			    i = 0,
			    layer;

			output = output || [];

			for (; i < layers.length; i++) {
				layer = layers[i];

				if (layer instanceof L.LayerGroup) {
					this._extractNonGroupLayers(layer, output);
					continue;
				}

				output.push(layer);
			}

			return output;
		},

		/**
		 * Implements the singleMarkerMode option.
		 * @param layer Marker to re-style using the Clusters iconCreateFunction.
		 * @returns {L.Icon} The newly created icon.
		 * @private
		 */
		_overrideMarkerIcon: function (layer) {
			var icon = layer.options.icon = this.options.iconCreateFunction({
				getChildCount: function () {
					return 1;
				},
				getAllChildMarkers: function () {
					return [layer];
				}
			});

			return icon;
		}
	});

	// Constant bounds used in case option "removeOutsideVisibleBounds" is set to false.
	L.MarkerClusterGroup.include({
		_mapBoundsInfinite: new L.LatLngBounds(new L.LatLng(-Infinity, -Infinity), new L.LatLng(Infinity, Infinity))
	});

	L.MarkerClusterGroup.include({
		_noAnimation: {
			//Non Animated versions of everything
			_animationStart: function () {
				//Do nothing...
			},
			_animationZoomIn: function (previousZoomLevel, newZoomLevel) {
				this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), previousZoomLevel);
				this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());

				//We didn't actually animate, but we use this event to mean "clustering animations have finished"
				this.fire('animationend');
			},
			_animationZoomOut: function (previousZoomLevel, newZoomLevel) {
				this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), previousZoomLevel);
				this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());

				//We didn't actually animate, but we use this event to mean "clustering animations have finished"
				this.fire('animationend');
			},
			_animationAddLayer: function (layer, newCluster) {
				this._animationAddLayerNonAnimated(layer, newCluster);
			}
		},

		_withAnimation: {
			//Animated versions here
			_animationStart: function () {
				this._map._mapPane.className += ' leaflet-cluster-anim';
				this._inZoomAnimation++;
			},

			_animationZoomIn: function (previousZoomLevel, newZoomLevel) {
				var bounds = this._getExpandedVisibleBounds(),
				    fg = this._featureGroup,
					minZoom = Math.floor(this._map.getMinZoom()),
				    i;

				this._ignoreMove = true;

				//Add all children of current clusters to map and remove those clusters from map
				this._topClusterLevel._recursively(bounds, previousZoomLevel, minZoom, function (c) {
					var startPos = c._latlng,
					    markers  = c._markers,
					    m;

					if (!bounds.contains(startPos)) {
						startPos = null;
					}

					if (c._isSingleParent() && previousZoomLevel + 1 === newZoomLevel) { //Immediately add the new child and remove us
						fg.removeLayer(c);
						c._recursivelyAddChildrenToMap(null, newZoomLevel, bounds);
					} else {
						//Fade out old cluster
						c.clusterHide();
						c._recursivelyAddChildrenToMap(startPos, newZoomLevel, bounds);
					}

					//Remove all markers that aren't visible any more
					//TODO: Do we actually need to do this on the higher levels too?
					for (i = markers.length - 1; i >= 0; i--) {
						m = markers[i];
						if (!bounds.contains(m._latlng)) {
							fg.removeLayer(m);
						}
					}

				});

				this._forceLayout();

				//Update opacities
				this._topClusterLevel._recursivelyBecomeVisible(bounds, newZoomLevel);
				//TODO Maybe? Update markers in _recursivelyBecomeVisible
				fg.eachLayer(function (n) {
					if (!(n instanceof L.MarkerCluster) && n._icon) {
						n.clusterShow();
					}
				});

				//update the positions of the just added clusters/markers
				this._topClusterLevel._recursively(bounds, previousZoomLevel, newZoomLevel, function (c) {
					c._recursivelyRestoreChildPositions(newZoomLevel);
				});

				this._ignoreMove = false;

				//Remove the old clusters and close the zoom animation
				this._enqueue(function () {
					//update the positions of the just added clusters/markers
					this._topClusterLevel._recursively(bounds, previousZoomLevel, minZoom, function (c) {
						fg.removeLayer(c);
						c.clusterShow();
					});

					this._animationEnd();
				});
			},

			_animationZoomOut: function (previousZoomLevel, newZoomLevel) {
				this._animationZoomOutSingle(this._topClusterLevel, previousZoomLevel - 1, newZoomLevel);

				//Need to add markers for those that weren't on the map before but are now
				this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());
				//Remove markers that were on the map before but won't be now
				this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), previousZoomLevel, this._getExpandedVisibleBounds());
			},

			_animationAddLayer: function (layer, newCluster) {
				var me = this,
				    fg = this._featureGroup;

				fg.addLayer(layer);
				if (newCluster !== layer) {
					if (newCluster._childCount > 2) { //Was already a cluster

						newCluster._updateIcon();
						this._forceLayout();
						this._animationStart();

						layer._setPos(this._map.latLngToLayerPoint(newCluster.getLatLng()));
						layer.clusterHide();

						this._enqueue(function () {
							fg.removeLayer(layer);
							layer.clusterShow();

							me._animationEnd();
						});

					} else { //Just became a cluster
						this._forceLayout();

						me._animationStart();
						me._animationZoomOutSingle(newCluster, this._map.getMaxZoom(), this._zoom);
					}
				}
			}
		},

		// Private methods for animated versions.
		_animationZoomOutSingle: function (cluster, previousZoomLevel, newZoomLevel) {
			var bounds = this._getExpandedVisibleBounds(),
				minZoom = Math.floor(this._map.getMinZoom());

			//Animate all of the markers in the clusters to move to their cluster center point
			cluster._recursivelyAnimateChildrenInAndAddSelfToMap(bounds, minZoom, previousZoomLevel + 1, newZoomLevel);

			var me = this;

			//Update the opacity (If we immediately set it they won't animate)
			this._forceLayout();
			cluster._recursivelyBecomeVisible(bounds, newZoomLevel);

			//TODO: Maybe use the transition timing stuff to make this more reliable
			//When the animations are done, tidy up
			this._enqueue(function () {

				//This cluster stopped being a cluster before the timeout fired
				if (cluster._childCount === 1) {
					var m = cluster._markers[0];
					//If we were in a cluster animation at the time then the opacity and position of our child could be wrong now, so fix it
					this._ignoreMove = true;
					m.setLatLng(m.getLatLng());
					this._ignoreMove = false;
					if (m.clusterShow) {
						m.clusterShow();
					}
				} else {
					cluster._recursively(bounds, newZoomLevel, minZoom, function (c) {
						c._recursivelyRemoveChildrenFromMap(bounds, minZoom, previousZoomLevel + 1);
					});
				}
				me._animationEnd();
			});
		},

		_animationEnd: function () {
			if (this._map) {
				this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '');
			}
			this._inZoomAnimation--;
			this.fire('animationend');
		},

		//Force a browser layout of stuff in the map
		// Should apply the current opacity and location to all elements so we can update them again for an animation
		_forceLayout: function () {
			//In my testing this works, infact offsetWidth of any element seems to work.
			//Could loop all this._layers and do this for each _icon if it stops working

			L.Util.falseFn(document.body.offsetWidth);
		}
	});

	L.markerClusterGroup = function (options) {
		return new L.MarkerClusterGroup(options);
	};

	var MarkerCluster = L.MarkerCluster = L.Marker.extend({
		options: L.Icon.prototype.options,

		initialize: function (group, zoom, a, b) {

			L.Marker.prototype.initialize.call(this, a ? (a._cLatLng || a.getLatLng()) : new L.LatLng(0, 0),
	            { icon: this, pane: group.options.clusterPane });

			this._group = group;
			this._zoom = zoom;

			this._markers = [];
			this._childClusters = [];
			this._childCount = 0;
			this._iconNeedsUpdate = true;
			this._boundsNeedUpdate = true;

			this._bounds = new L.LatLngBounds();

			if (a) {
				this._addChild(a);
			}
			if (b) {
				this._addChild(b);
			}
		},

		//Recursively retrieve all child markers of this cluster
		getAllChildMarkers: function (storageArray, ignoreDraggedMarker) {
			storageArray = storageArray || [];

			for (var i = this._childClusters.length - 1; i >= 0; i--) {
				this._childClusters[i].getAllChildMarkers(storageArray, ignoreDraggedMarker);
			}

			for (var j = this._markers.length - 1; j >= 0; j--) {
				if (ignoreDraggedMarker && this._markers[j].__dragStart) {
					continue;
				}
				storageArray.push(this._markers[j]);
			}

			return storageArray;
		},

		//Returns the count of how many child markers we have
		getChildCount: function () {
			return this._childCount;
		},

		//Zoom to the minimum of showing all of the child markers, or the extents of this cluster
		zoomToBounds: function (fitBoundsOptions) {
			var childClusters = this._childClusters.slice(),
				map = this._group._map,
				boundsZoom = map.getBoundsZoom(this._bounds),
				zoom = this._zoom + 1,
				mapZoom = map.getZoom(),
				i;

			//calculate how far we need to zoom down to see all of the markers
			while (childClusters.length > 0 && boundsZoom > zoom) {
				zoom++;
				var newClusters = [];
				for (i = 0; i < childClusters.length; i++) {
					newClusters = newClusters.concat(childClusters[i]._childClusters);
				}
				childClusters = newClusters;
			}

			if (boundsZoom > zoom) {
				this._group._map.setView(this._latlng, zoom);
			} else if (boundsZoom <= mapZoom) { //If fitBounds wouldn't zoom us down, zoom us down instead
				this._group._map.setView(this._latlng, mapZoom + 1);
			} else {
				this._group._map.fitBounds(this._bounds, fitBoundsOptions);
			}
		},

		getBounds: function () {
			var bounds = new L.LatLngBounds();
			bounds.extend(this._bounds);
			return bounds;
		},

		_updateIcon: function () {
			this._iconNeedsUpdate = true;
			if (this._icon) {
				this.setIcon(this);
			}
		},

		//Cludge for Icon, we pretend to be an icon for performance
		createIcon: function () {
			if (this._iconNeedsUpdate) {
				this._iconObj = this._group.options.iconCreateFunction(this);
				this._iconNeedsUpdate = false;
			}
			return this._iconObj.createIcon();
		},
		createShadow: function () {
			return this._iconObj.createShadow();
		},


		_addChild: function (new1, isNotificationFromChild) {

			this._iconNeedsUpdate = true;

			this._boundsNeedUpdate = true;
			this._setClusterCenter(new1);

			if (new1 instanceof L.MarkerCluster) {
				if (!isNotificationFromChild) {
					this._childClusters.push(new1);
					new1.__parent = this;
				}
				this._childCount += new1._childCount;
			} else {
				if (!isNotificationFromChild) {
					this._markers.push(new1);
				}
				this._childCount++;
			}

			if (this.__parent) {
				this.__parent._addChild(new1, true);
			}
		},

		/**
		 * Makes sure the cluster center is set. If not, uses the child center if it is a cluster, or the marker position.
		 * @param child L.MarkerCluster|L.Marker that will be used as cluster center if not defined yet.
		 * @private
		 */
		_setClusterCenter: function (child) {
			if (!this._cLatLng) {
				// when clustering, take position of the first point as the cluster center
				this._cLatLng = child._cLatLng || child._latlng;
			}
		},

		/**
		 * Assigns impossible bounding values so that the next extend entirely determines the new bounds.
		 * This method avoids having to trash the previous L.LatLngBounds object and to create a new one, which is much slower for this class.
		 * As long as the bounds are not extended, most other methods would probably fail, as they would with bounds initialized but not extended.
		 * @private
		 */
		_resetBounds: function () {
			var bounds = this._bounds;

			if (bounds._southWest) {
				bounds._southWest.lat = Infinity;
				bounds._southWest.lng = Infinity;
			}
			if (bounds._northEast) {
				bounds._northEast.lat = -Infinity;
				bounds._northEast.lng = -Infinity;
			}
		},

		_recalculateBounds: function () {
			var markers = this._markers,
			    childClusters = this._childClusters,
			    latSum = 0,
			    lngSum = 0,
			    totalCount = this._childCount,
			    i, child, childLatLng, childCount;

			// Case where all markers are removed from the map and we are left with just an empty _topClusterLevel.
			if (totalCount === 0) {
				return;
			}

			// Reset rather than creating a new object, for performance.
			this._resetBounds();

			// Child markers.
			for (i = 0; i < markers.length; i++) {
				childLatLng = markers[i]._latlng;

				this._bounds.extend(childLatLng);

				latSum += childLatLng.lat;
				lngSum += childLatLng.lng;
			}

			// Child clusters.
			for (i = 0; i < childClusters.length; i++) {
				child = childClusters[i];

				// Re-compute child bounds and weighted position first if necessary.
				if (child._boundsNeedUpdate) {
					child._recalculateBounds();
				}

				this._bounds.extend(child._bounds);

				childLatLng = child._wLatLng;
				childCount = child._childCount;

				latSum += childLatLng.lat * childCount;
				lngSum += childLatLng.lng * childCount;
			}

			this._latlng = this._wLatLng = new L.LatLng(latSum / totalCount, lngSum / totalCount);

			// Reset dirty flag.
			this._boundsNeedUpdate = false;
		},

		//Set our markers position as given and add it to the map
		_addToMap: function (startPos) {
			if (startPos) {
				this._backupLatlng = this._latlng;
				this.setLatLng(startPos);
			}
			this._group._featureGroup.addLayer(this);
		},

		_recursivelyAnimateChildrenIn: function (bounds, center, maxZoom) {
			this._recursively(bounds, this._group._map.getMinZoom(), maxZoom - 1,
				function (c) {
					var markers = c._markers,
						i, m;
					for (i = markers.length - 1; i >= 0; i--) {
						m = markers[i];

						//Only do it if the icon is still on the map
						if (m._icon) {
							m._setPos(center);
							m.clusterHide();
						}
					}
				},
				function (c) {
					var childClusters = c._childClusters,
						j, cm;
					for (j = childClusters.length - 1; j >= 0; j--) {
						cm = childClusters[j];
						if (cm._icon) {
							cm._setPos(center);
							cm.clusterHide();
						}
					}
				}
			);
		},

		_recursivelyAnimateChildrenInAndAddSelfToMap: function (bounds, mapMinZoom, previousZoomLevel, newZoomLevel) {
			this._recursively(bounds, newZoomLevel, mapMinZoom,
				function (c) {
					c._recursivelyAnimateChildrenIn(bounds, c._group._map.latLngToLayerPoint(c.getLatLng()).round(), previousZoomLevel);

					//TODO: depthToAnimateIn affects _isSingleParent, if there is a multizoom we may/may not be.
					//As a hack we only do a animation free zoom on a single level zoom, if someone does multiple levels then we always animate
					if (c._isSingleParent() && previousZoomLevel - 1 === newZoomLevel) {
						c.clusterShow();
						c._recursivelyRemoveChildrenFromMap(bounds, mapMinZoom, previousZoomLevel); //Immediately remove our children as we are replacing them. TODO previousBounds not bounds
					} else {
						c.clusterHide();
					}

					c._addToMap();
				}
			);
		},

		_recursivelyBecomeVisible: function (bounds, zoomLevel) {
			this._recursively(bounds, this._group._map.getMinZoom(), zoomLevel, null, function (c) {
				c.clusterShow();
			});
		},

		_recursivelyAddChildrenToMap: function (startPos, zoomLevel, bounds) {
			this._recursively(bounds, this._group._map.getMinZoom() - 1, zoomLevel,
				function (c) {
					if (zoomLevel === c._zoom) {
						return;
					}

					//Add our child markers at startPos (so they can be animated out)
					for (var i = c._markers.length - 1; i >= 0; i--) {
						var nm = c._markers[i];

						if (!bounds.contains(nm._latlng)) {
							continue;
						}

						if (startPos) {
							nm._backupLatlng = nm.getLatLng();

							nm.setLatLng(startPos);
							if (nm.clusterHide) {
								nm.clusterHide();
							}
						}

						c._group._featureGroup.addLayer(nm);
					}
				},
				function (c) {
					c._addToMap(startPos);
				}
			);
		},

		_recursivelyRestoreChildPositions: function (zoomLevel) {
			//Fix positions of child markers
			for (var i = this._markers.length - 1; i >= 0; i--) {
				var nm = this._markers[i];
				if (nm._backupLatlng) {
					nm.setLatLng(nm._backupLatlng);
					delete nm._backupLatlng;
				}
			}

			if (zoomLevel - 1 === this._zoom) {
				//Reposition child clusters
				for (var j = this._childClusters.length - 1; j >= 0; j--) {
					this._childClusters[j]._restorePosition();
				}
			} else {
				for (var k = this._childClusters.length - 1; k >= 0; k--) {
					this._childClusters[k]._recursivelyRestoreChildPositions(zoomLevel);
				}
			}
		},

		_restorePosition: function () {
			if (this._backupLatlng) {
				this.setLatLng(this._backupLatlng);
				delete this._backupLatlng;
			}
		},

		//exceptBounds: If set, don't remove any markers/clusters in it
		_recursivelyRemoveChildrenFromMap: function (previousBounds, mapMinZoom, zoomLevel, exceptBounds) {
			var m, i;
			this._recursively(previousBounds, mapMinZoom - 1, zoomLevel - 1,
				function (c) {
					//Remove markers at every level
					for (i = c._markers.length - 1; i >= 0; i--) {
						m = c._markers[i];
						if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
							c._group._featureGroup.removeLayer(m);
							if (m.clusterShow) {
								m.clusterShow();
							}
						}
					}
				},
				function (c) {
					//Remove child clusters at just the bottom level
					for (i = c._childClusters.length - 1; i >= 0; i--) {
						m = c._childClusters[i];
						if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
							c._group._featureGroup.removeLayer(m);
							if (m.clusterShow) {
								m.clusterShow();
							}
						}
					}
				}
			);
		},

		//Run the given functions recursively to this and child clusters
		// boundsToApplyTo: a L.LatLngBounds representing the bounds of what clusters to recurse in to
		// zoomLevelToStart: zoom level to start running functions (inclusive)
		// zoomLevelToStop: zoom level to stop running functions (inclusive)
		// runAtEveryLevel: function that takes an L.MarkerCluster as an argument that should be applied on every level
		// runAtBottomLevel: function that takes an L.MarkerCluster as an argument that should be applied at only the bottom level
		_recursively: function (boundsToApplyTo, zoomLevelToStart, zoomLevelToStop, runAtEveryLevel, runAtBottomLevel) {
			var childClusters = this._childClusters,
			    zoom = this._zoom,
			    i, c;

			if (zoomLevelToStart <= zoom) {
				if (runAtEveryLevel) {
					runAtEveryLevel(this);
				}
				if (runAtBottomLevel && zoom === zoomLevelToStop) {
					runAtBottomLevel(this);
				}
			}

			if (zoom < zoomLevelToStart || zoom < zoomLevelToStop) {
				for (i = childClusters.length - 1; i >= 0; i--) {
					c = childClusters[i];
					if (c._boundsNeedUpdate) {
						c._recalculateBounds();
					}
					if (boundsToApplyTo.intersects(c._bounds)) {
						c._recursively(boundsToApplyTo, zoomLevelToStart, zoomLevelToStop, runAtEveryLevel, runAtBottomLevel);
					}
				}
			}
		},

		//Returns true if we are the parent of only one cluster and that cluster is the same as us
		_isSingleParent: function () {
			//Don't need to check this._markers as the rest won't work if there are any
			return this._childClusters.length > 0 && this._childClusters[0]._childCount === this._childCount;
		}
	});

	/*
	* Extends L.Marker to include two extra methods: clusterHide and clusterShow.
	* 
	* They work as setOpacity(0) and setOpacity(1) respectively, but
	* don't overwrite the options.opacity
	* 
	*/

	L.Marker.include({
		clusterHide: function () {
			var backup = this.options.opacity;
			this.setOpacity(0);
			this.options.opacity = backup;
			return this;
		},
		
		clusterShow: function () {
			return this.setOpacity(this.options.opacity);
		}
	});

	L.DistanceGrid = function (cellSize) {
		this._cellSize = cellSize;
		this._sqCellSize = cellSize * cellSize;
		this._grid = {};
		this._objectPoint = { };
	};

	L.DistanceGrid.prototype = {

		addObject: function (obj, point) {
			var x = this._getCoord(point.x),
			    y = this._getCoord(point.y),
			    grid = this._grid,
			    row = grid[y] = grid[y] || {},
			    cell = row[x] = row[x] || [],
			    stamp = L.Util.stamp(obj);

			this._objectPoint[stamp] = point;

			cell.push(obj);
		},

		updateObject: function (obj, point) {
			this.removeObject(obj);
			this.addObject(obj, point);
		},

		//Returns true if the object was found
		removeObject: function (obj, point) {
			var x = this._getCoord(point.x),
			    y = this._getCoord(point.y),
			    grid = this._grid,
			    row = grid[y] = grid[y] || {},
			    cell = row[x] = row[x] || [],
			    i, len;

			delete this._objectPoint[L.Util.stamp(obj)];

			for (i = 0, len = cell.length; i < len; i++) {
				if (cell[i] === obj) {

					cell.splice(i, 1);

					if (len === 1) {
						delete row[x];
					}

					return true;
				}
			}

		},

		eachObject: function (fn, context) {
			var i, j, k, len, row, cell, removed,
			    grid = this._grid;

			for (i in grid) {
				row = grid[i];

				for (j in row) {
					cell = row[j];

					for (k = 0, len = cell.length; k < len; k++) {
						removed = fn.call(context, cell[k]);
						if (removed) {
							k--;
							len--;
						}
					}
				}
			}
		},

		getNearObject: function (point) {
			var x = this._getCoord(point.x),
			    y = this._getCoord(point.y),
			    i, j, k, row, cell, len, obj, dist,
			    objectPoint = this._objectPoint,
			    closestDistSq = this._sqCellSize,
			    closest = null;

			for (i = y - 1; i <= y + 1; i++) {
				row = this._grid[i];
				if (row) {

					for (j = x - 1; j <= x + 1; j++) {
						cell = row[j];
						if (cell) {

							for (k = 0, len = cell.length; k < len; k++) {
								obj = cell[k];
								dist = this._sqDist(objectPoint[L.Util.stamp(obj)], point);
								if (dist < closestDistSq ||
									dist <= closestDistSq && closest === null) {
									closestDistSq = dist;
									closest = obj;
								}
							}
						}
					}
				}
			}
			return closest;
		},

		_getCoord: function (x) {
			var coord = Math.floor(x / this._cellSize);
			return isFinite(coord) ? coord : x;
		},

		_sqDist: function (p, p2) {
			var dx = p2.x - p.x,
			    dy = p2.y - p.y;
			return dx * dx + dy * dy;
		}
	};

	/* Copyright (c) 2012 the authors listed at the following URL, and/or
	the authors of referenced articles or incorporated external code:
	http://en.literateprograms.org/Quickhull_(Javascript)?action=history&offset=20120410175256

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	Retrieved from: http://en.literateprograms.org/Quickhull_(Javascript)?oldid=18434
	*/

	(function () {
		L.QuickHull = {

			/*
			 * @param {Object} cpt a point to be measured from the baseline
			 * @param {Array} bl the baseline, as represented by a two-element
			 *   array of latlng objects.
			 * @returns {Number} an approximate distance measure
			 */
			getDistant: function (cpt, bl) {
				var vY = bl[1].lat - bl[0].lat,
					vX = bl[0].lng - bl[1].lng;
				return (vX * (cpt.lat - bl[0].lat) + vY * (cpt.lng - bl[0].lng));
			},

			/*
			 * @param {Array} baseLine a two-element array of latlng objects
			 *   representing the baseline to project from
			 * @param {Array} latLngs an array of latlng objects
			 * @returns {Object} the maximum point and all new points to stay
			 *   in consideration for the hull.
			 */
			findMostDistantPointFromBaseLine: function (baseLine, latLngs) {
				var maxD = 0,
					maxPt = null,
					newPoints = [],
					i, pt, d;

				for (i = latLngs.length - 1; i >= 0; i--) {
					pt = latLngs[i];
					d = this.getDistant(pt, baseLine);

					if (d > 0) {
						newPoints.push(pt);
					} else {
						continue;
					}

					if (d > maxD) {
						maxD = d;
						maxPt = pt;
					}
				}

				return { maxPoint: maxPt, newPoints: newPoints };
			},


			/*
			 * Given a baseline, compute the convex hull of latLngs as an array
			 * of latLngs.
			 *
			 * @param {Array} latLngs
			 * @returns {Array}
			 */
			buildConvexHull: function (baseLine, latLngs) {
				var convexHullBaseLines = [],
					t = this.findMostDistantPointFromBaseLine(baseLine, latLngs);

				if (t.maxPoint) { // if there is still a point "outside" the base line
					convexHullBaseLines =
						convexHullBaseLines.concat(
							this.buildConvexHull([baseLine[0], t.maxPoint], t.newPoints)
						);
					convexHullBaseLines =
						convexHullBaseLines.concat(
							this.buildConvexHull([t.maxPoint, baseLine[1]], t.newPoints)
						);
					return convexHullBaseLines;
				} else {  // if there is no more point "outside" the base line, the current base line is part of the convex hull
					return [baseLine[0]];
				}
			},

			/*
			 * Given an array of latlngs, compute a convex hull as an array
			 * of latlngs
			 *
			 * @param {Array} latLngs
			 * @returns {Array}
			 */
			getConvexHull: function (latLngs) {
				// find first baseline
				var maxLat = false, minLat = false,
					maxLng = false, minLng = false,
					maxLatPt = null, minLatPt = null,
					maxLngPt = null, minLngPt = null,
					maxPt = null, minPt = null,
					i;

				for (i = latLngs.length - 1; i >= 0; i--) {
					var pt = latLngs[i];
					if (maxLat === false || pt.lat > maxLat) {
						maxLatPt = pt;
						maxLat = pt.lat;
					}
					if (minLat === false || pt.lat < minLat) {
						minLatPt = pt;
						minLat = pt.lat;
					}
					if (maxLng === false || pt.lng > maxLng) {
						maxLngPt = pt;
						maxLng = pt.lng;
					}
					if (minLng === false || pt.lng < minLng) {
						minLngPt = pt;
						minLng = pt.lng;
					}
				}
				
				if (minLat !== maxLat) {
					minPt = minLatPt;
					maxPt = maxLatPt;
				} else {
					minPt = minLngPt;
					maxPt = maxLngPt;
				}

				var ch = [].concat(this.buildConvexHull([minPt, maxPt], latLngs),
									this.buildConvexHull([maxPt, minPt], latLngs));
				return ch;
			}
		};
	}());

	L.MarkerCluster.include({
		getConvexHull: function () {
			var childMarkers = this.getAllChildMarkers(),
				points = [],
				p, i;

			for (i = childMarkers.length - 1; i >= 0; i--) {
				p = childMarkers[i].getLatLng();
				points.push(p);
			}

			return L.QuickHull.getConvexHull(points);
		}
	});

	//This code is 100% based on https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet
	//Huge thanks to jawj for implementing it first to make my job easy :-)

	L.MarkerCluster.include({

		_2PI: Math.PI * 2,
		_circleFootSeparation: 25, //related to circumference of circle
		_circleStartAngle: 0,

		_spiralFootSeparation:  28, //related to size of spiral (experiment!)
		_spiralLengthStart: 11,
		_spiralLengthFactor: 5,

		_circleSpiralSwitchover: 9, //show spiral instead of circle from this marker count upwards.
									// 0 -> always spiral; Infinity -> always circle

		spiderfy: function () {
			if (this._group._spiderfied === this || this._group._inZoomAnimation) {
				return;
			}

			var childMarkers = this.getAllChildMarkers(null, true),
				group = this._group,
				map = group._map,
				center = map.latLngToLayerPoint(this._latlng),
				positions;

			this._group._unspiderfy();
			this._group._spiderfied = this;

			//TODO Maybe: childMarkers order by distance to center

			if (this._group.options.spiderfyShapePositions) {
				positions = this._group.options.spiderfyShapePositions(childMarkers.length, center);
			} else if (childMarkers.length >= this._circleSpiralSwitchover) {
				positions = this._generatePointsSpiral(childMarkers.length, center);
			} else {
				center.y += 10; // Otherwise circles look wrong => hack for standard blue icon, renders differently for other icons.
				positions = this._generatePointsCircle(childMarkers.length, center);
			}

			this._animationSpiderfy(childMarkers, positions);
		},

		unspiderfy: function (zoomDetails) {
			/// <param Name="zoomDetails">Argument from zoomanim if being called in a zoom animation or null otherwise</param>
			if (this._group._inZoomAnimation) {
				return;
			}
			this._animationUnspiderfy(zoomDetails);

			this._group._spiderfied = null;
		},

		_generatePointsCircle: function (count, centerPt) {
			var circumference = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + count),
				legLength = circumference / this._2PI,  //radius from circumference
				angleStep = this._2PI / count,
				res = [],
				i, angle;

			legLength = Math.max(legLength, 35); // Minimum distance to get outside the cluster icon.

			res.length = count;

			for (i = 0; i < count; i++) { // Clockwise, like spiral.
				angle = this._circleStartAngle + i * angleStep;
				res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
			}

			return res;
		},

		_generatePointsSpiral: function (count, centerPt) {
			var spiderfyDistanceMultiplier = this._group.options.spiderfyDistanceMultiplier,
				legLength = spiderfyDistanceMultiplier * this._spiralLengthStart,
				separation = spiderfyDistanceMultiplier * this._spiralFootSeparation,
				lengthFactor = spiderfyDistanceMultiplier * this._spiralLengthFactor * this._2PI,
				angle = 0,
				res = [],
				i;

			res.length = count;

			// Higher index, closer position to cluster center.
			for (i = count; i >= 0; i--) {
				// Skip the first position, so that we are already farther from center and we avoid
				// being under the default cluster icon (especially important for Circle Markers).
				if (i < count) {
					res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
				}
				angle += separation / legLength + i * 0.0005;
				legLength += lengthFactor / angle;
			}
			return res;
		},

		_noanimationUnspiderfy: function () {
			var group = this._group,
				map = group._map,
				fg = group._featureGroup,
				childMarkers = this.getAllChildMarkers(null, true),
				m, i;

			group._ignoreMove = true;

			this.setOpacity(1);
			for (i = childMarkers.length - 1; i >= 0; i--) {
				m = childMarkers[i];

				fg.removeLayer(m);

				if (m._preSpiderfyLatlng) {
					m.setLatLng(m._preSpiderfyLatlng);
					delete m._preSpiderfyLatlng;
				}
				if (m.setZIndexOffset) {
					m.setZIndexOffset(0);
				}

				if (m._spiderLeg) {
					map.removeLayer(m._spiderLeg);
					delete m._spiderLeg;
				}
			}

			group.fire('unspiderfied', {
				cluster: this,
				markers: childMarkers
			});
			group._ignoreMove = false;
			group._spiderfied = null;
		}
	});

	//Non Animated versions of everything
	L.MarkerClusterNonAnimated = L.MarkerCluster.extend({
		_animationSpiderfy: function (childMarkers, positions) {
			var group = this._group,
				map = group._map,
				fg = group._featureGroup,
				legOptions = this._group.options.spiderLegPolylineOptions,
				i, m, leg, newPos;

			group._ignoreMove = true;

			// Traverse in ascending order to make sure that inner circleMarkers are on top of further legs. Normal markers are re-ordered by newPosition.
			// The reverse order trick no longer improves performance on modern browsers.
			for (i = 0; i < childMarkers.length; i++) {
				newPos = map.layerPointToLatLng(positions[i]);
				m = childMarkers[i];

				// Add the leg before the marker, so that in case the latter is a circleMarker, the leg is behind it.
				leg = new L.Polyline([this._latlng, newPos], legOptions);
				map.addLayer(leg);
				m._spiderLeg = leg;

				// Now add the marker.
				m._preSpiderfyLatlng = m._latlng;
				m.setLatLng(newPos);
				if (m.setZIndexOffset) {
					m.setZIndexOffset(1000000); //Make these appear on top of EVERYTHING
				}

				fg.addLayer(m);
			}
			this.setOpacity(0.3);

			group._ignoreMove = false;
			group.fire('spiderfied', {
				cluster: this,
				markers: childMarkers
			});
		},

		_animationUnspiderfy: function () {
			this._noanimationUnspiderfy();
		}
	});

	//Animated versions here
	L.MarkerCluster.include({

		_animationSpiderfy: function (childMarkers, positions) {
			var me = this,
				group = this._group,
				map = group._map,
				fg = group._featureGroup,
				thisLayerLatLng = this._latlng,
				thisLayerPos = map.latLngToLayerPoint(thisLayerLatLng),
				svg = L.Path.SVG,
				legOptions = L.extend({}, this._group.options.spiderLegPolylineOptions), // Copy the options so that we can modify them for animation.
				finalLegOpacity = legOptions.opacity,
				i, m, leg, legPath, legLength, newPos;

			if (finalLegOpacity === undefined) {
				finalLegOpacity = L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity;
			}

			if (svg) {
				// If the initial opacity of the spider leg is not 0 then it appears before the animation starts.
				legOptions.opacity = 0;

				// Add the class for CSS transitions.
				legOptions.className = (legOptions.className || '') + ' leaflet-cluster-spider-leg';
			} else {
				// Make sure we have a defined opacity.
				legOptions.opacity = finalLegOpacity;
			}

			group._ignoreMove = true;

			// Add markers and spider legs to map, hidden at our center point.
			// Traverse in ascending order to make sure that inner circleMarkers are on top of further legs. Normal markers are re-ordered by newPosition.
			// The reverse order trick no longer improves performance on modern browsers.
			for (i = 0; i < childMarkers.length; i++) {
				m = childMarkers[i];

				newPos = map.layerPointToLatLng(positions[i]);

				// Add the leg before the marker, so that in case the latter is a circleMarker, the leg is behind it.
				leg = new L.Polyline([thisLayerLatLng, newPos], legOptions);
				map.addLayer(leg);
				m._spiderLeg = leg;

				// Explanations: https://jakearchibald.com/2013/animated-line-drawing-svg/
				// In our case the transition property is declared in the CSS file.
				if (svg) {
					legPath = leg._path;
					legLength = legPath.getTotalLength() + 0.1; // Need a small extra length to avoid remaining dot in Firefox.
					legPath.style.strokeDasharray = legLength; // Just 1 length is enough, it will be duplicated.
					legPath.style.strokeDashoffset = legLength;
				}

				// If it is a marker, add it now and we'll animate it out
				if (m.setZIndexOffset) {
					m.setZIndexOffset(1000000); // Make normal markers appear on top of EVERYTHING
				}
				if (m.clusterHide) {
					m.clusterHide();
				}
				
				// Vectors just get immediately added
				fg.addLayer(m);

				if (m._setPos) {
					m._setPos(thisLayerPos);
				}
			}

			group._forceLayout();
			group._animationStart();

			// Reveal markers and spider legs.
			for (i = childMarkers.length - 1; i >= 0; i--) {
				newPos = map.layerPointToLatLng(positions[i]);
				m = childMarkers[i];

				//Move marker to new position
				m._preSpiderfyLatlng = m._latlng;
				m.setLatLng(newPos);
				
				if (m.clusterShow) {
					m.clusterShow();
				}

				// Animate leg (animation is actually delegated to CSS transition).
				if (svg) {
					leg = m._spiderLeg;
					legPath = leg._path;
					legPath.style.strokeDashoffset = 0;
					//legPath.style.strokeOpacity = finalLegOpacity;
					leg.setStyle({opacity: finalLegOpacity});
				}
			}
			this.setOpacity(0.3);

			group._ignoreMove = false;

			setTimeout(function () {
				group._animationEnd();
				group.fire('spiderfied', {
					cluster: me,
					markers: childMarkers
				});
			}, 200);
		},

		_animationUnspiderfy: function (zoomDetails) {
			var me = this,
				group = this._group,
				map = group._map,
				fg = group._featureGroup,
				thisLayerPos = zoomDetails ? map._latLngToNewLayerPoint(this._latlng, zoomDetails.zoom, zoomDetails.center) : map.latLngToLayerPoint(this._latlng),
				childMarkers = this.getAllChildMarkers(null, true),
				svg = L.Path.SVG,
				m, i, leg, legPath, legLength, nonAnimatable;

			group._ignoreMove = true;
			group._animationStart();

			//Make us visible and bring the child markers back in
			this.setOpacity(1);
			for (i = childMarkers.length - 1; i >= 0; i--) {
				m = childMarkers[i];

				//Marker was added to us after we were spiderfied
				if (!m._preSpiderfyLatlng) {
					continue;
				}

				//Close any popup on the marker first, otherwise setting the location of the marker will make the map scroll
				m.closePopup();

				//Fix up the location to the real one
				m.setLatLng(m._preSpiderfyLatlng);
				delete m._preSpiderfyLatlng;

				//Hack override the location to be our center
				nonAnimatable = true;
				if (m._setPos) {
					m._setPos(thisLayerPos);
					nonAnimatable = false;
				}
				if (m.clusterHide) {
					m.clusterHide();
					nonAnimatable = false;
				}
				if (nonAnimatable) {
					fg.removeLayer(m);
				}

				// Animate the spider leg back in (animation is actually delegated to CSS transition).
				if (svg) {
					leg = m._spiderLeg;
					legPath = leg._path;
					legLength = legPath.getTotalLength() + 0.1;
					legPath.style.strokeDashoffset = legLength;
					leg.setStyle({opacity: 0});
				}
			}

			group._ignoreMove = false;

			setTimeout(function () {
				//If we have only <= one child left then that marker will be shown on the map so don't remove it!
				var stillThereChildCount = 0;
				for (i = childMarkers.length - 1; i >= 0; i--) {
					m = childMarkers[i];
					if (m._spiderLeg) {
						stillThereChildCount++;
					}
				}


				for (i = childMarkers.length - 1; i >= 0; i--) {
					m = childMarkers[i];

					if (!m._spiderLeg) { //Has already been unspiderfied
						continue;
					}

					if (m.clusterShow) {
						m.clusterShow();
					}
					if (m.setZIndexOffset) {
						m.setZIndexOffset(0);
					}

					if (stillThereChildCount > 1) {
						fg.removeLayer(m);
					}

					map.removeLayer(m._spiderLeg);
					delete m._spiderLeg;
				}
				group._animationEnd();
				group.fire('unspiderfied', {
					cluster: me,
					markers: childMarkers
				});
			}, 200);
		}
	});


	L.MarkerClusterGroup.include({
		//The MarkerCluster currently spiderfied (if any)
		_spiderfied: null,

		unspiderfy: function () {
			this._unspiderfy.apply(this, arguments);
		},

		_spiderfierOnAdd: function () {
			this._map.on('click', this._unspiderfyWrapper, this);

			if (this._map.options.zoomAnimation) {
				this._map.on('zoomstart', this._unspiderfyZoomStart, this);
			}
			//Browsers without zoomAnimation or a big zoom don't fire zoomstart
			this._map.on('zoomend', this._noanimationUnspiderfy, this);

			if (!L.Browser.touch) {
				this._map.getRenderer(this);
				//Needs to happen in the pageload, not after, or animations don't work in webkit
				//  http://stackoverflow.com/questions/8455200/svg-animate-with-dynamically-added-elements
				//Disable on touch browsers as the animation messes up on a touch zoom and isn't very noticable
			}
		},

		_spiderfierOnRemove: function () {
			this._map.off('click', this._unspiderfyWrapper, this);
			this._map.off('zoomstart', this._unspiderfyZoomStart, this);
			this._map.off('zoomanim', this._unspiderfyZoomAnim, this);
			this._map.off('zoomend', this._noanimationUnspiderfy, this);

			//Ensure that markers are back where they should be
			// Use no animation to avoid a sticky leaflet-cluster-anim class on mapPane
			this._noanimationUnspiderfy();
		},

		//On zoom start we add a zoomanim handler so that we are guaranteed to be last (after markers are animated)
		//This means we can define the animation they do rather than Markers doing an animation to their actual location
		_unspiderfyZoomStart: function () {
			if (!this._map) { //May have been removed from the map by a zoomEnd handler
				return;
			}

			this._map.on('zoomanim', this._unspiderfyZoomAnim, this);
		},

		_unspiderfyZoomAnim: function (zoomDetails) {
			//Wait until the first zoomanim after the user has finished touch-zooming before running the animation
			if (L.DomUtil.hasClass(this._map._mapPane, 'leaflet-touching')) {
				return;
			}

			this._map.off('zoomanim', this._unspiderfyZoomAnim, this);
			this._unspiderfy(zoomDetails);
		},

		_unspiderfyWrapper: function () {
			/// <summary>_unspiderfy but passes no arguments</summary>
			this._unspiderfy();
		},

		_unspiderfy: function (zoomDetails) {
			if (this._spiderfied) {
				this._spiderfied.unspiderfy(zoomDetails);
			}
		},

		_noanimationUnspiderfy: function () {
			if (this._spiderfied) {
				this._spiderfied._noanimationUnspiderfy();
			}
		},

		//If the given layer is currently being spiderfied then we unspiderfy it so it isn't on the map anymore etc
		_unspiderfyLayer: function (layer) {
			if (layer._spiderLeg) {
				this._featureGroup.removeLayer(layer);

				if (layer.clusterShow) {
					layer.clusterShow();
				}
					//Position will be fixed up immediately in _animationUnspiderfy
				if (layer.setZIndexOffset) {
					layer.setZIndexOffset(0);
				}

				this._map.removeLayer(layer._spiderLeg);
				delete layer._spiderLeg;
			}
		}
	});

	/**
	 * Adds 1 public method to MCG and 1 to L.Marker to facilitate changing
	 * markers' icon options and refreshing their icon and their parent clusters
	 * accordingly (case where their iconCreateFunction uses data of childMarkers
	 * to make up the cluster icon).
	 */


	L.MarkerClusterGroup.include({
		/**
		 * Updates the icon of all clusters which are parents of the given marker(s).
		 * In singleMarkerMode, also updates the given marker(s) icon.
		 * @param layers L.MarkerClusterGroup|L.LayerGroup|Array(L.Marker)|Map(L.Marker)|
		 * L.MarkerCluster|L.Marker (optional) list of markers (or single marker) whose parent
		 * clusters need to be updated. If not provided, retrieves all child markers of this.
		 * @returns {L.MarkerClusterGroup}
		 */
		refreshClusters: function (layers) {
			if (!layers) {
				layers = this._topClusterLevel.getAllChildMarkers();
			} else if (layers instanceof L.MarkerClusterGroup) {
				layers = layers._topClusterLevel.getAllChildMarkers();
			} else if (layers instanceof L.LayerGroup) {
				layers = layers._layers;
			} else if (layers instanceof L.MarkerCluster) {
				layers = layers.getAllChildMarkers();
			} else if (layers instanceof L.Marker) {
				layers = [layers];
			} // else: must be an Array(L.Marker)|Map(L.Marker)
			this._flagParentsIconsNeedUpdate(layers);
			this._refreshClustersIcons();

			// In case of singleMarkerMode, also re-draw the markers.
			if (this.options.singleMarkerMode) {
				this._refreshSingleMarkerModeMarkers(layers);
			}

			return this;
		},

		/**
		 * Simply flags all parent clusters of the given markers as having a "dirty" icon.
		 * @param layers Array(L.Marker)|Map(L.Marker) list of markers.
		 * @private
		 */
		_flagParentsIconsNeedUpdate: function (layers) {
			var id, parent;

			// Assumes layers is an Array or an Object whose prototype is non-enumerable.
			for (id in layers) {
				// Flag parent clusters' icon as "dirty", all the way up.
				// Dumb process that flags multiple times upper parents, but still
				// much more efficient than trying to be smart and make short lists,
				// at least in the case of a hierarchy following a power law:
				// http://jsperf.com/flag-nodes-in-power-hierarchy/2
				parent = layers[id].__parent;
				while (parent) {
					parent._iconNeedsUpdate = true;
					parent = parent.__parent;
				}
			}
		},

		/**
		 * Re-draws the icon of the supplied markers.
		 * To be used in singleMarkerMode only.
		 * @param layers Array(L.Marker)|Map(L.Marker) list of markers.
		 * @private
		 */
		_refreshSingleMarkerModeMarkers: function (layers) {
			var id, layer;

			for (id in layers) {
				layer = layers[id];

				// Make sure we do not override markers that do not belong to THIS group.
				if (this.hasLayer(layer)) {
					// Need to re-create the icon first, then re-draw the marker.
					layer.setIcon(this._overrideMarkerIcon(layer));
				}
			}
		}
	});

	L.Marker.include({
		/**
		 * Updates the given options in the marker's icon and refreshes the marker.
		 * @param options map object of icon options.
		 * @param directlyRefreshClusters boolean (optional) true to trigger
		 * MCG.refreshClustersOf() right away with this single marker.
		 * @returns {L.Marker}
		 */
		refreshIconOptions: function (options, directlyRefreshClusters) {
			var icon = this.options.icon;

			L.setOptions(icon, options);

			this.setIcon(icon);

			// Shortcut to refresh the associated MCG clusters right away.
			// To be used when refreshing a single marker.
			// Otherwise, better use MCG.refreshClusters() once at the end with
			// the list of modified markers.
			if (directlyRefreshClusters && this.__parent) {
				this.__parent._group.refreshClusters(this);
			}

			return this;
		}
	});

	exports.MarkerClusterGroup = MarkerClusterGroup;
	exports.MarkerCluster = MarkerCluster;

	Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),

/***/ 426:
/*!********************************************************!*\
  !*** ./node_modules/leaflet/dist/images/layers-2x.png ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "layers-2x_4f0283c6ce28e888000e.png";

/***/ }),

/***/ 601:
/*!*****************************************************!*\
  !*** ./node_modules/leaflet/dist/images/layers.png ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "layers_a6137456ed160d760698.png";

/***/ }),

/***/ 927:
/*!**********************************************************!*\
  !*** ./node_modules/leaflet/dist/images/marker-icon.png ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "marker-icon_2273e3d8ad9264b7daa5.png";

/***/ }),

/***/ 676:
/*!*********************************************!*\
  !*** external "@microsoft/sp-core-library" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__676__;

/***/ }),

/***/ 909:
/*!*************************************!*\
  !*** external "@microsoft/sp-http" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__909__;

/***/ }),

/***/ 877:
/*!**********************************************!*\
  !*** external "@microsoft/sp-property-pane" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__877__;

/***/ }),

/***/ 642:
/*!*********************************************!*\
  !*** external "@microsoft/sp-webpart-base" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__642__;

/***/ }),

/***/ 973:
/*!**************************!*\
  !*** external "leaflet" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__973__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var _publicPath = __RUSHSTACK_CURRENT_SCRIPT__ ? __RUSHSTACK_CURRENT_SCRIPT__.src : '';
/******/ 		__webpack_require__.p = _publicPath.slice(0, _publicPath.lastIndexOf('/') + 1);
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./lib/webparts/webmap/WebmapWebPart.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebmapWebPart)
/* harmony export */ });
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-core-library */ 676);
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/sp-webpart-base */ 642);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_MapManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/MapManager */ 230);
/* harmony import */ var _components_ClusterManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ClusterManager */ 482);
/* harmony import */ var _components_PropertyPaneManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/PropertyPaneManager */ 105);
/* harmony import */ var _services_DataService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/DataService */ 320);
/* harmony import */ var _utils_ToastManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/ToastManager */ 776);
/* harmony import */ var _utils_Security__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/Security */ 415);
/* harmony import */ var _services_MapViewService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./services/MapViewService */ 989);
/* harmony import */ var _WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./WebmapWebPart.module.scss */ 641);
/* ========================================================================== */
/* WebmapWebPart.ts                                                           */
/* - SPFx client-side web-part                                                */
/* - Leaflet map with clustered picture markers                               */
/* - Displays images from SharePoint document libraries                       */
/* - Configurable GPS extraction method:                                      */
/*   - EXIF data extraction                                                   */
/*   - Manual coordinate fields                                               */
/* - Configurable map types:                                                  */
/*   - OpenStreetMap                                                          */
/*   - ArcGIS Web Map                                                         */
/* ========================================================================== */
// Imports from the SharePoint Framework (SPFx) libraries.
 // Used for versioning the web part.
 // The base class for all client-side web parts.
// Import managers and services







// Imports the web part's specific styles defined in a scss module.

/* ------------------------------------------------------------------ */
/* Web-part                                                           */
/* ------------------------------------------------------------------ */
// Main web part class that extends the base SharePoint web part class
class WebmapWebPart extends _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_1__.BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        // Generate a unique ID for the map container to avoid conflicts if multiple web parts are on the same page
        this.mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
    }
    /* ------------------------------------------------------------- */
    /* RENDER                                                        */
    /* ------------------------------------------------------------- */
    /**
     * The main render method called by the SPFx framework to display the web part.
     */
    render() {
        // // Initialize managers and services if not already done
        // if (!this.dataService) {
        //   this.dataService = new DataService(this.context);
        // }
        if (!this.propertyPaneManager) {
            this.propertyPaneManager = new _components_PropertyPaneManager__WEBPACK_IMPORTED_MODULE_4__.PropertyPaneManager(this.context, this.properties);
        }
        // Sets the basic HTML structure for the web part.
        // It creates a container `div` with a unique ID ('map') that Leaflet will use to initialize the map.
        // The styles.mapContainer applies CSS styling from the SCSS module
        this.domElement.innerHTML = `
      <div>
        <div id="${this.mapId}" class="${_WebmapWebPart_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].mapContainer}"></div>
      </div>
    `;
        // Calls the method to initialize the Leaflet map logic.
        this.renderMap();
    }
    /* ------------------------------------------------------------- */
    /* Map creation / refresh                                        */
    /* ------------------------------------------------------------- */
    /**
     * Initializes or refreshes the Leaflet map instance. This method handles
     * cleanup of old instances and setup of the map, layers, and events.
     */
    renderMap() {
        /* 1. Dispose previous instances */
        if (this.mapManager) {
            this.mapManager.dispose();
            this.mapManager = undefined;
        }
        if (this.clusterManager) {
            this.clusterManager.dispose();
            this.clusterManager = undefined;
        }
        /* 2. Create fresh map and cluster managers */
        this.mapManager = new _components_MapManager__WEBPACK_IMPORTED_MODULE_2__.MapManager(this.mapId);
        const map = this.mapManager.initializeMap(this.properties);
        if (!map) {
            _utils_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.show('Failed to initialize map', 'error');
            return;
        }
        this.mapViewService = new _services_MapViewService__WEBPACK_IMPORTED_MODULE_7__.MapViewService(map);
        this.mapManager.setMapViewService(this.mapViewService); // Pass MapViewService to MapManager
        // Pass MapViewService to other services
        this.dataService = new _services_DataService__WEBPACK_IMPORTED_MODULE_5__.DataService(this.context, this.mapViewService);
        /* 3. Initialize cluster manager */
        this.clusterManager = new _components_ClusterManager__WEBPACK_IMPORTED_MODULE_3__.ClusterManager(map);
        /* 4. First data load */
        this.loadMapData(); // Load the data immediately when map is created.
        // Currently commented out, but this would reload data every 30 seconds to show new images
        //this.dataTimer = window.setInterval(() => this.loadMapData(), 30_000); // And then reload every 30 seconds.
    }
    /* ------------------------------------------------------------- */
    /* Load data from map                                            */
    /* ------------------------------------------------------------- */
    /**
     * Fetches data from the configured SharePoint document library and populates the map with markers.
     */
    async loadMapData() {
        // Guard clause: do nothing if managers aren't ready.
        if (!this.clusterManager || !this.dataService || !this.mapManager)
            return;
        // Use the DataService to fetch data
        // This handles all the complexity of getting images and coordinates from SharePoint
        const result = await this.dataService.fetchMapData(this.properties);
        // Clear all old markers before adding new ones.
        // This ensures we don't have duplicate markers if data is refreshed
        this.clusterManager.clearMarkers();
        result.items.forEach((item) => {
            // Add marker to cluster
            this.clusterManager.addMarker(item.lat, item.lon, item.data, item.img);
        });
        // Show any errors that occurred during fetching
        // This helps users understand if something went wrong
        result.errors.forEach(error => {
            _utils_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.show(error, 'error');
        });
    }
    /* ------------------------------------------------------------- */
    /* Property-pane                                                 */
    /* ------------------------------------------------------------- */
    /**
     * Defines the configuration for the web part's property pane (the settings panel).
     */
    getPropertyPaneConfiguration() {
        if (!this.propertyPaneManager) {
            this.propertyPaneManager = new _components_PropertyPaneManager__WEBPACK_IMPORTED_MODULE_4__.PropertyPaneManager(this.context, this.properties);
        }
        return this.propertyPaneManager.getConfiguration();
    }
    /**
     * This SPFx lifecycle method is called when the property pane is opened.
     * It's used here to dynamically load the list of available SharePoint document libraries.
     */
    onPropertyPaneConfigurationStart() {
        if (!this.propertyPaneManager) {
            this.propertyPaneManager = new _components_PropertyPaneManager__WEBPACK_IMPORTED_MODULE_4__.PropertyPaneManager(this.context, this.properties);
        }
        this.propertyPaneManager.loadLibraries();
    }
    /**
     * This SPFx lifecycle method is called whenever a property pane field is changed by the user.
     */
    onPropertyPaneFieldChanged(path, oldValue, newValue) {
        if (!this.propertyPaneManager) {
            this.propertyPaneManager = new _components_PropertyPaneManager__WEBPACK_IMPORTED_MODULE_4__.PropertyPaneManager(this.context, this.properties);
        }
        /* Handle map type change */
        if (path === 'mapType') {
            // Clear ArcGIS URL if switching away from ArcGIS
            // This prevents confusion if user switches back later
            if (newValue !== 'project') {
                this.properties.arcgisMapUrl = '';
            }
            this.context.propertyPane.refresh(); // Refresh to show/hide ArcGIS URL field
        }
        /* Validate ArcGIS URL when it changes */
        if (path === 'arcgisMapUrl' && newValue) {
            const isValid = (0,_utils_Security__WEBPACK_IMPORTED_MODULE_9__.validateArcGISUrl)(newValue);
            if (!isValid) {
                _utils_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.show('Please enter a valid HTTPS ArcGIS URL', 'error');
            }
        }
        /* Handle location method change */
        if (path === 'locationMethod') {
            // Clear field selections when switching methods
            // This prevents confusion from having old selections when changing between EXIF and manual
            this.propertyPaneManager.clearFieldCache();
            // If switching to manual method, trigger field loading
            if (newValue === 'manual' && this.properties.libraryName) {
                // Force reload of fields
                this.propertyPaneManager.loadFields(this.properties.libraryName);
            }
            this.context.propertyPane.refresh(); // Refresh to show/hide field selectors
        }
        /* Reload field dropdowns when the library changes */
        if (path === 'libraryName' && newValue) {
            this.propertyPaneManager.loadFields(newValue);
        }
        /* Re-render map whenever any data-source field changes */
        // If any of the core data properties have changed, trigger a full re-render of the web part.
        // This ensures the map updates immediately when settings change
        if (['libraryName', 'locationMethod', 'latField', 'lonField', 'mapType', 'arcgisMapUrl', 'mapType'].indexOf(path) !== -1) {
            this.render(); // Full re-render to apply new settings
        }
    }
    /* ------------------------------------------------------------- */
    /* Clean-up                                                      */
    /* ------------------------------------------------------------- */
    /**
     * This SPFx lifecycle method is called when the web part is removed from the page.
     * It's crucial for cleaning up resources to prevent memory leaks.
     */
    onDispose() {
        var _a, _b;
        // Clean up all managers
        (_a = this.mapManager) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.clusterManager) === null || _b === void 0 ? void 0 : _b.dispose();
        this.mapViewService = undefined;
    }
    /* ------------------------------------------------------------- */
    /* SPFx boiler-plate                                             */
    /* ------------------------------------------------------------- */
    /**
     * Standard SPFx property to get the version of the data structure.
     * This helps SharePoint understand if property migrations are needed when updating the web part
     */
    get dataVersion() {
        return _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__.Version.parse('1.0');
    }
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});})();;
//# sourceMappingURL=webmap-web-part.js.map