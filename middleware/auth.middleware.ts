import { Request, Response, NextFunction } from 'express';

// Interfaz para extender Request y agregar el usuario
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

// Middleware de autenticación simulado
// En una aplicación real, verificaríamos y decodificaríamos el token JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Obtener el token del header de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado'
    });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // En un entorno real, verificaríamos el token con JWT
    // jwt.verify(token, 'secretKey')
    
    // Simulación: verificar si el token tiene un formato válido
    if (token !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulado') {
      throw new Error('Token inválido');
    }
    
    // Simulación: añadir información del usuario decodificada a la solicitud
    req.user = {
      id: 1, // ID del usuario demo
      role: 'client'
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido'
    });
  }
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Asumimos que el middleware verifyToken ya ha establecido req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador'
    });
  }
};

export default {
  verifyToken,
  isAdmin
};
