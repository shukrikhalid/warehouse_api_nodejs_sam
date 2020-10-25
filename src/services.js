const AWS = require('aws-sdk');
process.env.REGION = process.env.REGION || 'ap-southeast-1'

// const sns = new AWS.SNS({
//   apiVersion: '2010-03-31',
//     region: process.env.REGION
// });

exports.renderJson = (body, statusCode=200 ) => {
  response = {
    'statusCode': statusCode,
    'body': JSON.stringify(body),
    'headers': {
      // This is ALSO required for CORS to work. When browsers issue cross origin requests, they make a 
      // preflight request (HTTP Options) which is responded automatically based on SAM configuration. 
      // But the actual HTTP request (GET/POST etc) also needs to contain the AllowOrigin header. 
      // 
      // NOTE: This value is *not* double quoted: ie. "'www.example.com'" is wrong
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Api-Key,api-key",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PUT"
    }
  }

  if (statusCode != 200) {
    console.log(`RESPONSE => CODE:${response.statusCode}  BODY:${response.body} `)
  }else{
    console.log(`RESPONSE => CODE:${response.statusCode} `)
  }

  return response
}

exports.hideSecret = (params) => {
  for (var property in params) {
    if (/password/.test(property.toLowerCase())) {
      params[property] = "******"
    }
    else if (/token/.test(property.toLowerCase())) {
      params[property] = "******"
    }
  }

  return params
}


exports.verifyOAuth2Bearer = async (BearerToken) => {
  if ( !(/^[Bb]earer [-0-9a-zA-z\.]*$/.test(BearerToken) ) ) {
    return {status: false, error: "invalid authorization format" }
  }

  /* GET ONLY ACCESS TOKEN WITH WORD 'Bearer' */
  let AccessToken =  BearerToken.split(" ")[1]
  // console.log("AccessToken ",AccessToken)

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
      region: process.env.COGNITO_REGION
  });

  //// COGNITO IdP VERIFICATION
  console.log("COGNITO IdP VERIFICATION -------")
  resp = await cognitoIdentityServiceProvider.getUser({
    AccessToken: AccessToken /* required */
  }).promise()
  .then(
    (data) => {
      /* process the data */
      // console.log("data", JSON.stringify(data))
      console.log(`VERIFY   => USER : ${data.Username}`)
      return {status: true, Email: data.Username, AccessToken: AccessToken  }
    },
    (error) => {
      /* handle the error */
      console.log("ERROR [getUser]:" ,JSON.stringify(error) )
      return {status: false, error: error.message }
    }
  );

  return resp
  // Payload 
  // Access Token has expired
  // Invalid Access Token
  
}

exports.isIsoDate = (str) => {
  /****
    To Check Date string is a valid ISO8601 
    YYYY-MM-DDTHH:MN:SS.MSSZ

    Ref https://en.wikipedia.org/wiki/ISO_8601
  ****/
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str); 
  return d.toISOString()===str;
}

exports.isEmailFormat = (str) => {
  /****
    To Check Date string is a valid email format
  ****/
  let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  return EmailRegex.test(str)
}

exports.createDynamoDBExpressionAttribute = (attributes) => {
  /****
    To Create DynamoDB Expression Attribute 
  ****/
  var newValue = {
    UpdateExpression: 'set ',
    AttributeNames: {},
    AttributeValues: {}
  }

  var inx = 0;
  var alp = createCharArray('a', 'z');
  for (key in attributes) {
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

function createCharArray(charA, charZ) {

  var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);

  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }

  return a;
}