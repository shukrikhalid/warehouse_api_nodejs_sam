"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dynamoDbManager = _interopRequireDefault(require("./dynamoDbManager"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Warehouse = /*#__PURE__*/function (_DynamoDbManager) {
  (0, _inherits2.default)(Warehouse, _DynamoDbManager);

  var _super = _createSuper(Warehouse);

  function Warehouse() {
    (0, _classCallCheck2.default)(this, Warehouse);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Warehouse, [{
    key: "scan",
    value: function scan() {
      var _this = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(resolve, reject) {
          var params;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // console.log("TABLE_WAREHOUSE ",process.env.TABLE_WAREHOUSE)
                  params = {
                    TableName: process.env.TABLE_WAREHOUSE || ""
                  };
                  _context.next = 3;
                  return _this.dynamodb.scan(params).promise().then(function (data) {
                    resolve(data.Items);
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "createOrUpdate",
    value: function createOrUpdate(id, params) {
      var _this2 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(resolve, reject) {
          var expression, paramsUpdated;
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  expression = _this2.createDynamoDBExpressionAttribute(params);
                  paramsUpdated = {
                    TableName: process.env.TABLE_WAREHOUSE || "",
                    Key: {
                      WarehouseId: id
                    },
                    UpdateExpression: expression.UpdateExpression,
                    ExpressionAttributeNames: expression.AttributeNames,
                    ExpressionAttributeValues: expression.AttributeValues
                  };
                  _context2.next = 4;
                  return _this2.dynamodb.update(paramsUpdated).promise().then(function (data) {
                    resolve();
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "get",
    value: function get(id) {
      var _this3 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(resolve, reject) {
          var paramsUpdated;
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  paramsUpdated = {
                    TableName: process.env.TABLE_WAREHOUSE || "",
                    KeyConditionExpression: '#EKEY = :ekey',
                    ExpressionAttributeNames: {
                      '#EKEY': 'WarehouseId'
                    },
                    ExpressionAttributeValues: {
                      ':ekey': id
                    }
                  };
                  _context3.next = 3;
                  return _this3.dynamodb.query(paramsUpdated).promise().then(function (data) {
                    resolve(data.Items[0]);
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 3:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x5, _x6) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var _this4 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(resolve, reject) {
          var paramsUpdated;
          return _regenerator.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  paramsUpdated = {
                    TableName: process.env.TABLE_WAREHOUSE || "",
                    Key: {
                      WarehouseId: id
                    }
                  };
                  _context4.next = 3;
                  return _this4.dynamodb.delete(paramsUpdated).promise().then(function (data) {
                    resolve();
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 3:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x7, _x8) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }]);
  return Warehouse;
}(_dynamoDbManager.default);

exports.default = Warehouse;