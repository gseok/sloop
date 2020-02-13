import Router from 'koa-router';
import apiRoute from './api.route';
import getPing from './ping.route';

const router = new Router();

router.get('/ping', getPing);
router.all('/api*', apiRoute);

export default router;
