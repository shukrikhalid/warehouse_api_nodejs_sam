"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _warehouseController = _interopRequireDefault(require("./controllers/warehouse-controller"));

var router = (0, _express.Router)();
router.get('/warehouses', _warehouseController.default.getAll);
router.post('/warehouses', _warehouseController.default.add);
router.get('/warehouses/:WarehouseId', _warehouseController.default.get);
router.put('/warehouses/:WarehouseId', _warehouseController.default.update);
router.delete('/warehouses/:WarehouseId', _warehouseController.default.delete);
var _default = router;
exports.default = _default;