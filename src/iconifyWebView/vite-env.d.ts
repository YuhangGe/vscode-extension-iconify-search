/// <reference types="vite/client" />

import type { WebviewInitData } from '../common';

/* IMAGES */
declare module '*.svg' {
  const ref: string;
  export default ref;
}

declare module '*.png' {
  const ref: string;
  export default ref;
}

export declare global {
  interface Window {
    ICONIFY_INIT_DATA: WebviewInitData;
  }
}
