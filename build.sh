#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias
npm install

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar compilación
npm run start
