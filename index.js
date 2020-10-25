let lambdaHandler = null

if(process.env.AWS_SAM_LOCAL == 'true') {
  // require('dotenv').config()
  require("./env")
  require('@babel/register')({
    extensions: ['.js', '.ts']
  })
  
  lambdaHandler = require('./src/app')
} else {
  lambdaHandler = require('./dist/app')
}

module.exports = lambdaHandler