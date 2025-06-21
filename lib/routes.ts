import Router, { IRouterContext } from 'koa-router';
import Issues from './api/issues';
import Users from './api/users';
import discovery from './api/discovery';
import health from './api/health';

const router = new Router();

// Define routes
router.get('/', discovery);
router.get('/health', health);
router.get('/issues/:id', Issues.get);
router.post('/issues', Issues.create);
router.get('/issues', Issues.listAll);
router.put('/issues/:id', Issues.update);
router.get('/issues/:id/revisions', Issues.getRevisions);
router.get('/issues/:id/revisions/compare/:fromRevId/:toRevId', Issues.compareRevisions);

router.post('/register', Users.register);
router.post('/login', Users.login);

export default router;
