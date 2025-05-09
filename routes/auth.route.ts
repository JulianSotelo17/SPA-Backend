import express from 'express';
import authController from '../controllers/auth.controller.js';
const router = express.Router();

// Ruta para login
router.post('/login', authController.login);

// Ruta para registro
router.post('/register', authController.register);

export default router;
