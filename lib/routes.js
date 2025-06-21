'use strict';

const Router = require('koa-router');
const Issues = require('./api/issues');

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', require('./api/issues').get);
router.post('/issues', Issues.create);
router.get('/issues', Issues.listAll);
router.put('/issues/:id', Issues.update);
router.get('/issues/:id/revisions', Issues.getRevisions);

module.exports = router;
