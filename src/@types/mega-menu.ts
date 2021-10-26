import { ReactNode } from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

// ----------------------------------------------------------------------

type Products = {
  name: string;
  image: string;
  path: string;
};

type Tags = {
  name: string;
  path: string;
};

export type MegaMenuCarouselProps = {
  products: Products[];
  numberShow?: number;
  sx?: SxProps<Theme>;
};

export type MenuHotProductsProps = {
  tags: Tags[];
};

export type ParentItemProps = {
  title: string;
  path?: string;
  icon?: JSX.Element;
  open?: boolean;
  hasSub?: boolean;
  onClick?: VoidFunction;
  onMouseEnter?: VoidFunction;
  onMouseLeave?: VoidFunction;
  component?: ReactNode;
  to?: string;
};

export type MegaMenuItemProps = {
  title: string;
  path: string;
  icon: JSX.Element;
  more?: {
    title: string;
    path: string;
  };
  products?: Products[];
  tags?: Tags[];
  children?: {
    subheader: string;
    items: {
      title: string;
      path: string;
    }[];
  }[];
};
