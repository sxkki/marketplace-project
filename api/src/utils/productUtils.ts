import { Product, ProductList, CheapestProductsResult } from '../types';

export function getCheapestAvailableProducts(
  products: ProductList,
  limit: number = 5,
  minStock: number = 1
): CheapestProductsResult {
  const startTime = Date.now();

  // Filtrar productos disponibles
  const availableProducts = products.filter(product => product.stock >= minStock);

  if (availableProducts.length === 0) {
    const endTime = Date.now();
    return {
      products: [],
      totalCount: 0,
      priceRange: { min: 0, max: 0, average: 0 },
      executionTime: endTime - startTime
    };
  }

  // Ordenar por precio (ascendente)
  const sortedProducts = [...availableProducts].sort((a, b) => a.price - b.price);
  const cheapestProducts = sortedProducts.slice(0, limit);

  // Calcular estadísticas
  const prices = availableProducts.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const endTime = Date.now();

  return {
    products: cheapestProducts,
    totalCount: availableProducts.length,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: parseFloat(averagePrice.toFixed(2))
    },
    executionTime: endTime - startTime
  };
}

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