FROM node:18

# carpeta de trabajo dentro del contenedor
WORKDIR /app

# copiamos package.json y package-lock.json
COPY package*.json ./

# instalamos dependencias
RUN npm install

# copiamos el resto del backend
COPY . .

# exponemos el puerto del backend
EXPOSE 3000

# ejecutamos el backend
CMD ["node", "src/index.js"]

