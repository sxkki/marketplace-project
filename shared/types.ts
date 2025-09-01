export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

export type ProductList = Product[];

// Nuevos tipos para la respuesta paginada
export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string;
    sort: string;
    order: string;
    category: string;
    available: boolean | null;
  };
}


// Tipo para el resultado del algoritmo
export interface CheapestProductsResult {
  products: Product[];
  totalCount: number;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  executionTime: number;
}