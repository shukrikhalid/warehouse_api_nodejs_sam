import AWS from 'aws-sdk'

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

import _ from 'lodash'

function isEmailFormat(str:string ){
  /****
    To Check Date string is a valid email format
  ****/
  let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  return EmailRegex.test(str)
}

async function verifyOAuth2Bearer (BearerToken:string ) {
  if ( !(/^[Bb]earer [-0-9a-zA-z\.]*$/.test(BearerToken) ) ) {
    return {status: false, error: "invalid authorization format" }
  }

  /* GET ONLY ACCESS TOKEN WITH WORD 'Bearer' */
  let AccessToken =  BearerToken.split(" ")[1]
  // console.log("AccessToken ",AccessToken)

  let resp = await cognitoIdentityServiceProvider.getUser({
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
}

export {
  _,
  cognitoIdentityServiceProvider,
  isEmailFormat,
  verifyOAuth2Bearer,
}