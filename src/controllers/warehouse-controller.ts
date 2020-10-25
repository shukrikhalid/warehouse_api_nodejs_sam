import { v4 as uuidv4 } from 'uuid';

import {Warehouse} from '../models'
const warehouse = new Warehouse()

export default class WarehouseController {
  static async getAll(req: any, res: any) {

    let data = await warehouse.scan()
    res.json({data: data});
  }

  static async add(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}

    const WarehouseId = uuidv4() //GENERATE NEW ID

    let data = await warehouse.createOrUpdate(WarehouseId,params)
    params.WarehouseId = WarehouseId

    res.json({message: "successfully created", data: params});
  }

  static async get(req: any, res: any) {
    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}

    let data = await warehouse.get(WarehouseId)

    res.json({data: data});
  }

  static async update(req: any, res: any) {
    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {...res.locals.params}

    let data = await warehouse.createOrUpdate(WarehouseId,params)
    params.WarehouseId = WarehouseId

    res.json({message: "successfully updated", data: params});
  }

  static async delete(req: any, res: any) {
    const WarehouseId = getId(req.url)
    let params:any 
    
    params = {WarehouseId: WarehouseId}

    let data = await warehouse.delete(WarehouseId)

    res.json({message: "successfully deleted", data: params});
  }

}

function getId(url: string){
  let path = url.split('?')[0]
  // console.log("path ",path)
  let value = path.split('/').slice(-1)[0]
  // console.log("value ",value)
  return value
}