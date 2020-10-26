"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var cognitoIdentityServiceProvider = new _awsSdk.default.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    (0, _classCallCheck2.default)(this, AuthController);
  }

  (0, _createClass2.default)(AuthController, null, [{
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res) {
        var params, headers, email, password, auth, buffDecodeAuth, decodeAuth, adminInitiateAuthparams;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);
                headers = _objectSpread({}, req.headers);

                if (!(headers.authorization == undefined || headers.authorization == '' || !/(?:Basic)\s([-0-9a-zA-z\.]){8,}/.test(headers.authorization))) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", res.status(401).json({
                  error: 'Invalid authorization'
                }));

              case 6:
                auth = headers.authorization.split(' ');
                buffDecodeAuth = Buffer.from(auth[1], 'base64');
                decodeAuth = buffDecodeAuth.toString('ascii');

                if (!isEmailFormat(decodeAuth.split(':')[0])) {
                  _context2.next = 13;
                  break;
                }

                email = decodeAuth.split(':')[0];
                _context2.next = 14;
                break;

              case 13:
                return _context2.abrupt("return", res.status(400).json({
                  error: 'Username must valid email format'
                }));

              case 14:
                password = decodeAuth.split(':')[1];
                adminInitiateAuthparams = {
                  AuthFlow: 'ADMIN_NO_SRP_AUTH',
                  //// required, accepts USER_SRP_AUTH, REFRESH_TOKEN_AUTH, REFRESH_TOKEN, CUSTOM_AUTH, ADMIN_NO_SRP_AUTH, USER_PASSWORD_AUTH
                  ClientId: process.env.COGNITO_CLIENT_ID,
                  UserPoolId: process.env.COGNITO_USER_POOL_ID,
                  AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                  }
                };
                _context2.next = 18;
                return cognitoIdentityServiceProvider.adminInitiateAuth(adminInitiateAuthparams).promise().then( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(data) {
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            res.json({
                              data: data.AuthenticationResult
                            });

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3) {
                    return _ref.apply(this, arguments);
                  };
                }(), function (error) {
                  console.log('ERROR [adminInitiateAuth]:', JSON.stringify(error));
                  res.status(400).json({
                    error: error.message
                  });
                });

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res) {
        var params, user, globalSignOutparams;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);
                _context3.next = 3;
                return verifyOAuth2Bearer(req.headers.authorization);

              case 3:
                user = _context3.sent;

                if (user.status) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 6:
                globalSignOutparams = {
                  AccessToken: user.AccessToken
                  /* required */

                };
                _context3.next = 9;
                return cognitoIdentityServiceProvider.globalSignOut(globalSignOutparams).promise().then(function (data) {
                  res.json({
                    message: 'Your has been successfully logout!'
                  });
                }, function (error) {
                  console.log('ERROR [globalSignOut]:', JSON.stringify(error));
                  res.status(error.statusCode).json({
                    error: error.message
                  });
                });

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function logout(_x4, _x5) {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "signup",
    value: function () {
      var _signup = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(req, res) {
        var params, signUpParams, resp;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);

                if (!(params.Email == undefined && params.Email == null)) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt("return", res.status(400).json({
                  error: "Parameter [Email] are required & not blanks!"
                }));

              case 3:
                if (isEmailFormat(params.Email)) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", res.status(400).json({
                  error: `Invalid Email format '${params.Email}' `
                }));

              case 5:
                if (!(params.Password == undefined && params.Password == null)) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt("return", res.status(400).json({
                  error: "Parameter [Password] are required & not blanks!"
                }));

              case 7:
                signUpParams = {
                  ClientId: process.env.COGNITO_CLIENT_ID,

                  /* required */
                  Username: params.Email,

                  /* required */
                  Password: params.Password,

                  /* required */
                  UserAttributes: [{
                    Name: "email",

                    /* required */
                    Value: params.Email
                  }]
                };
                _context5.next = 10;
                return cognitoIdentityServiceProvider.signUp(signUpParams).promise().then(function (data) {
                  console.log("data", JSON.stringify(data));
                  res.json({
                    message: "Signup Success"
                  });
                }, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(err) {
                    var UserStatus, adminGetUserParams;
                    return _regenerator.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            console.log("ERROR [signUp]:", JSON.stringify(err));
                            UserStatus = null;
                            /* CHECK USER STATUS, ONLY RETURN WHEN STATUS 'UNCONFIRMED' */

                            /* ----- BEGIN ADMIN GET USER ----- */

                            adminGetUserParams = {
                              UserPoolId: process.env.COGNITO_USER_POOL_ID,

                              /* required */
                              Username: params.Email
                              /* required */

                            };
                            _context4.next = 5;
                            return cognitoIdentityServiceProvider.adminGetUser(adminGetUserParams).promise().then(function (respAdminGetUser) {
                              console.log("respAdminGetUser", JSON.stringify(respAdminGetUser));

                              if (respAdminGetUser.UserStatus == "UNCONFIRMED") {
                                UserStatus = "UNCONFIRMED";
                              }
                            }, function (errorAdminGetUser) {
                              console.log("ERROR [adminGetUser]:", JSON.stringify(errorAdminGetUser));
                            });

                          case 5:
                            /* ----- END ADMIN GET USER   ----- */
                            if (UserStatus != null) {
                              res.status(400).json({
                                error: err.message,
                                UserStatus: UserStatus
                              });
                            } else {
                              res.status(400).json({
                                error: err.message
                              });
                            }

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x8) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 10:
                resp = _context5.sent;

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function signup(_x6, _x7) {
        return _signup.apply(this, arguments);
      }

      return signup;
    }()
  }, {
    key: "confirmSignup",
    value: function () {
      var _confirmSignup = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(req, res) {
        var params, confirmSignUpParams, resp;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);

                if (!(params.Email == undefined && params.Email == null)) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return", res.status(400).json({
                  status: false,
                  error: "Parameter [Email] are required & not blanks!"
                }));

              case 3:
                if (!(params.ConfirmationCode == undefined && params.ConfirmationCode == null)) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", res.status(400).json({
                  status: false,
                  error: "Parameter [ConfirmationCode] are required & not blanks!"
                }));

              case 5:
                confirmSignUpParams = {
                  ClientId: process.env.COGNITO_CLIENT_ID,

                  /* required */
                  ConfirmationCode: params.ConfirmationCode,

                  /* required */
                  Username: params.Email,

                  /* required */
                  ForceAliasCreation: false
                };
                _context6.next = 8;
                return cognitoIdentityServiceProvider.confirmSignUp(confirmSignUpParams).promise().then(function (data) {
                  /* process the data */
                  res.json({
                    status: true,
                    data: "Signup Confimation Success"
                  });
                }, function (error) {
                  /* handle the error */
                  console.log("ERROR [confirmSignUp]:", JSON.stringify(error));
                  res.status(error.statusCode).json({
                    status: false,
                    error: error.message
                  });
                });

              case 8:
                resp = _context6.sent;

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function confirmSignup(_x9, _x10) {
        return _confirmSignup.apply(this, arguments);
      }

      return confirmSignup;
    }()
  }, {
    key: "forgotPassword",
    value: function () {
      var _forgotPassword = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(req, res) {
        var params, forgotPasswordParams, resp;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);

                if (!(params.Email == undefined && params.Email == null)) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return", res.status(400).json({
                  status: false,
                  error: 'Parameter [Email] is required and cannot be blank'
                }));

              case 3:
                forgotPasswordParams = {
                  ClientId: process.env.COGNITO_CLIENT_ID,
                  Username: params.Email
                };
                _context7.next = 6;
                return cognitoIdentityServiceProvider.forgotPassword(forgotPasswordParams).promise().then(function (data) {
                  res.json({
                    message: 'A confirmation code has been sent to your email. Use the code to reset your password.'
                  });
                }, function (error) {
                  console.log("ERROR [resendConfirmationCode]:", JSON.stringify(error));
                  res.status(error.statusCode).json({
                    error: error.message
                  });
                });

              case 6:
                resp = _context7.sent;

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function forgotPassword(_x11, _x12) {
        return _forgotPassword.apply(this, arguments);
      }

      return forgotPassword;
    }()
  }, {
    key: "confirmForgotPassword",
    value: function () {
      var _confirmForgotPassword = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(req, res) {
        var params, confirmForgotPasswordParams, resp;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);

                if (!(params.Email == undefined && params.Email == null)) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt("return", res.status(400).json({
                  status: false,
                  error: 'Parameter [Email] is required and cannot be blank'
                }));

              case 3:
                if (!(params.ConfirmationCode == undefined && params.ConfirmationCode == null)) {
                  _context8.next = 5;
                  break;
                }

                return _context8.abrupt("return", res.status(400).json({
                  status: false,
                  error: 'Parameter [ConfirmationCode] is required and cannot be blank'
                }));

              case 5:
                if (!(params.Password == undefined && params.Password == null)) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt("return", res.status(400).json({
                  status: false,
                  error: 'Parameter [Password] is required and cannot be blank'
                }));

              case 7:
                confirmForgotPasswordParams = {
                  ClientId: process.env.COGNITO_CLIENT_ID,
                  ConfirmationCode: params.ConfirmationCode,
                  Username: params.Email,
                  Password: params.Password
                };
                _context8.next = 10;
                return cognitoIdentityServiceProvider.confirmForgotPassword(confirmForgotPasswordParams).promise().then(function (data) {
                  res.json({
                    message: 'Your password has been successfully reset!'
                  });
                }, function (error) {
                  console.log('ERROR [confirmForgotPassword]:', JSON.stringify(error));
                  res.status(error.statusCode).json({
                    error: error.message
                  });
                });

              case 10:
                resp = _context8.sent;

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function confirmForgotPassword(_x13, _x14) {
        return _confirmForgotPassword.apply(this, arguments);
      }

      return confirmForgotPassword;
    }()
  }, {
    key: "changePassword",
    value: function () {
      var _changePassword = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(req, res) {
        var params, user, resp;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);
                _context9.next = 3;
                return verifyOAuth2Bearer(req.headers.authorization);

              case 3:
                user = _context9.sent;

                if (user.status) {
                  _context9.next = 6;
                  break;
                }

                return _context9.abrupt("return", res.status(400).json({
                  error: user.error
                }, 401));

              case 6:
                if (!(params.OldPassword == undefined && params.OldPassword == null)) {
                  _context9.next = 8;
                  break;
                }

                return _context9.abrupt("return", res.status(400).json({
                  error: 'Parameter [OldPassword] is required and cannot be blank'
                }));

              case 8:
                if (!(params.NewPassword == undefined && params.NewPassword == null)) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt("return", res.status(400).json({
                  error: 'Parameter [NewPassword] is required and cannot be blank'
                }));

              case 10:
                _context9.next = 12;
                return cognitoIdentityServiceProvider.changePassword({
                  AccessToken: user.AccessToken,
                  PreviousPassword: params.OldPassword,
                  ProposedPassword: params.NewPassword
                }).promise().then(function (data) {
                  res.json({
                    message: 'Your password has been successfully changed!'
                  });
                }, function (error) {
                  console.log('ERROR [changePassword]:', JSON.stringify(error));
                  res.status(error.statusCode).json({
                    error: error.message
                  });
                });

              case 12:
                resp = _context9.sent;

              case 13:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function changePassword(_x15, _x16) {
        return _changePassword.apply(this, arguments);
      }

      return changePassword;
    }()
  }, {
    key: "refressToken",
    value: function () {
      var _refressToken = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(req, res) {
        var params, adminInitiateAuthParam, resp;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                params = _objectSpread({}, res.locals.params);

                if (!(params.RefreshToken == undefined && params.RefreshToken == null)) {
                  _context10.next = 3;
                  break;
                }

                return _context10.abrupt("return", res.status(400).json({
                  status: false,
                  error: 'Parameter [RefreshToken] is required and cannot be blank'
                }));

              case 3:
                adminInitiateAuthParam = {
                  AuthFlow: 'REFRESH_TOKEN_AUTH',

                  /* required */
                  // USER_SRP_AUTH | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH, /* required */
                  ClientId: process.env.COGNITO_CLIENT_ID,
                  UserPoolId: process.env.COGNITO_USER_POOL_ID,
                  AuthParameters: {
                    REFRESH_TOKEN: params.RefreshToken
                  }
                };
                _context10.next = 6;
                return cognitoIdentityServiceProvider.adminInitiateAuth(adminInitiateAuthParam).promise().then(function (data) {
                  return res.json({
                    data: data.AuthenticationResult
                  });
                }, function (error) {
                  console.log('ERROR [adminInitiateAuth]:', JSON.stringify(error));
                  return res.status(error.statusCode).json({
                    error: error.message
                  });
                });

              case 6:
                resp = _context10.sent;

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function refressToken(_x17, _x18) {
        return _refressToken.apply(this, arguments);
      }

      return refressToken;
    }()
  }]);
  return AuthController;
}();

exports.default = AuthController;

function isEmailFormat(str) {
  /****
    To Check Date string is a valid email format
  ****/
  var EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EmailRegex.test(str);
}

function verifyOAuth2Bearer(_x19) {
  return _verifyOAuth2Bearer.apply(this, arguments);
}

function _verifyOAuth2Bearer() {
  _verifyOAuth2Bearer = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(BearerToken) {
    var AccessToken, resp;
    return _regenerator.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (/^[Bb]earer [-0-9a-zA-z\.]*$/.test(BearerToken)) {
              _context11.next = 2;
              break;
            }

            return _context11.abrupt("return", {
              status: false,
              error: "invalid authorization format"
            });

          case 2:
            /* GET ONLY ACCESS TOKEN WITH WORD 'Bearer' */
            AccessToken = BearerToken.split(" ")[1]; // console.log("AccessToken ",AccessToken)

            _context11.next = 5;
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
            resp = _context11.sent;
            return _context11.abrupt("return", resp);

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _verifyOAuth2Bearer.apply(this, arguments);
}