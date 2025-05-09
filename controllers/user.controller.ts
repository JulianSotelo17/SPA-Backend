import { Request, Response } from 'express';
import * as userModel from '../models/user.model';

// Interfaz para extender Request y agregar el usuario
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

// Controlador para obtener el perfil del usuario
export const getUserProfile = (req: AuthRequest, res: Response): void => {
  // En un entorno real, obtendríamos el ID del usuario desde el token decodificado
  // Asumimos que el middleware de autenticación ya ha establecido req.user
  const userId = req.user?.id || 1; // Usuario demo para simulación
  
  const user = userModel.getUserById(userId);
  
  if (user) {
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
};

// Controlador para listar todos los usuarios (admin)
export const getAllUsers = (_req: Request, res: Response): void => {
  const users = userModel.getAllUsers();
  
  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
};

export default {
  getUserProfile,
  getAllUsers
};
