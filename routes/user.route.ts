import express from 'express';
import userController from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Ruta para obtener perfil del usuario (protegida)
router.get('/profile', verifyToken, userController.getUserProfile);

// Ruta para listar todos los usuarios (solo admin)
router.get('/all', verifyToken, isAdmin, userController.getAllUsers);

export default router;
