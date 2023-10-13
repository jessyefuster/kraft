import { Router } from 'express';

import UsersController from '../controllers/users';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.route('/:id').delete(isAuthenticated, UsersController.deleteOne);
router.route('/').get(isAuthenticated, UsersController.getAll);
router.route('/').post(UsersController.create);

export default router;