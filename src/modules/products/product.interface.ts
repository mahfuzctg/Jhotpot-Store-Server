// Product types
export type TProducts = {
  name: string;
  price: number;
  inventory: number;
  description: string;
  image: string[];  // Array of image URLs
  categoryId: string;
};

// Filter request type
export type TProductFilterRequest = {
  searchTerm?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  inventory?: number;
  flashSale?: boolean;
  category?: string;
  limit?: number;   // Pagination: how many products per page
  page?: number;    // Pagination: current page
  sortBy?: string;  // Sorting: field to sort by
  sortOrder?: 'asc' | 'desc'; // Sorting: ascending or descending
};

// Meta information for pagination
export type TMeta = {
  total: number;      // Total items count
  page: number;       // Current page number
  limit: number;      // Number of items per page
  totalPage: number;  // Total number of pages
};

// Response structure for products with pagination
export type TProductResponse = {
  data: TProducts[];  // Array of products
  meta: TMeta;        // Pagination metadata
};
