import express from 'express';

import RolesController from '../controllers/roles';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/:id').get(isAuthenticated, hasPermissions(['read:roles']), RolesController.getOne);
router.route('/:id').delete(isAuthenticated, hasPermissions(['delete:roles']), RolesController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['read:roles']), RolesController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['create:roles']), RolesController.createOne);

export default router;
