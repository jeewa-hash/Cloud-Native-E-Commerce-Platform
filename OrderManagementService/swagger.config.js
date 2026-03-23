import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management Service API',
      version: '1.0.0',
      description: 'API contract for the Order microservice',
    },

    // ✅ FIX (important)
    servers: [
      {
        url: '/',   // works for AWS + local
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    paths: {
      '/health': {
        get: {
          summary: 'Health Check',
          tags: ['System'],
          security: [],
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },

      '/api/order/history': {
        get: {
          summary: 'Get User Orders',
          tags: ['Order'],
          responses: {
            200: { description: 'Success' },
          },
        },
      },

      '/api/order/checkout': {
        post: {
          summary: 'Checkout Order',
          tags: ['Order'],
          responses: {
            201: { description: 'Created' },
          },
        },
      },

      '/api/cart': {
        get: {
          summary: 'Get Cart',
          tags: ['Cart'],
          responses: {
            200: { description: 'Success' },
          },
        },
      },

      '/api/cart/add': {
        post: {
          summary: 'Add to Cart',
          tags: ['Cart'],
          responses: {
            200: { description: 'Added' },
          },
        },
      },
    },
  },

  apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };