"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmailFormat = isEmailFormat;
exports.verifyOAuth2Bearer = verifyOAuth2Bearer;
Object.defineProperty(exports, "_", {
  enumerable: true,
  get: function get() {
    return _lodash.default;
  }
});
exports.cognitoIdentityServiceProvider = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _lodash = _interopRequireDefault(require("lodash"));

var cognitoIdentityServiceProvider = new _awsSdk.default.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});
exports.cognitoIdentityServiceProvider = cognitoIdentityServiceProvider;

function isEmailFormat(str) {
  /****
    To Check Date string is a valid email format
  ****/
  var EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EmailRegex.test(str);
}

function verifyOAuth2Bearer(_x) {
  return _verifyOAuth2Bearer.apply(this, arguments);
}

function _verifyOAuth2Bearer() {
  _verifyOAuth2Bearer = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(BearerToken) {
    var AccessToken, resp;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (/^[Bb]earer [-0-9a-zA-z\.]*$/.test(BearerToken)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", {
              status: false,
              error: "invalid authorization format"
            });

          case 2:
            /* GET ONLY ACCESS TOKEN WITH WORD 'Bearer' */
            AccessToken = BearerToken.split(" ")[1]; // console.log("AccessToken ",AccessToken)

            _context.next = 5;
            return cognitoIdentityServiceProvider.getUser({
              AccessToken: AccessToken
              /* required */

            }).promise().then(function (data) {
              /* process the data */
              // console.log("data", JSON.stringify(data))
              console.log(`VERIFY   => USER : ${data.Username}`);
              return {
                status: true,
                Email: data.Username,
                AccessToken: AccessToken
              };
            }, function (error) {
              /* handle the error */
              console.log("ERROR [getUser]:", JSON.stringify(error));
              return {
                status: false,
                error: error.message
              };
            });

          case 5:
            resp = _context.sent;
            return _context.abrupt("return", resp);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _verifyOAuth2Bearer.apply(this, arguments);
}