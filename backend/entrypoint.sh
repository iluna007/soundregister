#!/bin/bash
set -e

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté disponible en $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Base de datos disponible. Ejecutando migraciones..."
# Ejecutar las migraciones (asegúrate de tener configurado Flask-Migrate y la carpeta migrations)
flask db upgrade

echo "Iniciando la aplicación Flask..."
# Iniciar la aplicación Flask
exec flask run --host=0.0.0.0 --port=5000
