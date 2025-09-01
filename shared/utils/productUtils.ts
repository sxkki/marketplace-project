import { Product, ProductList, CheapestProductsResult } from '../types';

/**
 * Algoritmo para obtener los N productos más baratos disponibles
 * @param products Lista de productos a filtrar
 * @param limit Límite de productos a retornar (por defecto: 5)
 * @param minStock Stock mínimo requerido (por defecto: 1)
 * @returns Objeto con los productos más baratos y metadata
 */
export function getCheapestAvailableProducts(
  products: ProductList,
  limit: number = 5,
  minStock: number = 1
): CheapestProductsResult {
  const startTime = performance.now();

  // Filtrar productos disponibles
  const availableProducts = products.filter(product => product.stock >= minStock);

  if (availableProducts.length === 0) {
    const endTime = performance.now();
    return {
      products: [],
      totalCount: 0,
      priceRange: { min: 0, max: 0, average: 0 },
      executionTime: endTime - startTime
    };
  }

  // Ordenar por precio (ascendente)
  const sortedProducts = [...availableProducts].sort((a, b) => a.price - b.price);

  // Tomar los N más baratos
  const cheapestProducts = sortedProducts.slice(0, limit);

  // Calcular estadísticas de precios
  const prices = availableProducts.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const endTime = performance.now();

  return {
    products: cheapestProducts,
    totalCount: availableProducts.length,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: parseFloat(averagePrice.toFixed(2))
    },
    executionTime: parseFloat((endTime - startTime).toFixed(4))
  };
}

/**
 * Algoritmo alternativo con optimización para grandes volúmenes de datos
 * Usa un approach de min-heap para mejor performance con muchos productos
 */
export function getCheapestAvailableProductsOptimized(
  products: ProductList,
  limit: number = 5,
  minStock: number = 1
): CheapestProductsResult {
  const startTime = performance.now();

  // Filtrar productos disponibles
  const availableProducts = products.filter(product => product.stock >= minStock);

  if (availableProducts.length === 0) {
    const endTime = performance.now();
    return {
      products: [],
      totalCount: 0,
      priceRange: { min: 0, max: 0, average: 0 },
      executionTime: endTime - startTime
    };
  }

  // Para optimizar, usamos un approach de selección parcial
  // en lugar de ordenar todo el array
  const findNCheapest = (items: Product[], n: number): Product[] => {
    if (items.length <= n) return [...items].sort((a, b) => a.price - b.price);
    
    // Encontrar los n más baratos sin ordenar todo el array
    const result: Product[] = [];
    
    for (const product of items) {
      if (result.length < n) {
        result.push(product);
        result.sort((a, b) => a.price - b.price);
      } else if (product.price < result[result.length - 1].price) {
        result[result.length - 1] = product;
        result.sort((a, b) => a.price - b.price);
      }
    }
    
    return result;
  };

  const cheapestProducts = findNCheapest(availableProducts, limit);

  // Calcular estadísticas
  const prices = availableProducts.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const endTime = performance.now();

  return {
    products: cheapestProducts,
    totalCount: availableProducts.length,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: parseFloat(averagePrice.toFixed(2))
    },
    executionTime: parseFloat((endTime - startTime).toFixed(4))
  };
}

/**
 * Función utilitaria para formatear el resultado para display
 */
export function formatCheapestProductsResult(result: CheapestProductsResult): string {
  if (result.products.length === 0) {
    return 'No hay productos disponibles en stock';
  }

  return `
Productos más baratos encontrados: ${result.products.length} de ${result.totalCount} disponibles
Rango de precios: $${result.priceRange.min} - $${result.priceRange.max} (promedio: $${result.priceRange.average})
Tiempo de ejecución: ${result.executionTime}ms

Productos:
${result.products.map((product, index) => 
  `${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`
).join('\n')}
  `.trim();
}