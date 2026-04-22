FROM python:3.12-slim

WORKDIR /app

# Copiamos primero el archivo de requisitos para aprovechar el caché de Docker
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código del backend
COPY ./app ./app

# Exponemos el puerto de la API
EXPOSE 8000

# Ejecutamos el servidor de desarrollo
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
