"use strict";

const serverless = require("serverless-http");
const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-dist");

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Wallet API (Serverless)",
      version: "1.0.0",
      description: "API documentation for the technical test",
    },
    servers: [
      {
        url: "/api", // Relative URL for the API
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            txId: { type: "string" },
            userId: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./handler.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve the generated swagger.json
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve the static files from swagger-ui-dist
app.use(express.static(swaggerUi.getAbsoluteFSPath()));

// Serve the custom HTML for the Swagger UI
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>API Docs</title>
        <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
        <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="./swagger-ui-bundle.js" charset="UTF-8"> </script>
        <script src="./swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
        <script>
            window.onload = function() {
                const ui = SwaggerUIBundle({
                    url: "./swagger.json",
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout"
                });
                window.ui = ui;
            };
        </script>
    </body>
    </html>
  `;
  res.send(html);
});

module.exports.main = serverless(app);