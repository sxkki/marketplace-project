import express from 'express';
import cors from 'cors';
import productRouter from './products.router';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/products', productRouter);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Marketplace API', 
    endpoints: {
      health: '/health',
      products: '/api/products',
      productDetail: '/api/products/:id'
    }
  });
});

// Manejo de errores
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
});