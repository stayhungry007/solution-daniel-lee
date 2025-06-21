'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');

const config = require('./config');
const router = require('./lib/routes');

const app = new Koa();

app.use(jwt({ secret: config.jwtSecret }).unless({ path: ['/login', '/register'] }));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context, next) => {
    if (!context.headers['x-client-id']) {
        return respond.badRequest(context, 'X-Client-ID header is required');
    }
    await next();
});


app.listen(config.port);
console.log('Listening on http://localhost:%s/', config.port);
