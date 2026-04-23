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
            _id:           { type: 'string',  example: '69bd76a6c37471e397ec6377' },
            recipientId:   { type: 'string',  example: '69a7c16f545188e16c24b4f4' },
            recipientType: { type: 'string',  enum: ['RESTAURANT', 'USER'], example: 'RESTAURANT' },
            type:          { type: 'string',  enum: ['ORDER_CREATED', 'ORDER_STATUS_UPDATED', 'PAYMENT_COMPLETED'], example: 'ORDER_CREATED' },
            title:         { type: 'string',  example: 'New Order Received!' },
            message:       { type: 'string',  example: 'New order #A2DFAA · $1200' },
            relatedId:     { type: 'string',  example: '69bd76a53c7c0b635e2adfaa' },
            isRead:        { type: 'boolean', example: false },
            totalAmount:   { type: 'number',  example: 1200 },
            subtotal:      { type: 'number',  example: 1091 },
            shippingFee:   { type: 'number',  example: 109 },
            status:        { type: 'string',  example: 'pending' },
            paymentMethod: { type: 'string',  example: 'cod' },
            customerId:    { type: 'string',  example: '69a7c16f545188e16c24b4f4' },
            shop: {
              type: 'object',
              properties: {
                id:   { type: 'string' },
                name: { type: 'string', example: 'Pizza Palace' },
                logo: { type: 'string', example: 'https://...' },
              },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name:      { type: 'string',  example: 'Margherita Pizza' },
                  image:     { type: 'string',  example: 'https://...' },
                  price:     { type: 'number',  example: 850 },
                  quantity:  { type: 'number',  example: 2 },
                },
              },
            },
            deliveryAddress: {
              type: 'object',
              properties: {
                street:       { type: 'string', example: '42 Galle Road, Colombo 03' },
                phone:        { type: 'string', example: '+94771234567' },
                type:         { type: 'string', example: 'delivery' },
                instructions: { type: 'string', example: 'Leave at door' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Notification not found' },
          },
        },

        UnreadCount: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 5 },
          },
        },

        SuccessMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' },
            updated: { type: 'number', example: 3 },
          },
        },
      },
    },

    paths: {

      // ── HEALTH ────────────────────────────────────────────────────────────
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
                      status:  { type: 'string', example: 'ok' },
                      service: { type: 'string', example: 'Notification Service' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── GET ALL ───────────────────────────────────────────────────────────
      '/api/notifications/{recipientId}': {
        get: {
          summary: 'Get all notifications for a recipient',
          description: 'Retrieves all notifications newest first for a shop or customer',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              description: 'The ID of the recipient (shop or user)',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'List of notifications',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── UNREAD COUNT ──────────────────────────────────────────────────────
      '/api/notifications/{recipientId}/unread-count': {
        get: {
          summary: 'Get unread notification count',
          description: 'Returns just the number of unread notifications — used by the bell badge',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Unread count',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnreadCount' },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── GET UNREAD ────────────────────────────────────────────────────────
      '/api/notifications/{recipientId}/unread': {
        get: {
          summary: 'Get unread notifications only',
          description: 'Returns only unread notifications for a recipient',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'List of unread notifications',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── GET BY TYPE ───────────────────────────────────────────────────────
      '/api/notifications/{recipientId}/type/{type}': {
        get: {
          summary: 'Get notifications by type',
          description: 'Filter notifications by type e.g. ORDER_CREATED',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              schema: { type: 'string' },
            },
            {
              name: 'type', in: 'path', required: true,
              description: 'Notification type',
              schema: { type: 'string', enum: ['ORDER_CREATED', 'ORDER_STATUS_UPDATED', 'PAYMENT_COMPLETED'] },
            },
          ],
          responses: {
            200: {
              description: 'Filtered notifications',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── MARK ONE AS READ ──────────────────────────────────────────────────
      '/api/notifications/{notificationId}/read': {
        patch: {
          summary: 'Mark one notification as read',
          description: 'Marks a single notification as read by its ID',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'notificationId', in: 'path', required: true,
              description: 'The ID of the notification',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Updated notification',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Notification' },
                },
              },
            },
            404: { description: 'Notification not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── MARK ALL AS READ ──────────────────────────────────────────────────
      '/api/notifications/{recipientId}/read-all': {
        patch: {
          summary: 'Mark all notifications as read',
          description: 'Marks all unread notifications as read for a recipient',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'All marked as read',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessMessage' },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── DELETE ONE ────────────────────────────────────────────────────────
      '/api/notifications/{notificationId}': {
        delete: {
          summary: 'Delete a notification',
          description: 'Permanently deletes a single notification by its ID',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'notificationId', in: 'path', required: true,
              description: 'The ID of the notification to delete',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Notification deleted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessMessage' },
                },
              },
            },
            404: { description: 'Notification not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── DELETE ALL ────────────────────────────────────────────────────────
      '/api/notifications/{recipientId}/all': {
        delete: {
          summary: 'Delete all notifications for a recipient',
          description: 'Permanently deletes all notifications for a shop or user',
          tags: ['Notifications'],
          parameters: [
            {
              name: 'recipientId', in: 'path', required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'All notifications deleted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessMessage' },
                },
              },
            },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };