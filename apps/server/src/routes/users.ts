import { Router } from 'express';

import UsersController from '../controllers/users';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.route('/:id').delete(isAuthenticated, hasPermissions(['delete:users']), UsersController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['read:users']), UsersController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['create:users']), UsersController.create);

export default router;