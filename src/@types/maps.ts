export interface MapStyle {
  version: number;
  name: string;
  metadata: Metadata;
  sources: Sources;
  sprite: string;
  glyphs: string;
  layers: Layer[];
}

export interface Layer {
  id: string;
  type: Type;
  paint: Paint;
  interactive: boolean;
  source?: Source;
  sourceLayer?: string;
  filter?: LayerFilter[];
  layout?: Layout;
  minzoom?: number;
  maxzoom?: number;
}

export type LayerFilter = PurpleFilter[] | string;

export type PurpleFilter = FluffyFilter[] | string;

export type FluffyFilter = number | string;

export interface Layout {
  lineCap?: string;
  lineJoin?: string;
  iconImage?: string;
  textOffset?: number[];
  textField?: string;
  textFont?: string[];
  textMaxWidth?: number;
  textAnchor?: string;
  textSize?: TextSize;
  iconSize?: number;
  symbolPlacement?: Type;
  textTransform?: string;
  textLetterSpacing?: number;
}

export enum Type {
  Background = 'background',
  Fill = 'fill',
  Line = 'line',
  Symbol = 'symbol'
}

export type TextSize = LineGapWidth | number;

export interface LineGapWidth {
  base?: number;
  stops: Array<number[]>;
}

export interface Paint {
  backgroundColor?: string;
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineWidth?: LineGapWidth;
  lineDasharray?: number[];
  lineGapWidth?: LineGapWidth;
  textColor?: string;
  textHaloWidth?: number;
  textHaloColor?: string;
  textHaloBlur?: number;
}

export enum Source {
  Mapbox = 'mapbox'
}

export interface Metadata {
  mapboxAutocomposite: boolean;
}

export interface Sources {
  mapbox: Mapbox;
}

export interface Mapbox {
  url: string;
  type: string;
}

export type MapSettings = {
  dragPan: boolean;
  dragRotate: boolean;
  scrollZoom: boolean;
  touchZoom: boolean;
  touchRotate: boolean;
  keyboard: boolean;
  doubleClickZoom: boolean;
  minZoom: number;
  maxZoom: number;
  minPitch: number;
  maxPitch: number;
};

export type MapSettingKeys =
  | 'dragPan'
  | 'dragRotate'
  | 'scrollZoom'
  | 'touchZoom'
  | 'touchRotate'
  | 'keyboard'
  | 'doubleClickZoom'
  | 'minZoom'
  | 'maxZoom'
  | 'minPitch'
  | 'maxPitch';

export type CityData = {
  city: string;
  population: string;
  image: string;
  state: string;
  latitude: number;
  longitude: number;
};
