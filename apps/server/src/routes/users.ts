import { Router } from 'express';

import UsersController from '../controllers/users';
import { hasPermissions, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.route('/:id').delete(isAuthenticated, hasPermissions(['DELETE_USERS']), UsersController.deleteOne);
router.route('/').get(isAuthenticated, hasPermissions(['READ_USERS']), UsersController.getAll);
router.route('/').post(isAuthenticated, hasPermissions(['CREATE_USERS']), UsersController.create);

export default router;