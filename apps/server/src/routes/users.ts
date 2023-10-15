import { Router } from 'express';

import UsersController from '../controllers/users';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.route('/:id').delete(isAuthenticated, hasPermissions(['delete:user']), UsersController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['read:user']), UsersController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['create:user']), UsersController.create);

export default router;