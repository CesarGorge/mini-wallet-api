const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Wallet API (Serverless)',
      version: '1.0.0',
      description: 'Documentación de la API para la prueba técnica',
    },
    servers: [
      {
        url: 'https://ub22k36kcj.execute-api.us-east-1.amazonaws.com',
        description: 'Servidor Desplegado en AWS',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo Local con Docker',
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
            Transaction: {
                type: 'object',
                properties: { txId: { type: 'string' }, userId: { type: 'string' }, amount: { type: 'number' }, currency: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' }, status: { type: 'string', enum: ['pending', 'completed', 'failed'] } }
            }
        }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./handler.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

module.exports = router;