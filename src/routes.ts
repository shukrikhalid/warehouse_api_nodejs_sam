

import { Router } from 'express';
const router = Router();

import WarehouseController from "./controllers/warehouse-controller"
import AuthController from "./controllers/auth-controller"
import ProductController from "./controllers/product-controller"


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

router.get('/products',ProductController.getAll)
router.post('/products', ProductController.add);
router.get('/products/:ProductId', ProductController.get);
router.put('/products/:ProductId', ProductController.update);
router.delete('/products/:ProductId', ProductController.delete);
router.post('/products/:ProductId', ProductController.stock);
router.get('/products/:ProductId/logger', ProductController.logger);

export default router

