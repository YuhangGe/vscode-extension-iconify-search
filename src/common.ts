export interface ViewBox {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}
export interface Icon {
  id: string;
  name: string;
  body: string;
}
export interface IconCategory {
  category: string;
  name: string;
  icons: Icon[];
}
