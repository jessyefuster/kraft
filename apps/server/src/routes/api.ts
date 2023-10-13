import { Router } from 'express';
import 'express-async-errors';

import authRoutes from './auth';
import usersRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

router.route('/health').get((req, res) => res.send({ status: 'Server is up!' }));

export default router;