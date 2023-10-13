import express from 'express';

import RolesController from '../controllers/roles';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/').get(isAuthenticated, RolesController.getAll);

export default router;
