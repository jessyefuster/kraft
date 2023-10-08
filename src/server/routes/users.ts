import express from 'express';

import UsersController from '../controllers/users';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/:id').delete(isAuthenticated, UsersController.deleteOne);
router.route('/').get(isAuthenticated, UsersController.getAll);
router.route('/').post(UsersController.create);

export default router;