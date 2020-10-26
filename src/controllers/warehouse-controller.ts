import {
  _,
  verifyOAuth2Bearer
} from '../utils/services'

import { v4 as uuidv4 } from 'uuid';

import {Warehouse} from '../models'
// const warehouse = new Warehouse()

export default class WarehouseController {
  static async getAll(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const warehouse = new Warehouse(user.Email)
    let data = await warehouse.userGetAll()
    res.json({data: data});
  }

  static async add(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    let params:any 
    params = {...res.locals.params}

    const WarehouseId = uuidv4() //GENERATE NEW ID

    const warehouse = new Warehouse(user.Email)
    let data = await warehouse.userCreateOrUpdate(WarehouseId,params)
    params.WarehouseId = WarehouseId

    res.json({message: "successfully created", data: params});
  }

  static async get(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}
    const warehouse = new Warehouse(user.Email)
    let data = await warehouse.userGet(WarehouseId)
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

    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}

    const warehouse = new Warehouse(user.Email)
    let data = await warehouse.userGet(WarehouseId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }

    await warehouse.userCreateOrUpdate(WarehouseId,params)

    let result = _.merge(data, params)

    res.json({message: "successfully updated", data: result});
  }

  static async delete(req: any, res: any) {
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {WarehouseId: WarehouseId}

    const warehouse = new Warehouse(user.Email)
    let data = await warehouse.userGet(WarehouseId)
    if(_.isEmpty(data)){
      return res.status(404).json({ error: "Data not found" });
    }
    
    await warehouse.delete(WarehouseId)

    res.json({message: "successfully deleted", data: data});
  }

}

function getId(url: string){
  let path = url.split('?')[0]
  // console.log("path ",path)
  let value = path.split('/').slice(-1)[0]
  // console.log("value ",value)
  return value
}