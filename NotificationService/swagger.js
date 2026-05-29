import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'API documentation for the Notification Service of the Cloud-Native E-Commerce Platform',
    },
    servers: [
      {
        url: 'http://notification-alb-156556238.us-east-1.elb.amazonaws.com',
        description: 'Production server (AWS ECS)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '69bd76a6c37471e397ec6377' },
            recipientId: { type: 'string', example: '69a7c16f545188e16c24b4f4' },
            recipientType: { type: 'string', enum: ['RESTAURANT', 'USER'], example: 'RESTAURANT' },
            type: { type: 'string', enum: ['ORDER_CREATED', 'ORDER_STATUS_UPDATED', 'PAYMENT_COMPLETED'], example: 'ORDER_CREATED' },
            message: { type: 'string', example: 'New Order Received! ID: 69bd76a53c7c0b635e2adfaa' },
            relatedId: { type: 'string', example: '69bd76a53c7c0b635e2adfaa' },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/api/notifications/{recipientId}': {
        get: {
          summary: 'Get notifications for a recipient',
          description: 'Retrieves all notifications for a specific recipient (shop owner or customer)',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId',
              in: 'path',
              required: true,
              description: 'The ID of the recipient',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'List of notifications',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' },
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/notifications/{recipientId}/read': {
        put: {
          summary: 'Mark notification as read',
          description: 'Mark all notifications as read for a recipient (planned feature)',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Notifications marked as read' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/notifications/health': {
        get: {
          summary: 'Health check',
          description: 'Check if the notification service is running',
          tags: ['Health'],
          responses: {
            200: {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      service: { type: 'string', example: 'Notification Service' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };