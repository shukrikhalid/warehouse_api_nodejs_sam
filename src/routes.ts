

import { Router } from 'express';
const router = Router();

import WarehouseController from "./controllers/warehouse-controller"
import AuthController from "./controllers/auth-controller"


router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.post('/auth/signup', AuthController.signup);
router.post('/auth/confirm_signup', AuthController.confirmSignup);
router.post('/auth/forgot_password', AuthController.forgotPassword);
router.post('/auth/confirm_forgot_password', AuthController.confirmForgotPassword);
router.post('/auth/change_password', AuthController.changePassword);
router.post('/auth/refresh_token', AuthController.refressToken);

router.get('/warehouses',WarehouseController.getAll)
router.post('/warehouses', WarehouseController.add);
router.get('/warehouses/:WarehouseId', WarehouseController.get);
router.put('/warehouses/:WarehouseId', WarehouseController.update);
router.delete('/warehouses/:WarehouseId', WarehouseController.delete);

export default router

