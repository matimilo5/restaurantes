-- Restaurantes
CREATE TABLE restaurantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    ciudad VARCHAR(100),
    tipo_comida VARCHAR(50),
    calificacion NUMERIC(2,1),
    foto_url TEXT
);

-- Resenias
CREATE TABLE resenias (
  id SERIAL PRIMARY KEY,
  restaurante_id INT REFERENCES restaurantes(id) ON DELETE CASCADE,
  comensal VARCHAR(100) NOT NULL,
  titulo VARCHAR(255),
  contenido TEXT NOT NULL,
  estrellas INTEGER CHECK (estrellas BETWEEN 1 AND 5),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platos
CREATE TABLE platos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2),
    tiempo_elaboracion INT,
    nivel VARCHAR(50),
    foto_url TEXT,
    restaurante_id INT REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- Ingredientes
CREATE TABLE ingredientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    origen VARCHAR(100),
    calorias INT,
    cantidad VARCHAR(50),
    tipo VARCHAR(50),
    foto_url TEXT,
    plato_id INT REFERENCES platos(id) ON DELETE CASCADE
);

-- Reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    restaurante_id INT REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

