import { Router, Request, Response } from 'express';
import { Product, ProductList } from './types';
import { getCheapestAvailableProducts, formatCheapestProductsResult } from './utils/productUtils';
import productsData from './data/products.json';

const router = Router();

// GET /api/products con todos los filtros
router.get('/', (req: Request, res: Response) => {
  try {
    const {
      search,
      sort = 'name',
      order = 'asc',
      page = '1',
      limit = '10',
      available,
      category
    } = req.query;

    // Convertir parámetros
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const availableFilter = available === 'true' ? true : available === 'false' ? false : null;

    // Filtrar productos
    let filteredProducts = productsData.filter((product: Product) => {
      // Filtro por búsqueda
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Filtro por categoría
      if (category && product.category !== category) {
        return false;
      }

      // Filtro por disponibilidad
      if (availableFilter !== null) {
        const isAvailable = product.stock > 0;
        if (isAvailable !== availableFilter) return false;
      }

      return true;
    });

    // Ordenar productos
    filteredProducts.sort((a: Product, b: Product) => {
      let aValue: any, bValue: any;
      
      switch (sort) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
        default:
          aValue = a.name;
          bValue = b.name;
          break;
      }

      if (order === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
      
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    // Paginación
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Respuesta con metadata
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredProducts.length / limitNum),
        totalProducts: filteredProducts.length,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: pageNum > 1
      },
      filters: {
        search: search || '',
        sort,
        order,
        category: category || '',
        available: availableFilter
      }
    });

  } catch (error) {
    console.error('Error in GET /api/products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener listado de productos
router.get('/', (req: Request, res: Response<ProductList>) => {
  const category = req.query.category as string;
  
  let products: ProductList = productsData;
  
  if (category) {
    products = products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.json(products);
});

// Obtener un producto por ID
router.get('/:id', (req: Request, res: Response<Product | { error: string }>) => {
  const productId = req.params.id;
  const product = productsData.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  res.json(product);
});

// Nuevo endpoint para productos más baratos
router.get('/cheapest/available', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const minStock = parseInt(req.query.minStock as string) || 1;
    const format = req.query.format as string;

    const result = getCheapestAvailableProducts(productsData as Product[], limit, minStock);

    if (format === 'text') {
      res.type('text/plain').send(formatCheapestProductsResult(result));
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error('Error in GET /api/products/cheapest/available:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;