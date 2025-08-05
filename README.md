# Wallet API

Este repositorio incluye dos mini-proyectos: una API Serverless con Node.js y una API con Django.

## Estructura del Proyecto

- `/serverless_api/`: Contiene el proyecto de la API Serverless (Node.js, AWS Lambda, MongoDB).
- `/django_api/`: Contiene el proyecto de la API Backend (Django, PostgreSQL, Web3.py).
- `/postman/`: Contiene la colección y el entorno de Postman para facilitar las pruebas de la API Serverless.

---

### 🚀 Instrucciones de Despliegue en AWS (API Serverless)
Esta guía detalla los pasos necesarios para desplegar el proyecto serverless_api en un entorno de AWS desde cero.

**1. Requisitos Previos**
   Una cuenta de AWS.

Node.js y npm instalados localmente.

El código del proyecto clonado en tu máquina local.

**2. Instalación y Configuración de la AWS CLI**
   La Interfaz de Línea de Comandos (CLI) de AWS es necesaria para que el Serverless Framework pueda interactuar con tu cuenta de AWS.

Instalar la AWS CLI:

Descarga y ejecuta el instalador oficial desde la guía de instalación de AWS.

Verificar la Instalación:

Abre una nueva terminal y ejecuta aws --version para confirmar que se instaló correctamente.

**3. Creación de Credenciales de Acceso (IAM)**
   Por seguridad, se debe crear un usuario IAM dedicado para el despliegue en lugar de usar las credenciales del usuario raíz.

Inicia Sesión en la Consola de AWS y navega al servicio IAM.

Ve a la sección Users y haz clic en Create user.

Asigna un nombre (ej. serverless-deployer) y haz clic en Next.

En la página de permisos, selecciona Attach policies directly y elige la política AdministratorAccess.
(Nota: En un entorno de producción real, se aplicaría el principio de mínimo privilegio con una política más restrictiva).

Finaliza la creación del usuario.

En la página de confirmación del usuario, ve a la pestaña Security credentials y haz clic en Create access key.

Selecciona Command Line Interface (CLI) como caso de uso.

Guarda en un lugar seguro el Access Key ID y la Secret Access Key que se generan. La clave secreta solo se mostrará esta vez.

**4. Configuración de la AWS CLI con tus Credenciales**
   En tu terminal, ejecuta el siguiente comando:

```bash
aws configure
```

Se te pedirá que ingreses la información que obtuviste:

AWS Access Key ID: Pega la clave de acceso.

AWS Secret Access Key: Pega la clave secreta.

Default region name: us-east-1 (o tu región de preferencia).

Default output format: json.

Verifica que la configuración es correcta ejecutando:

```bash
aws sts get-caller-identity
```

Si la respuesta es un JSON con los detalles de tu usuario IAM, estás listo para desplegar.

**5. Configuración de la Base de Datos en la Nube (MongoDB Atlas)**
   La función Lambda necesitará una base de datos accesible desde internet.

Crea una cuenta gratuita en MongoDB Atlas.

Crea un cluster gratuito (tier M0), eligiendo AWS como proveedor y la misma región que configuraste (ej. us-east-1).

En Database Access, crea un usuario y contraseña para la base de datos.

En Network Access, permite el acceso desde cualquier lugar añadiendo la IP 0.0.0.0/0.

Obtén la cadena de conexión (Connection String) para "Drivers" y reemplaza <username> y <password> con las credenciales que creaste.

**6. Despliegue de la Aplicación**
   Navega a la carpeta /serverless_api.

Crea el archivo .env a partir de .env.example y llénalo con tus variables, especialmente la MONGO_URI de MongoDB Atlas.

Ejecuta el comando de despliegue:

```bash
npx serverless deploy
```

Al finalizar, la terminal te proporcionará la URL base de tu API desplegada en AWS.

---

### 🚀 Comandos de Instalación y Ejecución (local con Docker)

