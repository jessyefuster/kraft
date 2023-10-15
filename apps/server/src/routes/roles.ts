import express from 'express';

import RolesController from '../controllers/roles';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/').get(isAuthenticated, hasPermissions(['read:role']), RolesController.getAll);

export default router;
