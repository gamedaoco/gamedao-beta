import { FormikProps } from 'formik';

// ----------------------------------------------------------------------

export type PaymentType = 'paypal' | 'credit_card' | 'cash';

export type ProductStatus = 'sale' | 'new' | '';

export type ProductInventoryType = 'in_stock' | 'out_of_stock' | 'low_stock';

export type ProductCategory = 'Accessories' | 'Apparel' | 'Shoes';

export type ProductGender = 'Men' | 'Women' | 'Kids';

export type OnCreateBilling = (address: BillingAddress) => void;

export type FormikPropsShopView = FormikProps<ProductFilter>;

export type ProductRating = {
  name: string;
  starCount: number;
  reviewCount: number;
};

export type ProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date | string | number;
};

export type Product = {
  id: string;
  cover: string;
  images: string[];
  name: string;
  price: number;
  code: string;
  sku: string;
  tags: string[];
  priceSale: number | null;
  totalRating: number;
  totalReview: number;
  ratings: ProductRating[];
  reviews: ProductReview[];
  colors: string[];
  status: ProductStatus;
  inventoryType: ProductInventoryType;
  sizes: string[];
  available: number;
  description: string;
  sold: number;
  createdAt: Date | string | number;
  category: ProductCategory;
  gender: ProductGender;
};

export type CartItem = {
  id: string;
  name: string;
  cover: string;
  available: number;
  price: number;
  color: string;
  size: string;
  quantity: number;
  subtotal: number;
};

export type BillingAddress = {
  receiver: string;
  phone: string;
  fullAddress: string;
  addressType: string;
  isDefault: boolean;
};

export type ProductState = {
  isLoading: boolean;
  error: boolean;
  products: Product[];
  product: Product | null;
  sortBy: string | null;
  filters: {
    gender: string[];
    category: string;
    colors: string[];
    priceRange: string;
    rating: string;
  };
  checkout: {
    activeStep: number;
    cart: CartItem[];
    subtotal: number;
    total: number;
    discount: number;
    shipping: number;
    billing: BillingAddress | null;
  };
};

export type ProductFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: string;
  rating: string;
};

export type PaymentFormikProps = FormikProps<{
  delivery: number;
  payment: string;
}>;

export type DeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
  icons: string[];
};

export type CardOption = {
  value: string;
  label: string;
};

export type Invoice = {
  id: string;
  taxes: number;
  discount: number;
  status: string;
  invoiceFrom: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  invoiceTo: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    title: string;
    description: string;
    qty: number;
    price: number;
  }[];
};
