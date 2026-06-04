export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  rating?: string;
  reviews?: string;
  image: string;
  description: string;
};

export type Lead = {
  id?: string;
  createdAt?: string;
  name: string;
  phone: string;
  message: string;
  product?: string;
};
