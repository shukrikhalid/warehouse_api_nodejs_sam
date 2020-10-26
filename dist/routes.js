"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _warehouseController = _interopRequireDefault(require("./controllers/warehouse-controller"));

var _authController = _interopRequireDefault(require("./controllers/auth-controller"));

var router = (0, _express.Router)();
router.post('/auth/login', _authController.default.login);
router.post('/auth/logout', _authController.default.logout);
router.post('/auth/signup', _authController.default.signup);
router.post('/auth/confirm_signup', _authController.default.confirmSignup);
router.post('/auth/forgot_password', _authController.default.forgotPassword);
router.post('/auth/confirm_forgot_password', _authController.default.confirmForgotPassword);
router.post('/auth/change_password', _authController.default.changePassword);
router.post('/auth/refresh_token', _authController.default.refressToken);
router.get('/warehouses', _warehouseController.default.getAll);
router.post('/warehouses', _warehouseController.default.add);
router.get('/warehouses/:WarehouseId', _warehouseController.default.get);
router.put('/warehouses/:WarehouseId', _warehouseController.default.update);
router.delete('/warehouses/:WarehouseId', _warehouseController.default.delete);
var _default = router;
exports.default = _default;