import express from 'express';
const router = express.Router();

import admin from '../routes/admin';
import user from '../routes/user';
import hardware from '../routes/hardware';
 
router.use("/admin", admin);
router.use("/user", user);
router.use("/hardware", hardware);

export default router ;