// ----------------------------------------------------------------------

type LinkNormal = {
  title: string;
  href: string;
  leftImage: string;
  rightImage: string;
};

export type LinkComponent = {
  title: string;
  href: string;
  leftImage?: string;
  rightImage?: string;
  sublinks?: LinkNormal[];
};
