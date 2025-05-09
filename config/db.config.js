import pgp from 'pg-promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Inicializar pg-promise
const pgpInstance = pgp();

// Configuración de conexión para entorno de desarrollo
const devConfig = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: 'railway',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production'
};

// Configuración para Railway (producción)
const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

// Usar configuración según entorno
const config = process.env.NODE_ENV === 'production' ? proConfig : devConfig;

// Crear instancia de conexión
const db = pgpInstance(config);

// Función para inicializar las tablas
export const initializeDatabase = async () => {
  try {
    // Crear tabla de usuarios si no existe
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de citas si no existe
    await db.none(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id VARCHAR(50) NOT NULL,
        service_name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar usuario de prueba si no existe
    const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1', ['user@ejemplo.com']);
    
    if (!userExists) {
      await db.none(
        'INSERT INTO users(email, password, name, role) VALUES($1, $2, $3, $4)',
        ['user@ejemplo.com', '1234', 'Usuario Ejemplo', 'client']
      );
      
      console.log('Usuario de prueba creado');
    }

    console.log('Base de datos inicializada con éxito');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
};

export default db;
