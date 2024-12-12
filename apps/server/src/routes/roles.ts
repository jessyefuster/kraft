import express from 'express';

import RolesController from '../controllers/roles';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/:id/permissions').post(isAuthenticated, hasPermissions(['update:roles']), RolesController.addPermissions);
router.route('/:id/permissions').get(isAuthenticated, hasPermissions(['read:roles']), RolesController.getPermissions);
router.route('/:id/permissions').put(isAuthenticated, hasPermissions(['update:roles']), RolesController.updatePermissions);
router.route('/:id/users').post(isAuthenticated, hasPermissions(['read:roles', 'update:users']), RolesController.addUsers);
router.route('/:id/users').delete(isAuthenticated, hasPermissions(['read:roles', 'update:users']), RolesController.deleteUsers);
router.route('/:id').get(isAuthenticated, hasPermissions(['read:roles']), RolesController.getOne);
router.route('/:id').patch(isAuthenticated, hasPermissions(['update:roles']), RolesController.updateOne);
router.route('/:id').delete(isAuthenticated, hasPermissions(['delete:roles']), RolesController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['read:roles']), RolesController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['create:roles']), RolesController.createOne);

export default router;
