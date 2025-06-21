import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'koa-swagger-ui';
import Koa from 'koa';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Issue API',
      version: '1.0.0',
      description: 'A simple API for managing issues',
    },
  },
  apis: ['./lib/api/issues.ts'],  // Reference to the routes you want to document
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app: Koa): void => {
  app.use(swaggerUi.serve);
  app.use(swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
