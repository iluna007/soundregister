# Proyecto: React + Vite + Docker Compose + Postgres

Este repositorio ilustra la integración de **React** con **Vite**, **PostgreSQL**, y **Bootstrap** orquestados mediante **Docker Compose**.

## Características principales

1. **React + Vite**  
   - Se emplea Vite para un entorno de desarrollo ágil y con hot reload.  
   - Referencia: [Vite Official Docs](https://vitejs.dev/guide/).

2. **Bootstrap**  
   - Facilita el diseño con estilos CSS predefinidos.  
   - Referencia: [Bootstrap Docs](https://getbootstrap.com/docs/5.3/).

3. **Postgres**  
   - Se levanta la base de datos relacional con la imagen oficial de Docker.  
   - Referencia: [Postgres Docs](https://www.postgresql.org/docs/).

4. **Docker Compose**  
   - Orquesta los contenedores (React y Postgres) bajo la misma red.  
   - Referencia: [Docker Compose Docs](https://docs.docker.com/compose/).

## Estructura de carpetas (ejemplo)
├── backend/
│   └── (archivos de backend, en caso de tener un servidor propio)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       └── main.jsx
├── docker-compose.yml
└── README.md

## Pasos de uso

1. **Instalar dependencias localmente**  
   - Posicionarse en la carpeta `frontend` y ejecutar:
     ```bash
     npm install
     ```
   - Probar en local con:
     ```bash
     npm run dev
     ```
   - La aplicación se abrirá en <http://localhost:5173>.

2. **Levantar con Docker Compose**  
   - Ir a la raíz del proyecto (donde está `docker-compose.yml`) y ejecutar:
     ```bash
     docker compose build --no-cache
     docker compose up
     ```
   - Postgres se expondrá en el puerto `5432`, y la aplicación React en `http://localhost:5173`.

3. **Personalización**  
   - Ajustar las variables de entorno de Postgres (`POSTGRES_USER`, `POSTGRES_PASSWORD`) en `docker-compose.yml`.  
   - Modificar archivos en `frontend/src` para personalizar la interfaz.

## Referencias

- **Vite**: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)  
- **React**: [https://react.dev/](https://react.dev/)  
- **Bootstrap**: [https://getbootstrap.com/docs/5.3/](https://getbootstrap.com/docs/5.3/)  
- **Docker Compose**: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)  
- **Postgres**: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)


### Test API

curl -X POST http://localhost:5000/api/signin \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'


curl -X POST http://localhost:5000/api/signin \
-H "Content-Type: application/json" \
-d '{
  "email": "na@na",
  "password": "na"
}'

