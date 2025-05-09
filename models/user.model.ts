// Definición de interfaces
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Simulación de una base de datos de usuarios en memoria
const users: User[] = [
  { id: 1, email: 'usuario@test.com', password: '123456', name: 'Usuario Demo', role: 'client' }
];

// Función para encontrar un usuario por email y password
export const findUserByCredentials = (email: string, password: string): User | undefined => {
  return users.find(user => user.email === email && user.password === password);
};

// Función para verificar si un email ya existe
export const emailExists = (email: string): boolean => {
  return users.some(user => user.email === email);
};

// Función para crear un nuevo usuario
export const createUser = (userData: CreateUserData): User => {
  const newUser: User = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'client'
  };
  
  users.push(newUser);
  return newUser;
};

// Función para obtener un usuario por ID
export const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

// Función para listar todos los usuarios (para propósitos administrativos)
export const getAllUsers = (): UserDTO[] => {
  // No devolver las contraseñas por seguridad
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  });
};

