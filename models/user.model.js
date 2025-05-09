import db from '../config/db.config.js';
import bcrypt from 'bcryptjs';

// Definición de interfaces
export class User {
  id;
  email;
  password;
  name;
  role;
}

// Función para encontrar un usuario por email y password
export const findUserByCredentials = async (email, password) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    
    if (!user) {
      return null;
    }
    
    // En una aplicación real, deberíamos comparar con contraseña hasheada
    // const passwordMatch = await bcrypt.compare(password, user.password);
    
    // Por simplicidad, comparamos directamente (No hacer esto en producción real)
    const passwordMatch = (password === user.password);
    
    if (passwordMatch) {
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error en findUserByCredentials:', error);
    return null;
  }
};

// Función para verificar si un email ya existe
export const emailExists = async (email) => {
  try {
    const user = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
    return !!user;
  } catch (error) {
    console.error('Error en emailExists:', error);
    return false;
  }
};

// Función para crear un nuevo usuario
export const createUser = async (userData) => {
  try {
    // En una aplicación real, hashear la contraseña
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await db.one(
      'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *',
      [userData.name, userData.email, userData.password, userData.role || 'client']
    );
    
    return result;
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

// Función para obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error en getUserById:', error);
    return null;
  }
};

// Función para listar todos los usuarios (para propósitos administrativos)
export const getAllUsers = async () => {
  try {
    const users = await db.any('SELECT id, email, name, role FROM users');
    return users;
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return [];
  }
};
