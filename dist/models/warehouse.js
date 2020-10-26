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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _dynamoDbManager = _interopRequireDefault(require("./dynamoDbManager"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Warehouse = /*#__PURE__*/function (_DynamoDbManager) {
  (0, _inherits2.default)(Warehouse, _DynamoDbManager);

  var _super = _createSuper(Warehouse);

  function Warehouse() {
    var _this;

    var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    (0, _classCallCheck2.default)(this, Warehouse);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "email", void 0);
    _this.email = email;
    return _this;
  }

  (0, _createClass2.default)(Warehouse, [{
    key: "scan",
    value: function scan() {
      var _this2 = this;

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
                  return _this2.dynamodb.scan(params).promise().then(function (data) {
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
      var _this3 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(resolve, reject) {
          var expression, paramsUpdated;
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  expression = _this3.createDynamoDBExpressionAttribute(params);
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
                  return _this3.dynamodb.update(paramsUpdated).promise().then(function (data) {
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
      var _this4 = this;

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
                  return _this4.dynamodb.query(paramsUpdated).promise().then(function (data) {
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
      var _this5 = this;

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
                  return _this5.dynamodb.delete(paramsUpdated).promise().then(function (data) {
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
  }, {
    key: "userGetAll",
    value: function userGetAll() {
      var _this6 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(resolve, reject) {
          var paramsQuery;
          return _regenerator.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  paramsQuery = {
                    TableName: process.env.TABLE_WAREHOUSE,
                    IndexName: 'Email_index',
                    KeyConditionExpression: '#EKEY = :ekey',
                    ExpressionAttributeValues: {
                      ':ekey': _this6.email
                    },
                    ExpressionAttributeNames: {
                      '#EKEY': 'Email'
                    }
                  };
                  _context5.next = 3;
                  return _this6.dynamodb.query(paramsQuery).promise().then(function (data) {
                    resolve(data.Items);
                  }, function (err) {
                    console.log("ERROR [dynamoDB.query]:", JSON.stringify({
                      params: paramsQuery,
                      error: err
                    }));
                    reject(err);
                  });

                case 3:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x9, _x10) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "userCreateOrUpdate",
    value: function userCreateOrUpdate(id, params) {
      var _this7 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(resolve, reject) {
          var expression, paramsUpdated;
          return _regenerator.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  params.Email = _this7.email;
                  expression = _this7.createDynamoDBExpressionAttribute(params);
                  paramsUpdated = {
                    TableName: process.env.TABLE_WAREHOUSE || "",
                    Key: {
                      WarehouseId: id
                    },
                    UpdateExpression: expression.UpdateExpression,
                    ExpressionAttributeNames: expression.AttributeNames,
                    ExpressionAttributeValues: expression.AttributeValues
                  };
                  _context6.next = 5;
                  return _this7.dynamodb.update(paramsUpdated).promise().then(function (data) {
                    resolve();
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 5:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x11, _x12) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "userGet",
    value: function userGet(id) {
      var _this8 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(resolve, reject) {
          var paramsQuery;
          return _regenerator.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  paramsQuery = {
                    TableName: process.env.TABLE_WAREHOUSE || "",
                    KeyConditionExpression: '#EKEY = :ekey',
                    ExpressionAttributeNames: {
                      '#EKEY': 'WarehouseId',
                      '#Email': 'Email'
                    },
                    ExpressionAttributeValues: {
                      ':ekey': id,
                      ':email': _this8.email
                    },
                    FilterExpression: "#Email = :email"
                  };
                  _context7.next = 3;
                  return _this8.dynamodb.query(paramsQuery).promise().then(function (data) {
                    resolve(data.Items[0]);
                  }, function (err) {
                    console.log(err);
                    reject(err);
                  });

                case 3:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x13, _x14) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
  }]);
  return Warehouse;
}(_dynamoDbManager.default);

exports.default = Warehouse;