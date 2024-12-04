export type TProducts = {
  name: string;
  price: number;
  inventory: number;
  description: string;
  image: string;
  categoryId: string;
};

export type TProductFilterRequest = {
  searchTerm?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  inventory?: number;
  flashSale?: boolean;
};
