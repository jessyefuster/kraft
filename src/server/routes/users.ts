import express from 'express';

import UsersController from '../controllers/users';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.route('/').post(UsersController.create);
router.route('/').get(isAuthenticated, UsersController.getAll);

export default router;