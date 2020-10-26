import {
  _,
  verifyOAuth2Bearer
} from '../utils/services'

import { v4 as uuidv4 } from 'uuid';

import {Product,Warehouse,StockLog} from '../models'

export default class ProductController {
  static async getAll(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const product = new Product(user.Email)
    let params:any 
    params = {...res.locals.params}

    if(!(params.WarehouseId == undefined && params.WarehouseId == null)) {
      /// GET ALL BY SPECIFIC WAREHOUSE ID
      let data = await product.userGetAllByWarehouse(params.WarehouseId)
      res.json({data: data});
    }else{
      let data = await product.userGetAll()
      res.json({data: data});
    }
  }

  static async add(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    let params:any 
    params = {...res.locals.params}

    const ProductId = uuidv4() //GENERATE NEW ID

    if(params.WarehouseId == undefined && params.WarehouseId == null) {
      return res.status(400).json({error: 'Parameter [WarehouseId] is required and cannot be blank' });
    }
    const warehouse = new Warehouse(user.Email)
    let warehouseInfo = await warehouse.userGet(params.WarehouseId)
    if(_.isEmpty(warehouseInfo)){
      return res.status(404).json({ error: `Data from WarehouseId : ${params.WarehouseId} not found` });
    }
    
    //SET DEFAULT STOCK
    const stock = {
      Timestamp: (new Date()).toISOString(),
      Total: 0
    }
    params.stock = stock

    const product = new Product(user.Email)
    let data = await product.userCreateOrUpdate(ProductId,params)
    params.ProductId = ProductId

    res.json({message: "successfully created", data: params});
  }

  static async get(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const ProductId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}
    const product = new Product(user.Email)
    let data = await product.userGet(ProductId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({data: data});
  }

  static async update(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error });
    }

    const ProductId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}

    delete params.stock //REMOVE STOCK PROPERTIES TO PREVENT WRONG UPDATE

    const product = new Product(user.Email)
    let data = await product.userGet(ProductId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }

    await product.userCreateOrUpdate(ProductId,params)

    let result = _.merge(data, params)

    res.json({message: "successfully updated", data: result});
  }

  static async delete(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const ProductId = getId(req.url)
    let params:any 
    
    params = {ProductId: ProductId}

    const product = new Product(user.Email)
    let data = await product.userGet(ProductId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }
    
    await product.delete(ProductId)

    res.json({message: "successfully deleted", data: data});
  }

  static async stock(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error });
    }

    const ProductId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}

    if(params.command == undefined && params.command == null) {
      return res.status(400).json({error: 'Parameter [command] is required and cannot be blank' });
    }
    if(!['stock','unstock'].includes(params.command )){
      return res.status(400).json({error: "Parameter [command] is accept value 'stock' or 'unstock' only." });
    }
    if(params.total == undefined && params.total == null) {
      return res.status(400).json({error: 'Parameter [total] is required and cannot be blank' });
    }
    if(typeof(params.total) != 'number') {
      return res.status(400).json({error: 'Parameter [total] value is must in number' });
    }
    if(params.total <= 0) {
      return res.status(400).json({error: 'Parameter [total] value is not equal to 0 or less than 0' });
    }


    const product = new Product(user.Email)
    let data_product:any = await product.userGet(ProductId)
    if(_.isEmpty(data_product)){
      return res.status(404).json({ error: "Data not found" });
    }
 
    let attributeToUpdate = {
      stock: {...data_product.stock}
    }

    let nowTimestamp = (new Date()).toISOString()

    let stock_transaction:number = 0
    if(params.command == 'stock'){
      attributeToUpdate.stock.Timestamp = nowTimestamp
      attributeToUpdate.stock.Total += params.total
      stock_transaction = params.total
    }
    else if(params.command == 'unstock'){
      attributeToUpdate.stock.Timestamp = nowTimestamp
      attributeToUpdate.stock.Total -= params.total
      stock_transaction = -params.total
    }

    if(attributeToUpdate.stock.Total < 0){
      return res.status(400).json({error: `current total stock is ${data_product.stock.Total} and you cannot unstock up to ${params.total} and it will become ${attributeToUpdate.stock.Total}` });
    }
    
    let stockAttribute = {
      Transaction: stock_transaction,
      Total: attributeToUpdate.stock.Total
    }
    const stockLog = new StockLog
    await stockLog.createOrUpdate(ProductId,nowTimestamp,stockAttribute)

    await product.userCreateOrUpdate(ProductId,attributeToUpdate)

    res.json({message: "successfully updated", data: attributeToUpdate });
  }

  static async logger(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error });
    }

    const ProductId = getId(req.url.replace('/logger','') )

    const product = new Product(user.Email)
    let data = await product.userGet(ProductId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }

    const stockLog = new StockLog
    let result = await stockLog.getLogger(ProductId)
    res.json({data: result});
  }

}

function getId(url: string){
  let path = url.split('?')[0]
  // console.log("path ",path)
  let value = path.split('/').slice(-1)[0]
  // console.log("value ",value)
  return value
}