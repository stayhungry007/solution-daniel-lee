'use strict';

const Router = require('koa-router');
const Issues = require('./api/issues');
const Users = require('./api/users')

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', require('./api/issues').get);
router.post('/issues', Issues.create);
router.get('/issues', Issues.listAll);
router.put('/issues/:id', Issues.update);
router.get('/issues/:id/revisions', Issues.getRevisions);
router.get('/issues/:id/revisions/compare/:fromRevId/:toRevId', Issues.compareRevisions);


router.post('/register', Users.register);
router.post('/login', Users.login);


module.exports = router;
