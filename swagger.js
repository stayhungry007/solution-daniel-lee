// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('koa-swagger-ui');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Issue API',
            version: '1.0.0',
            description: 'A simple API for managing issues',
        },
    },
    apis: ['./lib/api/issues.js'],  // Reference to the routes you want to document
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use(swaggerUi.serve);
    app.use(swaggerUi.setup(swaggerSpec));
};
