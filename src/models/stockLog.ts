import DynamoDbManager from './dynamoDbManager'

export default class StockLog extends DynamoDbManager {
  scan() {
    return new Promise(async (resolve,reject) => {
      let params = {
        TableName: process.env.TABLE_STOCK_LOG || "",
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
  
  createOrUpdate(id:string,timestamp:string ,params: any) {
    return new Promise(async (resolve,reject) => {
      let expression = this.createDynamoDBExpressionAttribute(params);
      let paramsUpdated = {
        TableName: process.env.TABLE_STOCK_LOG || "",
        Key: {
          ProductId: id,
          Timestamp: timestamp
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
        TableName: process.env.TABLE_STOCK_LOG || "",
        KeyConditionExpression: '#EKEY = :ekey',
        ExpressionAttributeNames: { 
          '#EKEY': 'ProductId' 
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
        TableName: process.env.TABLE_STOCK_LOG || "",
        Key: {
          ProductId: id
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

  getLogger(id:string) {
    return new Promise(async (resolve,reject) => {
      let paramsUpdated = {
        TableName: process.env.TABLE_STOCK_LOG || "",
        KeyConditionExpression: '#EKEY = :ekey',
        ExpressionAttributeNames: { 
          '#EKEY': 'ProductId' 
        },
        ExpressionAttributeValues: { 
          ':ekey': id 
        },
        ScanIndexForward: false
      }
  
      await this.dynamodb.query(paramsUpdated).promise()
      .then(
        (data:any ) => {
          resolve(data.Items)
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }
  
}