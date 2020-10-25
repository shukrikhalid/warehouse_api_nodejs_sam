

import { Router } from 'express';
const router = Router();

import WarehouseController from "./controllers/warehouse-controller"

router.get('/warehouses',WarehouseController.getAll)
router.post('/warehouses', WarehouseController.add);
router.get('/warehouses/:WarehouseId', WarehouseController.get);
router.put('/warehouses/:WarehouseId', WarehouseController.update);
router.delete('/warehouses/:WarehouseId', WarehouseController.delete);

export default router

