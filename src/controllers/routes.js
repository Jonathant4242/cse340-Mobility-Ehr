import { Router } from 'express';
import { homePage, aboutPage, accountSetupPage } from './index.js';
import { resourceListPage, resourceDetailPage } from './resources/resources.js';

const router = Router();



router.get('/', homePage);

router.get('/about', aboutPage);

router.get('/resources', resourceListPage);

router.get('/resources/:slug', resourceDetailPage);

router.get('/account-setup', accountSetupPage);

export default router;
