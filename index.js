import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db.config.js';

// Importar rutas
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de RelaxSPA funcionando correctamente' });
});

// Inicializar la base de datos
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Base de datos inicializada correctamente');
    
    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor en ejecución en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Manejador global de errores
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error del servidor'
  });
});
