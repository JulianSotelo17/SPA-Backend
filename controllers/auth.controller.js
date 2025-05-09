import * as userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'spa_secret_key';

// Controlador para login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario en la base de datos
    const user = await userModel.findUserByCredentials(email, password);
    
    if (user) {
      // Generar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Devolver información del usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ 
        success: true, 
        user: userWithoutPassword,
        token
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

// Controlador para registro
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }
    
    // Verificar si el email ya existe
    const exists = await userModel.emailExists(email);
    
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este email ya está registrado' 
      });
    }
    
    // Crear usuario
    const newUser = await userModel.createUser({ name, email, password, role: 'client' });
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        role: newUser.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Devolver información del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json({ 
      success: true, 
      user: userWithoutPassword,
      token,
      message: 'Usuario registrado con éxito' 
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

export default {
  login,
  register
};