A continuación se detallan los pasos para configurar y ejecutar cada mini-proyecto desde un entorno limpio.

**Requisitos Previos:**

- Docker y Docker Compose
- Node.js y npm (para la API Serverless)
- Python y pip (para la API Django, aunque Docker lo maneja)
- serverless-offline o AWS SAM CLI (para un entorno local de la API Serverless)

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

- **API disponible en:** `http://localhost:3000`
- **Documentación Swagger:** `http://localhost:3000/docs/`

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

- **API disponible en:** `http://localhost:8000/api/transactions/`

---

### 🔧 Variables de Entorno

#### `serverless_api/.env`

- `MONGO_URI`: Cadena de conexión para la base de datos MongoDB.
- `JWT_SECRET`: Clave secreta para firmar los tokens de autenticación.
- `ETHERSCAN_API_KEY`: Tu API Key de Etherscan para consultar balances.
- `USDC_CONTRACT_ADDRESS`: La dirección del contrato del token USDC en Ethereum Mainnet.

#### `django_api/.env`

- `POSTGRES_HOST`: Host de la base de datos (`localhost` para desarrollo local, `db` para Docker).
- `POSTGRES_DB`: Nombre de la base de datos PostgreSQL.
- `POSTGRES_USER`: Usuario de la base de datos.
- `POSTGRES_PASSWORD`: Contraseña del usuario.
- `INFURA_URL`: URL del nodo de Infura para la red de pruebas Sepolia (ej. `https://sepolia.infura.io/v3/YOUR_API_KEY`).
- `SAMPLE_WALLET_ADDRESS`: Una dirección de wallet para consultar su saldo en la red de pruebas.

---

### Pruebas con la Colección de Postman

Para facilitar las pruebas, se incluye una colección de Postman pre-configurada que automatiza el uso del token de autenticación.

1.  Abre Postman.
2.  Ve a **File > Import...** y selecciona los archivos JSON que se encuentran en la carpeta `/postman/django_api` y `/postman/serverless_api` de este repositorio. Esto importará la colección de endpoints y el entorno con las variables.
3.  En la esquina superior derecha de Postman, asegúrate de que el entorno importado (**"Wallet Local"**) esté seleccionado.
4.  Ejecuta la petición `POST /login` primero para obtener y guardar el token automáticamente.
5.  ¡Listo! Ya puedes ejecutar cualquier otra petición de la colección sin necesidad de copiar y pegar el token.

**NOTA: Para pruebas locales con Docker dejar la URL por defecto que estan en la coleccion de postman. Para pruebas en producción, se debe usar para el proyecto serverless_api la URL "https://ub22k36kcj.execute-api.us-east-1.amazonaws.com" y para el proyecto django_api la URL .**

---

### 🧠 Preguntas Conceptuales

**1. SQL vs NoSQL y cuándo usar cada uno en serverless.**

- **SQL (ej. PostgreSQL):** Es ideal para datos con relaciones complejas y donde la consistencia transaccional (ACID) es la prioridad. En un entorno serverless, es una excelente opción para datos estructurados como perfiles de usuario, órdenes de compra o registros financieros. Servicios como AWS RDS Proxy ayudan a manejar eficientemente las conexiones desde funciones Lambda.
- **NoSQL (ej. MongoDB):** Destacan en escenarios que requieren alta escalabilidad horizontal y esquemas de datos flexibles. Es la opción natural para serverless por su capacidad de manejar grandes volúmenes de datos no estructurados o semi-estructurados. Su modelo de conexión es más compatible con la naturaleza de las funciones serverless.

**2. Problemas que resuelve GitFlow en equipos ágiles pequeños.**
Incluso en equipos pequeños, GitFlow proporciona una estructura que resuelve problemas clave:

