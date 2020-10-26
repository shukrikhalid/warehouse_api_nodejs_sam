import { String } from 'aws-sdk/clients/acm'
import DynamoDbManager from './dynamoDbManager'

export default class Warehouse extends DynamoDbManager {
  private email:String

  constructor(email:string = "") {
    super()
    this.email = email
  }

  scan() {
    return new Promise(async (resolve,reject) => {
      // console.log("TABLE_WAREHOUSE ",process.env.TABLE_WAREHOUSE)
      let params = {
        TableName: process.env.TABLE_WAREHOUSE || "",
      }
      await this.dynamodb.scan(params).promise().then(
        (data: any) => {
  
          resolve(data.Items)
        },
        (err: any) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }
  
  createOrUpdate(id:string ,params: any) {
    return new Promise(async (resolve,reject) => {
      let expression = this.createDynamoDBExpressionAttribute(params);
      let paramsUpdated = {
        TableName: process.env.TABLE_WAREHOUSE || "",
        Key: {
          WarehouseId: id
        },
        UpdateExpression: expression.UpdateExpression,
        ExpressionAttributeNames: expression.AttributeNames,
        ExpressionAttributeValues: expression.AttributeValues
      }
  
      await this.dynamodb.update(paramsUpdated).promise()
      .then(
        (data) => {
          resolve()
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }
  
  get(id:string) {
    return new Promise(async (resolve,reject) => {
      let paramsUpdated = {
        TableName: process.env.TABLE_WAREHOUSE || "",
        KeyConditionExpression: '#EKEY = :ekey',
        ExpressionAttributeNames: { 
          '#EKEY': 'WarehouseId' 
        },
        ExpressionAttributeValues: { 
          ':ekey': id 
        },
      }
  
      await this.dynamodb.query(paramsUpdated).promise()
      .then(
        (data:any ) => {
          resolve(data.Items[0])
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }
  
  delete(id:string) {
    return new Promise(async (resolve,reject) => {
      let paramsUpdated = {
        TableName: process.env.TABLE_WAREHOUSE || "",
        Key: {
          WarehouseId: id
        }
      }
  
      await this.dynamodb.delete(paramsUpdated).promise()
      .then(
        (data:any ) => {
          resolve()
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }

  userGetAll() {
    return new Promise(async (resolve,reject) => {
      let paramsQuery:any
      paramsQuery = {
        TableName: process.env.TABLE_WAREHOUSE,
        IndexName: 'Email_index',
        KeyConditionExpression: '#EKEY = :ekey',
        ExpressionAttributeValues: { 
          ':ekey': this.email
        },
        ExpressionAttributeNames: {
          '#EKEY': 'Email' 
        },
      }
  
      await this.dynamodb.query(paramsQuery).promise()
      .then(
        (data) => {
          resolve(data.Items)
        },
        (err) => {
          console.log("ERROR [dynamoDB.query]:",JSON.stringify({params: paramsQuery, error: err}))
          reject(err)
        }
      )
    })
  }

  userCreateOrUpdate(id:string ,params: any) {
    return new Promise(async (resolve,reject) => {
      params.Email = this.email
      let expression = this.createDynamoDBExpressionAttribute(params);
      let paramsUpdated = {
        TableName: process.env.TABLE_WAREHOUSE || "",
        Key: {
          WarehouseId: id
        },
        UpdateExpression: expression.UpdateExpression,
        ExpressionAttributeNames: expression.AttributeNames,
        ExpressionAttributeValues: expression.AttributeValues
      }
  
      await this.dynamodb.update(paramsUpdated).promise()
      .then(
        (data) => {
          resolve()
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }

  userGet(id:string) {
    return new Promise(async (resolve,reject) => {
      let paramsQuery = {
        TableName: process.env.TABLE_WAREHOUSE || "",
        KeyConditionExpression: '#EKEY = :ekey',
        ExpressionAttributeNames: { 
          '#EKEY': 'WarehouseId',
          '#Email': 'Email'
        },
        ExpressionAttributeValues: { 
          ':ekey': id ,
          ':email': this.email
        },
        FilterExpression: "#Email = :email"
      }
  
      await this.dynamodb.query(paramsQuery).promise()
      .then(
        (data:any ) => {
          resolve(data.Items[0])
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }
  
}