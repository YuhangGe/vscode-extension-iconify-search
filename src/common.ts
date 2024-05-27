export interface ViewBox {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}
export interface Icon {
  category: string;
  id: string;
  name: string;
  body: string;
}
export interface IconCategory {
  category: string;
  name: string;
  icons: Icon[];
}

export type IconCodeType =
  | 'svg'
  | 'react'
  | 'vue'
  | 'tailwindcss'
  | 'tailwindcss-react'
  | 'iconify-icon'
  | 'unplugin-icons'
  | 'unocss'
  | 'unocss-react';

export interface SettingsData {
  favorTabs: string[];
  favorIcons: string[];
  favorGroup: string;
  codeType: IconCodeType;
}

export interface WebviewInitData extends SettingsData {
  searchText: string;
  mode: 'search' | 'view.all' | 'view.favor';
}
