"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

// const dynamodb = new AWS.DynamoDB.DocumentClient({
//   apiVersion: '2012-08-10',
//   // region: process.env.REGION
// });
var DynamoDbManager = /*#__PURE__*/function () {
  function DynamoDbManager() {
    (0, _classCallCheck2.default)(this, DynamoDbManager);
    (0, _defineProperty2.default)(this, "dynamodb", new _awsSdk.default.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10' // region: process.env.REGION

    }));
  }

  (0, _createClass2.default)(DynamoDbManager, [{
    key: "createDynamoDBExpressionAttribute",
    value: function createDynamoDBExpressionAttribute(attributes) {
      /****
        To Create DynamoDB Expression Attribute 
      ****/
      var newValue = {
        UpdateExpression: 'set ',
        AttributeNames: {},
        AttributeValues: {}
      };
      var inx = 0;
      var alp = this.createCharArray('a', 'z');

      for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          newValue.UpdateExpression = newValue.UpdateExpression + `#${alp[inx]} = :${alp[inx]},`;
          newValue.AttributeNames[`#${alp[inx]}`] = key;
          newValue.AttributeValues[`:${alp[inx]}`] = attributes[key];
        }

        inx++;
      }

      newValue.UpdateExpression = newValue.UpdateExpression.substring(0, newValue.UpdateExpression.length - 1);
      return newValue;
    }
  }, {
    key: "createCharArray",
    value: function createCharArray(charA, charZ) {
      var a = [],
          i = charA.charCodeAt(0),
          j = charZ.charCodeAt(0);

      for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
      }

      return a;
    }
  }]);
  return DynamoDbManager;
}();

exports.default = DynamoDbManager;