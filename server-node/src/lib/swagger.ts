import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tasks API',
    version: '1.0',
    description: 'Minimal API for task management',
  },
  servers: [{ url: 'http://localhost:3333' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
    },
  },
};

export default {
  swaggerDefinition,
  apis: ['../src/routes/*.ts'],
};
