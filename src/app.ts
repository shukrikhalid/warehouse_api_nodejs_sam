import serverless from 'serverless-http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"

import routes from './routes'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware function for show request log
app.use( (req:any, res:any , next) => {
  let params = Object.assign( (Buffer.isBuffer(req.body) ? {} : req.body), req.query, req.params);
  res.locals.params = Object.assign({}, params);

  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} -- Params : ${JSON.stringify(hideSecret(params) ) }`);
  params = null
  next();
});


// routes(app)
app.use('/', routes);

//The 404 Route (ALWAYS Keep this as the last route)
app.all('*', (req: any, res: any) => {
  res.status(404).json({
        error: `Not Found Method ------: ${req.method}, Route :'${req.url}'`
  });
});

// error-handling middleware functions
app.use( (err: any, req: any, res: any, next: any) => {

  if(err.type == "entity.parse.failed"){
    return res.status(400).json({ error: "invalid JSON format in body, Please check again your body" });
  }

  console.error(err)
  
  res.status(500).json({
    error: "Internal Server Error" 
  });
})

const lambdaHandler = serverless(app);


function hideSecret(params:any ) {
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

export {lambdaHandler}