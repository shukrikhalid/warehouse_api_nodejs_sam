"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var AWS = require('aws-sdk');

process.env.REGION = process.env.REGION || 'ap-southeast-1'; // const sns = new AWS.SNS({
//   apiVersion: '2010-03-31',
//     region: process.env.REGION
// });

exports.renderJson = function (body) {
  var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
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
  };

  if (statusCode != 200) {
    console.log(`RESPONSE => CODE:${response.statusCode}  BODY:${response.body} `);
  } else {
    console.log(`RESPONSE => CODE:${response.statusCode} `);
  }

  return response;
};

exports.hideSecret = function (params) {
  for (var property in params) {
    if (/password/.test(property.toLowerCase())) {
      params[property] = "******";
    } else if (/token/.test(property.toLowerCase())) {
      params[property] = "******";
    }
  }

  return params;
};

exports.verifyOAuth2Bearer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(BearerToken) {
    var AccessToken, cognitoIdentityServiceProvider;
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

            cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
              apiVersion: '2016-04-18',
              region: process.env.COGNITO_REGION
            }); //// COGNITO IdP VERIFICATION

            console.log("COGNITO IdP VERIFICATION -------");
            _context.next = 7;
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

          case 7:
            resp = _context.sent;
            return _context.abrupt("return", resp);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.isIsoDate = function (str) {
  /****
    To Check Date string is a valid ISO8601 
    YYYY-MM-DDTHH:MN:SS.MSSZ
     Ref https://en.wikipedia.org/wiki/ISO_8601
  ****/
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
};

exports.isEmailFormat = function (str) {
  /****
    To Check Date string is a valid email format
  ****/
  var EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EmailRegex.test(str);
};

exports.createDynamoDBExpressionAttribute = function (attributes) {
  /****
    To Create DynamoDB Expression Attribute 
  ****/
  var newValue = {
    UpdateExpression: 'set ',
    AttributeNames: {},
    AttributeValues: {}
  };
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

  newValue.UpdateExpression = newValue.UpdateExpression.substring(0, newValue.UpdateExpression.length - 1);
  return newValue;
};

function createCharArray(charA, charZ) {
  var a = [],
      i = charA.charCodeAt(0),
      j = charZ.charCodeAt(0);

  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }

  return a;
}