import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management Service API',
      version: '1.0.0',
      description: 'API contract for the Order microservice of the Cloud-Native E-Commerce Platform',
    },
    servers: [
      {
        url: 'http://orderservice-alb-1335748857.eu-north-1.elb.amazonaws.com',
        description: 'AWS Production Server',
      },
      {
        url: 'http://localhost:4000',
        description: 'Local development server',
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
          description: 'Check if the Order Management Service is running. Used by AWS ALB for target health monitoring.',
          tags: ['System'],
          security: [],
          responses: {
            200: {
              description: 'Service is healthy',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    example: 'OK',
                  },
                },
              },
            },
          },
        },
      },
      '/api/order/history': {
        get: {
          summary: 'Get User Orders',
          description: 'Retrieve all orders for the authenticated user',
          tags: ['Order'],
          responses: {
            200: {
              description: 'Successful response',
            },
          },
        },
      },
      '/api/order/checkout': {
        post: {
          summary: 'Checkout Order',
          description: "Create a new order from items in the user's cart. This endpoint communicates with the Shop Service to verify product details.",
          tags: ['Order'],
          responses: {
            201: {
              description: 'Order created successfully',
            },
          },
        },
      },
      '/api/cart': {
        get: {
          summary: 'Get User Cart',
          description: "Retrieve the current user's shopping cart.",
          tags: ['Cart'],
          responses: {
            200: { description: 'Successful response' },
          },
        },
      },
      '/api/cart/add': {
        post: {
          summary: 'Add to Cart',
          description: 'Add an item to the shopping cart.',
          tags: ['Cart'],
          responses: {
            200: { description: 'Item added successfully' },
          },
        },
      },
      '/api/cart/update': {
        put: {
          summary: 'Update Cart Item Quantity',
          description: 'Update the quantity of an item in the cart.',
          tags: ['Cart'],
          responses: {
            200: { description: 'Item updated successfully' },
          },
        },
      },
      '/api/cart/remove': {
        delete: {
          summary: 'Remove from Cart',
          description: 'Remove an item from the cart.',
          tags: ['Cart'],
          responses: {
            200: { description: 'Item removed successfully' },
          },
        },
      },
      '/api/cart/clear': {
        delete: {
          summary: 'Clear Cart',
          description: 'Empty the entire cart.',
          tags: ['Cart'],
          responses: {
            200: { description: 'Cart cleared successfully' },
          },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
