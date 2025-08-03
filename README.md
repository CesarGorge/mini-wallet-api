# Prueba Técnica Backend - Coco Wallet

Este repositorio contiene la solución completa para la prueba técnica de desarrollador Backend de Coco. Incluye dos mini-proyectos: una API Serverless con Node.js y una API con Django.

## Estructura del Proyecto

-   `/serverless_api/`: Contiene el proyecto de la API Serverless (Node.js, AWS Lambda, MongoDB).
-   `/django_api/`: Contiene el proyecto de la API Backend (Django, PostgreSQL, Web3.py).
-   `/postman/`: Contiene la colección y el entorno de Postman para facilitar las pruebas de la API Serverless.

---

### 🚀 Despliegue y Ejecución Local

**Requisitos Previos:**
* Docker y Docker Compose
* Node.js y npm (para la API Serverless)
* Python y pip (para la API Django, aunque Docker lo maneja)
* serverless-offline o AWS SAM CLI (para un entorno local de la API Serverless)

#### **1. Serverless API (Node.js)**

```bash
# 1. Navega a la carpeta del proyecto
cd serverless_api

# 2. Copia el archivo de ejemplo de variables de entorno y llénalo con tus claves
cp .env.example .env

# 3. Instala las dependencias
npm install

# 4. Levanta la base de datos MongoDB con Docker
docker compose up -d

# 5. Inicia el servidor local
npx serverless offline start
```
La API estará disponible en `http://localhost:3000`. La documentación de Swagger se encuentra en `http://localhost:3000/docs/`.

#### **2. Django API**

Este proyecto está completamente dockerizado para una configuración sencilla.

```bash
# 1. Navega a la carpeta del proyecto
cd django_api

# 2. Copia el archivo de ejemplo de variables de entorno y llénalo con tus claves
cp .env.example .env

# 3. Levanta la aplicación y la base de datos con Docker Compose
docker compose up --build
```
La API estará disponible en `http://localhost:8000/api/transactions/`. El comando `--build` es necesario solo la primera vez o cuando cambies las dependencias.

---

### 🔧 Variables de Entorno

#### `serverless_api/.env`
* `MONGO_URI`: Cadena de conexión para la base de datos MongoDB.
* `JWT_SECRET`: Clave secreta para firmar los tokens de autenticación.
* `ETHERSCAN_API_KEY`: Tu API Key de Etherscan para consultar balances.
* `USDC_CONTRACT_ADDRESS`: La dirección del contrato del token USDC en Ethereum Mainnet.

#### `django_api/.env`
* `DB_HOST`: Host de la base de datos (`localhost` para desarrollo local, `db` para Docker).
* `DB_NAME`: Nombre de la base de datos PostgreSQL.
* `DB_USER`: Usuario de la base de datos.
* `DB_PASSWORD`: Contraseña del usuario.
* `INFURA_URL`: URL del nodo de Infura para la red de pruebas Sepolia (ej. `https://sepolia.infura.io/v3/YOUR_API_KEY`).
* `SAMPLE_WALLET_ADDRESS`: Una dirección de wallet para consultar su saldo en la red de pruebas.

---

### 🧠 Preguntas Conceptuales

**1. SQL vs NoSQL y cuándo usar cada uno en serverless.**
* **SQL (ej. PostgreSQL):** Es ideal para datos con relaciones complejas y donde la consistencia transaccional (ACID) es crítica. En un entorno serverless, es una excelente opción para datos estructurados como perfiles de usuario, órdenes de compra o registros financieros. Servicios como AWS RDS Proxy ayudan a manejar eficientemente las conexiones desde funciones Lambda.
* **NoSQL (ej. MongoDB):** Brilla en escenarios que requieren alta escalabilidad horizontal y esquemas de datos flexibles. Es la opción natural para serverless por su capacidad de manejar grandes volúmenes de datos no estructurados o semi-estructurados, como logs de eventos, datos de IoT o contenido generado por usuarios. Su modelo de conexión es más compatible con la naturaleza efímera y masivamente concurrente de las funciones serverless.

**2. Problemas que resuelve GitFlow en equipos ágiles pequeños.**
Incluso en equipos pequeños, GitFlow proporciona una estructura que resuelve problemas clave:
* **Desarrollo en Paralelo:** Aísla el desarrollo de nuevas funcionalidades en `feature branches`, evitando que el trabajo en progreso desestabilice la rama principal de desarrollo (`develop`).
* **Estabilidad de Producción:** Mantiene la rama `main` siempre en un estado desplegable. Las correcciones urgentes se pueden hacer desde `hotfix branches` sin introducir features a medio terminar.
* **Gestión de Versiones Clara:** Formaliza el proceso de "congelar" una versión para pruebas finales en `release branches`, permitiendo que el desarrollo de la siguiente versión continúe en `develop`.
* **Claridad Histórica:** Crea un historial de commits limpio y fácil de entender, donde es claro qué código está en producción, qué se está desarrollando y qué se está preparando para lanzar.

**3. Principio de mínimo privilegio aplicado a IAM en AWS.**
Este principio fundamental de seguridad dicta que una identidad (un usuario, un rol o un servicio) solo debe tener los permisos **estrictamente necesarios** para realizar su función, y nada más. En AWS IAM, esto significa crear políticas personalizadas que otorgan permisos específicos (`s3:GetObject`) sobre recursos específicos (`arn:aws:s3:::mi-bucket-especifico/*`) en lugar de usar políticas gestionadas por AWS con permisos amplios (`AmazonS3FullAccess`). Esto reduce drásticamente el "radio de explosión" o el daño potencial si las credenciales de esa identidad se ven comprometidas.

**4. Ventajas de story points vs horas en Scrum.**
Los *story points* son una medida abstracta y relativa del **esfuerzo total**, mientras que las horas son una medida absoluta de **tiempo**. Las ventajas de los story points son:
* **Consideran la Complejidad y la Incertidumbre:** Un *story point* no solo mide el tiempo, sino también la complejidad del trabajo y el riesgo involucrado. Una tarea de 8 horas muy compleja tiene más "esfuerzo" que una de 8 horas muy sencilla.
* **Fomentan la Estimación en Equipo:** Al ser relativos ("¿esta tarea es más grande o más pequeña que aquella?"), promueven la discusión y un entendimiento compartido, en lugar de un compromiso de tiempo individual.
* **Evitan la Presión y Mejoran la Psicología del Equipo:** Las estimaciones en horas pueden generar presión y penalizar a quienes "tardan más". Los puntos son una medida de equipo, enfocada en el valor entregado.
* **Permiten una Velocidad de Equipo Estable:** La velocidad (puntos completados por sprint) tiende a ser más consistente a lo largo del tiempo que las horas, lo que permite hacer predicciones a largo plazo más fiables.### 🚀 Comandos de Instalación y Ejecución (Desde Cero)

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