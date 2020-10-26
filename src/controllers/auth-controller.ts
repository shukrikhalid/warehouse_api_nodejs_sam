import {
  cognitoIdentityServiceProvider,
  isEmailFormat,
  verifyOAuth2Bearer
} from '../utils/services'

export default class AuthController {
  static async login(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    let headers:any 
    headers = {...req.headers}

    let email:string
    let password:string

    if(headers.authorization == undefined || headers.authorization == '' || !( /(?:Basic)\s([-0-9a-zA-z\.]){8,}/.test(headers.authorization))) {
      return res.status(401).json({ error: 'Invalid authorization' });
    }
    else {
      let auth:any
      auth = headers.authorization.split(' ');

      let buffDecodeAuth = Buffer.from(auth[1], 'base64');
      let decodeAuth = buffDecodeAuth.toString('ascii');
    
      if(isEmailFormat(decodeAuth.split(':')[0])) {
        email = decodeAuth.split(':')[0];
      }
      else {
        return res.status(400).json({error: 'Username must valid email format' });
      }

      password = decodeAuth.split(':')[1];

      let adminInitiateAuthparams:any
      adminInitiateAuthparams = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH', //// required, accepts USER_SRP_AUTH, REFRESH_TOKEN_AUTH, REFRESH_TOKEN, CUSTOM_AUTH, ADMIN_NO_SRP_AUTH, USER_PASSWORD_AUTH
        ClientId: process.env.COGNITO_CLIENT_ID,
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      }
      
      await cognitoIdentityServiceProvider.adminInitiateAuth(adminInitiateAuthparams).promise().then(
        async (data) => {
          res.json({ data: data.AuthenticationResult });
        },
        (error) => {
          console.log('ERROR [adminInitiateAuth]:', JSON.stringify(error));
          res.status(400).json({ error: error.message });
        }
      )
    }
  }

  static async logout(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }

    var globalSignOutparams = {
      AccessToken: user.AccessToken /* required */
    };
    await cognitoIdentityServiceProvider.globalSignOut(globalSignOutparams).promise()
    .then(
      (data) => {
        res.json({ message: 'Your has been successfully logout!'});
      },
      (error) => {
        console.log('ERROR [globalSignOut]:', JSON.stringify(error));
        res.status(error.statusCode).json({ error: error.message });
      }
    )


  }

  static async signup(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}

    if (params.Email == undefined && params.Email == null) {
      return res.status(400).json({error: "Parameter [Email] are required & not blanks!" })
    }
  
    if (!isEmailFormat(params.Email)) {
      return res.status(400).json({error: `Invalid Email format '${params.Email}' ` })
    }
  
    if (params.Password == undefined && params.Password == null) {
      return res.status(400).json({error: "Parameter [Password] are required & not blanks!" })
    }

    let signUpParams:any
    signUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID, /* required */
      Username: params.Email, /* required */
      Password: params.Password, /* required */
      UserAttributes: [
        {
          Name: "email", /* required */
          Value: params.Email,
        }
      ]
    }
    let resp = await cognitoIdentityServiceProvider.signUp(signUpParams).promise()
    .then(
      (data) => {
        console.log("data",JSON.stringify(data))
        res.json({ message : "Signup Success" });
      },
      async (err) => {
        console.log("ERROR [signUp]:" ,JSON.stringify(err) )
        let UserStatus = null
          /* CHECK USER STATUS, ONLY RETURN WHEN STATUS 'UNCONFIRMED' */
          /* ----- BEGIN ADMIN GET USER ----- */
            let adminGetUserParams:any
            adminGetUserParams = {
              UserPoolId: process.env.COGNITO_USER_POOL_ID, /* required */
              Username: params.Email /* required */
            }

            await cognitoIdentityServiceProvider.adminGetUser(adminGetUserParams).promise()
            .then(
              (respAdminGetUser) => {
                console.log("respAdminGetUser",JSON.stringify(respAdminGetUser))
  
                if (respAdminGetUser.UserStatus == "UNCONFIRMED") {
                  UserStatus = "UNCONFIRMED"
                }
              },
              (errorAdminGetUser) => {
                console.log("ERROR [adminGetUser]:" ,JSON.stringify(errorAdminGetUser) )
              }
            )
          /* ----- END ADMIN GET USER   ----- */
        if (UserStatus != null) {
          res.status(400).json({ error: err.message, UserStatus: UserStatus })
        }else{
          res.status(400).json({ error: err.message})
        }
      }
    )
  }
  
  static async confirmSignup(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    if (params.Email == undefined && params.Email == null) {
      return res.status(400).json({status: false, error: "Parameter [Email] are required & not blanks!" })
    }
    if (params.ConfirmationCode == undefined && params.ConfirmationCode == null) {
      return res.status(400).json({status: false, error: "Parameter [ConfirmationCode] are required & not blanks!" })
    }
    
    let confirmSignUpParams:any
    confirmSignUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID, /* required */
      ConfirmationCode: params.ConfirmationCode, /* required */
      Username: params.Email, /* required */
      ForceAliasCreation: false,
    }

    let resp = await cognitoIdentityServiceProvider.confirmSignUp(confirmSignUpParams).promise()
    .then(
      (data) => {
        /* process the data */
        res.json({status: true, data: "Signup Confimation Success" })
      },
      (error) => {
        /* handle the error */
        console.log("ERROR [confirmSignUp]:" ,JSON.stringify(error) )
        res.status(error.statusCode).json({status: false, error: error.message})
      }
    );
  }

  static async forgotPassword(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}

    if(params.Email == undefined && params.Email == null) {
      return res.status(400).json({ status: false, error: 'Parameter [Email] is required and cannot be blank' });
    }
  
    let forgotPasswordParams:any
    forgotPasswordParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: params.Email,
    }
    let resp = await cognitoIdentityServiceProvider.forgotPassword(forgotPasswordParams).promise()
    .then(
      (data) => {
        res.json({ message: 'A confirmation code has been sent to your email. Use the code to reset your password.' })
      },
      (error) => {
        console.log("ERROR [resendConfirmationCode]:" ,JSON.stringify(error) )
        res.status(error.statusCode).json({error: error.message})
      }
    )
  
  }
  
  static async confirmForgotPassword(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    
    if(params.Email == undefined && params.Email == null) {
      return res.status(400).json({ status: false, error: 'Parameter [Email] is required and cannot be blank' });
    }
    if(params.ConfirmationCode == undefined && params.ConfirmationCode == null) {
      return res.status(400).json({ status: false, error: 'Parameter [ConfirmationCode] is required and cannot be blank' });
    }
    if(params.Password == undefined && params.Password == null) {
      return res.status(400).json({ status: false, error: 'Parameter [Password] is required and cannot be blank' });
    }
  
    let confirmForgotPasswordParams:any
    confirmForgotPasswordParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      ConfirmationCode: params.ConfirmationCode,
      Username: params.Email,
      Password: params.Password,
    }

    let resp = await cognitoIdentityServiceProvider.confirmForgotPassword(confirmForgotPasswordParams).promise()
    .then(
      (data) => {
        res.json({ message: 'Your password has been successfully reset!' });
      },
      (error) => {
        console.log('ERROR [confirmForgotPassword]:', JSON.stringify(error));
        res.status(error.statusCode).json({ error: error.message });
      }
    )
  }

  static async changePassword(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    
    let user:any
    user = await verifyOAuth2Bearer(req.headers.authorization);

    if(!user.status) {
      return res.status(400).json({error: user.error }, 401);
    }
    if(params.OldPassword == undefined && params.OldPassword == null) {
      return res.status(400).json({error: 'Parameter [OldPassword] is required and cannot be blank' });
    }
    if(params.NewPassword == undefined && params.NewPassword == null) {
      return res.status(400).json({error: 'Parameter [NewPassword] is required and cannot be blank' });
    }

    let resp = await cognitoIdentityServiceProvider.changePassword({
      AccessToken: user.AccessToken,
      PreviousPassword: params.OldPassword,
      ProposedPassword: params.NewPassword
    }).promise()
    .then(
      (data) => {
        res.json({ message: 'Your password has been successfully changed!' });
      },
      (error) => {
        console.log('ERROR [changePassword]:', JSON.stringify(error));
        res.status(error.statusCode).json({ error: error.message });
      }
    )
    
  }

  static async refressToken(req: any, res: any) {
    let params:any 
    params = {...res.locals.params}
    
    if(params.RefreshToken == undefined && params.RefreshToken == null) {
      return res.status(400).json({ status: false, error: 'Parameter [RefreshToken] is required and cannot be blank' });
    }
  
    let adminInitiateAuthParam:any
    adminInitiateAuthParam = {
      AuthFlow: 'REFRESH_TOKEN_AUTH', /* required */ // USER_SRP_AUTH | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH, /* required */
      ClientId: process.env.COGNITO_CLIENT_ID,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      AuthParameters: {
        REFRESH_TOKEN: params.RefreshToken,
      }
    }
    let resp = await cognitoIdentityServiceProvider.adminInitiateAuth(adminInitiateAuthParam).promise()
    .then(
      (data) => {
        return res.json({ data: data.AuthenticationResult });
      },
      (error) => {
        console.log('ERROR [adminInitiateAuth]:', JSON.stringify(error));
        return res.status(error.statusCode).json({error: error.message });
      }
    )
  }
}
