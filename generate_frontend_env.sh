#!/bin/sh
# Ubicación del archivo global .env (copiado en /global.env) y destino en /app/.env
GLOBAL_ENV="/global.env"
FRONTEND_ENV="/app/.env"

if [ ! -f "$GLOBAL_ENV" ]; then
  echo "No se encontró el archivo global .env en /global.env"
  exit 1
fi

# Extraer las variables que comienzan con VITE_ y escribirlas en /app/.env
grep '^VITE_' "$GLOBAL_ENV" > "$FRONTEND_ENV"
echo "Archivo $FRONTEND_ENV generado con éxito."
