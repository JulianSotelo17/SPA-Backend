import { Request, Response } from 'express';
import * as userModel from '../models/user.model';

// Controlador para login
export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña son requeridos' 
    });
    return;
  }
  
  // Buscar usuario en la BD simulada
  const user = userModel.findUserByCredentials(email, password);
  
  if (user) {
    // Simulación token JWT
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulado';
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
};

// Controlador para registro
export const register = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
    return;
  }
  
  // Verificar si el email ya existe
  if (userModel.emailExists(email)) {
    res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
    return;
  }
  
  // Crear nuevo usuario
  const newUser = userModel.createUser({ name, email, password });
  
  // Simulación token JWT
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulado';
  
  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token
  });
};

export default {
  login,
  register
};
