FROM node:20-alpine

WORKDIR /app

# Copiamos primero package.json para aprovechar el caché de dependencias
COPY package*.json ./

RUN npm ci --silent

# Copiamos el resto del código
COPY . .

EXPOSE 5173

# vite.config.ts ya configura host: '0.0.0.0' y el proxy
CMD ["npm", "run", "dev"]
