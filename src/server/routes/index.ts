import Router from 'koa-router';
import getPing from './ping.route';

const router = new Router();

router.get('/ping', getPing);

export default router;
