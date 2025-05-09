import * as userModel from '../models/user.model.js';

// Controlador para obtener el perfil del usuario
export const getUserProfile = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token JWT
    const userId = req.user.id;
    
    const user = await userModel.getUserById(userId);
    
    if (user) {
      // No devolver la contraseña
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        user: userWithoutPassword
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para listar todos los usuarios (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

export default {
  getUserProfile,
  getAllUsers
};
