import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Wspólne chwile API',
      version: '1.0.0',
    },
    basePath: '/',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['app.js', 'routes/*.js']
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);