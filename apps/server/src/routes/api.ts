import { Router } from 'express';
import 'express-async-errors';

import authRoutes from './auth';
import usersRoutes from './users';
import rolesRoutes from './roles';
import permissionsRoutes from './permissions';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);

router.route('/health').get((req, res) => res.send({ status: 'Server is up!' }));

export default router;
