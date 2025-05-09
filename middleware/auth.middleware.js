import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'spa_secret_key';

// Interfaz para extender Request y agregar el usuario
// Middleware de autenticación con JWT
export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token no proporcionado'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Añadir información del usuario a la solicitud
      req.user = decoded;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token inválido'
      });
    }
  } catch (error) {
    console.error('Error en verifyToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador'
    });
  }
};

export const authMiddleware = {
  verifyToken,
  isAdmin
};
