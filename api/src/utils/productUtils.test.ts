import { getCheapestAvailableProducts, getCheapestAvailableProductsOptimized } from './productUtils';
import { Product } from '../types';

// Datos de prueba
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Producto Caro',
    description: 'Producto costoso',
    price: 1000,
    image: 'test1.jpg',
    category: 'Test',
    stock: 5,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Producto Barato',
    description: 'Producto económico',
    price: 100,
    image: 'test2.jpg',
    category: 'Test',
    stock: 0, // Sin stock
    rating: 4.0
  },
  {
    id: '3',
    name: 'Producto Medio',
    description: 'Producto de precio medio',
    price: 500,
    image: 'test3.jpg',
    category: 'Test',
    stock: 3,
    rating: 4.2
  },
  {
    id: '4',
    name: 'Producto Muy Barato',
    description: 'Producto muy económico',
    price: 50,
    image: 'test4.jpg',
    category: 'Test',
    stock: 10,
    rating: 4.8
  },
  {
    id: '5',
    name: 'Producto Sin Stock',
    description: 'Producto sin inventario',
    price: 200,
    image: 'test5.jpg',
    category: 'Test',
    stock: 0, // Sin stock
    rating: 3.5
  }
];

describe('Algoritmo de productos más baratos', () => {
  test('debe retornar los productos más baratos con stock', () => {
    const result = getCheapestAvailableProducts(mockProducts, 3);
    
    expect(result.products).toHaveLength(2); // Solo 2 productos con stock
    expect(result.products[0].price).toBe(50); // El más barato primero
    expect(result.products[1].price).toBe(500); // Luego el siguiente
    expect(result.totalCount).toBe(2); // Total de productos con stock
  });

  test('debe manejar array vacío', () => {
    const result = getCheapestAvailableProducts([], 5);
    
    expect(result.products).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });

  test('debe respetar el límite especificado', () => {
    const result = getCheapestAvailableProducts(mockProducts, 1);
    
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe('Producto Muy Barato');
  });

  test('debe calcular correctamente las estadísticas de precio', () => {
    const result = getCheapestAvailableProducts(mockProducts, 5);
    
    expect(result.priceRange.min).toBe(50);
    expect(result.priceRange.max).toBe(1000);
    expect(result.priceRange.average).toBe(525); // (1000 + 500 + 50) / 3 = 516.66
  });
});

describe('Algoritmo optimizado', () => {
  test('debe dar los mismos resultados que la versión normal', () => {
    const normalResult = getCheapestAvailableProducts(mockProducts, 3);
    const optimizedResult = getCheapestAvailableProductsOptimized(mockProducts, 3);
    
    expect(optimizedResult.products).toHaveLength(normalResult.products.length);
    expect(optimizedResult.products[0].id).toBe(normalResult.products[0].id);
    expect(optimizedResult.products[1].id).toBe(normalResult.products[1].id);
  });
});