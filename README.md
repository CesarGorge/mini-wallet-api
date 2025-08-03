### 🚀 Comandos de Instalación y Ejecución (Desde Cero)

A continuación se detallan los pasos para configurar y ejecutar cada mini-proyecto desde un entorno limpio.

#### **1. Serverless API (Node.js y MongoDB)**

```bash
# 1. Navegar a la carpeta del proyecto
cd serverless_api

# 2. Instalar todas las dependencias de Node.js
npm install

# 3. Copiar el archivo de ejemplo para las variables de entorno
# (Recordar llenar este archivo con las claves correspondientes)
cp .env.example .env

# 4. Levantar la base de datos MongoDB en segundo plano
docker compose up -d

# 5. Iniciar el servidor local de la API
npx serverless offline start
```
* **API disponible en:** `http://localhost:3000`
* **Documentación Swagger:** `http://localhost:3000/docs/`

#### **2. Django API (Python y PostgreSQL)**

Este proyecto está completamente dockerizado para simplificar la configuración.

```bash
# 1. Navegar a la carpeta del proyecto
cd django_api

# 2. Copiar el archivo de ejemplo para las variables de entorno
# (Recordar llenar este archivo con las claves correspondientes)
cp .env.example .env

# 3. Construir la imagen de la aplicación y levantar los servicios
# (La primera vez, esto aplicará las migraciones automáticamente)
docker compose up --build
```
* **API disponible en:** `http://localhost:8000/api/transactions/`

### Pruebas con la Colección de Postman

Para facilitar las pruebas, se incluye una colección de Postman pre-configurada que automatiza el uso del token de autenticación.

1.  Abre Postman.
2.  Ve a **File > Import...** y selecciona los dos archivos JSON que se encuentran en la carpeta `/postman` de este repositorio. Esto importará la colección de endpoints y el entorno con las variables.
3.  En la esquina superior derecha de Postman, asegúrate de que el entorno importado (**"Wallet Local"**) esté seleccionado.
4.  Ejecuta la petición `POST /login` primero para obtener y guardar el token automáticamente.
5.  ¡Listo! Ya puedes ejecutar cualquier otra petición de la colección sin necesidad de copiar y pegar el token.

---

### 📋 Backlog Ágil (Historias de Usuario)

A continuación se presentan 3 historias de usuario en formato **Given/When/Then** que describen funcionalidades clave de la API.

**Historia 1: Creación Exitosa de una Transacción**
* **Dado que** soy un usuario autenticado del sistema.
* **Cuando** realizo una petición `POST` al endpoint `/transactions` con los datos necesarios (userId, amount, currency).
* **Entonces** el sistema debe registrar la nueva transacción en la base de datos y devolver un código de estado `201 Created` junto con el objeto completo de la transacción recién creada.

**Historia 2: Consulta de Balance de una Wallet**
* **Dado que** soy un usuario autenticado que desea conocer el balance de una de sus wallets.
* **Cuando** realizo una petición `GET` al endpoint `/balance/{walletAddress}` proporcionando una dirección de wallet válida.
* **Entonces** el sistema debe consultar el servicio externo (Etherscan) y devolver un código de estado `200 OK` con un objeto JSON que contenga el balance en USDC de dicha wallet.

**Historia 3: Intento de Acceso a un Recurso Protegido sin Autenticación**
* **Dado que** soy un cliente o usuario no autenticado.
* **Cuando** intento acceder a cualquier endpoint protegido (por ejemplo, `GET /transactions/{txId}`).
* **Entonces** el sistema debe denegar el acceso y devolver un código de estado `401 Unauthorized`.