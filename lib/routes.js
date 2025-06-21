'use strict';

const Router = require('koa-router');
const Issues = require('./api/issues');

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', require('./api/issues').get);
router.post('/issues', Issues.create);
router.get('/issues', Issues.listAll);

module.exports = router;
