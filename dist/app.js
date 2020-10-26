"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lambdaHandler = void 0;

var _serverlessHttp = _interopRequireDefault(require("serverless-http"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _routes = _interopRequireDefault(require("./routes"));

var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
})); // Middleware function for show request log

app.use(function (req, res, next) {
  var params = Object.assign(Buffer.isBuffer(req.body) ? {} : req.body, req.query, req.params);
  res.locals.params = Object.assign({}, params);
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} -- Params : ${JSON.stringify(hideSecret(params))}`);
  params = null;
  next();
}); // routes(app)

app.use('/', _routes.default); //The 404 Route (ALWAYS Keep this as the last route)

app.all('*', function (req, res) {
  res.status(404).json({
    error: `Not Found Method ------: ${req.method}, Route :'${req.url}'`
  });
}); // error-handling middleware functions

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error"
  });
});
var lambdaHandler = (0, _serverlessHttp.default)(app);
exports.lambdaHandler = lambdaHandler;

function hideSecret(params) {
  for (var property in params) {
    if (/password/.test(property.toLowerCase())) {
      params[property] = "******";
    } else if (/token/.test(property.toLowerCase())) {
      params[property] = "******";
    }
  }

  return params;
}