- **Desarrollo en Paralelo:** Aísla el desarrollo de nuevas funcionalidades en `feature branches`, evitando que el trabajo en progreso desestabilice la rama principal de desarrollo (`develop`).
- **Estabilidad de Producción:** Mantiene la rama `main` siempre en un estado desplegable. Las correcciones urgentes se pueden hacer desde `hotfix branches` sin introducir features a medio terminar.
- **Gestión de Versiones Clara:** Formaliza el proceso de "congelar" una versión para pruebas finales en `release branches`, permitiendo que el desarrollo de la siguiente versión continúe en `develop`.
- **Claridad Histórica:** Crea un historial de commits limpio y fácil de entender, donde es claro qué código está en producción, qué se está desarrollando y qué se está preparando para lanzar.

**3. Principio de mínimo privilegio aplicado a IAM en AWS.**
Este principio fundamental de seguridad indica que una identidad (un usuario, un rol o un servicio) solo debe tener los permisos **estrictamente necesarios** para realizar su función, y nada más. En AWS IAM, esto significa crear políticas personalizadas que otorgan permisos específicos (`s3:GetObject`) sobre recursos específicos (`arn:aws:s3:::mi-bucket-especifico/*`) en lugar de usar políticas gestionadas por AWS con permisos amplios (`AmazonS3FullAccess`). Esto reduce drásticamente el daño potencial si las credenciales de esa identidad se ven comprometidas.

**4. Ventajas de story points vs horas en Scrum.**
Los _story points_ son una medida abstracta y relativa del **esfuerzo total**, mientras que las horas son una medida absoluta de **tiempo**. Las ventajas de los story points son:

- **Consideran la Complejidad y la Incertidumbre:** Un _story point_ no solo mide el tiempo, sino también la complejidad del trabajo y el riesgo involucrado. Una tarea de 8 horas muy compleja tiene más "esfuerzo" que una de 8 horas muy sencilla.
- **Fomentan la Estimación en Equipo:** Al ser relativos ("¿esta tarea es más grande o más pequeña que aquella?"), promueven la discusión y un entendimiento compartido, en lugar de un compromiso de tiempo individual.
- **Evitan la Presión y Mejoran la Psicología del Equipo:** Las estimaciones en horas pueden generar presión y penalizar a quienes "tardan más". Los puntos son una medida de equipo, enfocada en el valor entregado.
- **Permiten una Velocidad de Equipo Estable:** La velocidad (puntos completados por sprint) tiende a ser más consistente a lo largo del tiempo que las horas, lo que permite hacer predicciones a largo plazo más fiables.###

---

### 📋 Backlog Ágil (Historias de Usuario)

A continuación se presentan 3 historias de usuario en formato **Given/When/Then** que describen funcionalidades clave de la API.

**Historia 1: Creación Exitosa de una Transacción**

- **Dado que** soy un usuario autenticado del sistema.
- **Cuando** realizo una petición `POST` al endpoint `/transactions` con los datos necesarios (userId, amount, currency).
- **Entonces** el sistema debe registrar la nueva transacción en la base de datos y devolver un código de estado `201 Created` junto con el objeto completo de la transacción recién creada.

**Historia 2: Consulta de Balance de una Wallet**

- **Dado que** soy un usuario autenticado que desea conocer el balance de una de sus wallets.
- **Cuando** realizo una petición `GET` al endpoint `/balance/{walletAddress}` proporcionando una dirección de wallet válida.
- **Entonces** el sistema debe consultar el servicio externo (Etherscan) y devolver un código de estado `200 OK` con un objeto JSON que contenga el balance en USDC de dicha wallet.

**Historia 3: Intento de Acceso a un Recurso Protegido sin Autenticación**

- **Dado que** soy un cliente o usuario no autenticado.
- **Cuando** intento acceder a cualquier endpoint protegido (por ejemplo, `GET /transactions/{txId}`).
- **Entonces** el sistema debe denegar el acceso y devolver un código de estado `401 Unauthorized`.
