import express from 'express';

import PermissionsController from '../controllers/permissions';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/').get(isAuthenticated, hasPermissions(['read:roles']), PermissionsController.getAll);

export default router;
