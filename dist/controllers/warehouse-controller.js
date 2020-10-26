"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _services = require("../utils/services");

var _uuid = require("uuid");

var _models = require("../models");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// const warehouse = new Warehouse()
var WarehouseController = /*#__PURE__*/function () {
  function WarehouseController() {
    (0, _classCallCheck2.default)(this, WarehouseController);
  }

  (0, _createClass2.default)(WarehouseController, null, [{
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res) {
        var user, warehouse, data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _services.verifyOAuth2Bearer)(req.headers.authorization);

              case 2:
                user = _context.sent;

                if (user.status) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 5:
                warehouse = new _models.Warehouse(user.Email);
                _context.next = 8;
                return warehouse.userGetAll();

              case 8:
                data = _context.sent;
                res.json({
                  data: data
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAll(_x, _x2) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
  }, {
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res) {
        var user, params, WarehouseId, warehouse, data;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _services.verifyOAuth2Bearer)(req.headers.authorization);

              case 2:
                user = _context2.sent;

                if (user.status) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 5:
                params = _objectSpread({}, res.locals.params);
                WarehouseId = (0, _uuid.v4)(); //GENERATE NEW ID

                warehouse = new _models.Warehouse(user.Email);
                _context2.next = 10;
                return warehouse.userCreateOrUpdate(WarehouseId, params);

              case 10:
                data = _context2.sent;
                params.WarehouseId = WarehouseId;
                res.json({
                  message: "successfully created",
                  data: params
                });

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function add(_x3, _x4) {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res) {
        var user, WarehouseId, params, warehouse, data;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _services.verifyOAuth2Bearer)(req.headers.authorization);

              case 2:
                user = _context3.sent;

                if (user.status) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 5:
                WarehouseId = getId(req.url);
                params = _objectSpread({}, res.locals.params);
                warehouse = new _models.Warehouse(user.Email);
                _context3.next = 10;
                return warehouse.userGet(WarehouseId);

              case 10:
                data = _context3.sent;

                if (!_services._.isEmpty(data)) {
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt("return", res.status(404).json({
                  error: "Data not found"
                }));

              case 13:
                res.json({
                  data: data
                });

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function get(_x5, _x6) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(req, res) {
        var user, WarehouseId, params, warehouse, data, result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _services.verifyOAuth2Bearer)(req.headers.authorization);

              case 2:
                user = _context4.sent;

                if (user.status) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", res.status(400).json({
                  error: user.error
                }));

              case 5:
                WarehouseId = getId(req.url);
                params = _objectSpread({}, res.locals.params);
                warehouse = new _models.Warehouse(user.Email);
                _context4.next = 10;
                return warehouse.userGet(WarehouseId);

              case 10:
                data = _context4.sent;

                if (!_services._.isEmpty(data)) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", res.status(404).json({
                  error: "Data not found"
                }));

              case 13:
                _context4.next = 15;
                return warehouse.userCreateOrUpdate(WarehouseId, params);

              case 15:
                result = _services._.merge(data, params);
                res.json({
                  message: "successfully updated",
                  data: result
                });

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function update(_x7, _x8) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(req, res) {
        var user, WarehouseId, params, warehouse, data;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _services.verifyOAuth2Bearer)(req.headers.authorization);

              case 2:
                user = _context5.sent;

                if (user.status) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 5:
                WarehouseId = getId(req.url);
                params = {
                  WarehouseId: WarehouseId
                };
                warehouse = new _models.Warehouse(user.Email);
                _context5.next = 10;
                return warehouse.userGet(WarehouseId);

              case 10:
                data = _context5.sent;

                if (!_services._.isEmpty(data)) {
                  _context5.next = 13;
                  break;
                }

                return _context5.abrupt("return", res.status(404).json({
                  error: "Data not found"
                }));

              case 13:
                _context5.next = 15;
                return warehouse.delete(WarehouseId);

              case 15:
                res.json({
                  message: "successfully deleted",
                  data: data
                });

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function _delete(_x9, _x10) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }]);
  return WarehouseController;
}();

exports.default = WarehouseController;

function getId(url) {
  var path = url.split('?')[0]; // console.log("path ",path)

  var value = path.split('/').slice(-1)[0]; // console.log("value ",value)

  return value;
}