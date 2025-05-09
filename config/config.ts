// Configuración centralizada para la aplicación

interface Config {
  PORT: number;
  NODE_ENV: string;
  // En un entorno real tendríamos más configuraciones
}

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // En un entorno real tendríamos configuración para:
  // - JWT_SECRET
  // - BD_CONNECTION_STRING
  // - CORS_ORIGIN, etc.
};

export default config;
