import express from 'express';
const router = express.Router();

import admin from './admin';
import user from './user';
import hardware from './hardware';
import component from './components';
import metric from './metric';
import dashboard from './dashboard';
import alert from './alerts';
 
router.use("/admin", admin);
router.use("/user", user);
router.use("/hardware", hardware);
router.use("/component", component);
router.use("/metric", metric);
router.use("/dashboard", dashboard);
router.use("/alert", alert);

export default router ;