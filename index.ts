import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/config';
// Importar rutas
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';

const app = express();
const port = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('¡API de RelaxSPA corriendo correctamente!');
});

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Manejador de rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Interfaz para los errores
interface ErrorWithStack extends Error {
  stack?: string;
}

// Manejador de errores global
app.use((err: ErrorWithStack, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor de RelaxSPA escuchando en http://localhost:${port}`);
  console.log('=== Rutas disponibles ===');
  console.log('- POST /api/auth/login    -> Inicio de sesión');
  console.log('- POST /api/auth/register -> Registro de usuarios');
  console.log('- GET  /api/user/profile  -> Perfil de usuario (protegida)');
  console.log('- GET  /api/user/all      -> Listar usuarios (admin)');
  console.log('==============================');
  console.log(`Entorno: ${config.NODE_ENV}`);
});
