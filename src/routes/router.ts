import express from 'express';
const router = express.Router();

import admin from '../routes/admin';
import user from '../routes/user';
 
router.use("/admin", admin);
router.use("/user", user);

export default router ;