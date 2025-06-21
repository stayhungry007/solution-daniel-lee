import Koa, { Context } from 'koa';  // Import Koa and Context types
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import router from './lib/routes';  // Assuming your routes are in this folder
import swagger from './swagger';  // Assuming Swagger is set up in this file
import config from './config';  // Assuming the config is exported from a config.ts file

const app: Koa = new Koa();

// Use Swagger for documentation
swagger(app);

// JWT middleware
app.use(jwt({ secret: config.jwtSecret }).unless({ path: ['/login', '/register'] }));

// Body parser middleware
app.use(bodyParser());

// Use the routes from your router
app.use(router.routes());
app.use(router.allowedMethods());

// Custom middleware for checking the presence of X-Client-ID header
app.use(async (context: Context, next: () => Promise<any>) => {
    if (!context.headers['x-client-id']) {
        return context.response.status = 400, context.body = 'X-Client-ID header is required';
    }
    await next();
});

// Start the application on the configured port
app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}/`);
});
