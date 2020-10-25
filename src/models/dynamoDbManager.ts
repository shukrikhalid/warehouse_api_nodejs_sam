import AWS from 'aws-sdk';

// const dynamodb = new AWS.DynamoDB.DocumentClient({
//   apiVersion: '2012-08-10',
//   // region: process.env.REGION
// });

export default class DynamoDbManager {
  
  dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    // region: process.env.REGION
  });

  createDynamoDBExpressionAttribute(attributes: any) {
    /****
      To Create DynamoDB Expression Attribute 
    ****/
    let newValue:any = {
      UpdateExpression: 'set ',
      AttributeNames: {},
      AttributeValues: {}
    }
  
    var inx = 0;
    var alp = this.createCharArray('a', 'z');
    for (let key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          newValue.UpdateExpression = newValue.UpdateExpression + `#${alp[inx]} = :${alp[inx]},`;
          newValue.AttributeNames[`#${alp[inx]}`] = key;
          newValue.AttributeValues[`:${alp[inx]}`] = attributes[key];
        }
      inx++;
    }
  
    newValue.UpdateExpression = newValue.UpdateExpression.substring(0, newValue.UpdateExpression.length-1);
    return newValue;
  }
  
  createCharArray(charA: any, charZ: any) {
  
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
  
    for (; i <= j; ++i) {
      a.push(String.fromCharCode(i));
    }
  
    return a;
  }
}