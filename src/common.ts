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

export interface Setting {
  favors?: string[];
}
export interface WebviewInitData {
  setting: Setting;
  searchText: string;
  mode: 'insert.favorites' | 'search' | 'view.all' | 'view.favorites';
}
