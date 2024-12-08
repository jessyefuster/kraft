import { Router } from 'express';

import UsersController from '../controllers/users';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.route('/me').get(isAuthenticated, UsersController.getMe);
router.route('/:id').delete(isAuthenticated, hasPermissions(['delete:users']), UsersController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['read:users']), UsersController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['create:users']), UsersController.createOne);

export default router;