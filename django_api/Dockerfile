FROM python:3.11-slim-buster

# Establece variables de entorno
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del proyecto
COPY . .

# Expone el puerto que usará Gunicorn
EXPOSE 8000

# Ejecuta las migraciones y luego inicia el servidor Gunicorn.
# Este es el comando final que se ejecutará al iniciar el contenedor.
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 wallet_project.wsgi:application"]