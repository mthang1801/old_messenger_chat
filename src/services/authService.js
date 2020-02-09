import userModel from "./../models/userModel";
import {transErrors, transSuccess ,transEmail, transValidation} from "./../../lang/vi";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import sendEmail from "./../config/mailer";
let saltRound = 10 ; 
let register = (email, gender , password , protocol , host) => {
  return new Promise( async (resolve , reject) => {
    let userByEmail = await userModel.findUserByEmail(email) ;
    if(userByEmail){
      if(userByEmail.deletedAt != null ){
        return reject(transErrors.account_removed);
      }
      if(!userByEmail.local.isActive){
        return reject(transErrors.account_not_active)
      }
        return reject(transErrors.account_in_use) 
    }
    
    let salt = bcrypt.genSaltSync(saltRound) ; 
    let userItem = {
      username : email.split("@")[0], 
      gender : gender , 
      local : {
        email : email , 
        password : bcrypt.hashSync(password , salt) ,
        verifyToken : uuidv4()
      } 
    };
    let user = await userModel.createNewUser(userItem) ; 
    //send Email
    let verifyLink = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    
    sendEmail(email,transEmail.subject , transEmail.templateActivated(verifyLink))
    .then(success => {
      return resolve(transSuccess.user_created(user.local.email));
    })
    .catch( async error => {
      await userModel.removeById(user._id) ;
      console.log(error)  ;
      reject(transErrors.send_failed);
    })
    
  })
}

let verifyAccount = (token) => {
  return new Promise( async (resolve , reject) => {
    let UserByToken = await userModel.findByToken(token) ; 
    if(!UserByToken){
      return reject(transErrors.token_undefined);
    }
    await userModel.verify(token) ;
    resolve(transSuccess.account_active);
  })
}

let forgetPassword = (email , protocol , host) => {
  return new Promise( async (resolve , reject ) => {
    let user = await userModel.findUserByEmail(email);
    if(!user){
      return reject(transErrors.account_not_exist) ; 
    }
    let verifyToken = uuidv4() ; 
    
    await userModel.updatePassword(email , verifyToken );
    let verifyLink = `${protocol}://${host}/forget/${verifyToken}`
    sendEmail(email, transEmail.forget_subject , transEmail.templateForgotPwd(verifyLink))
    .then( success => {
      return resolve(transSuccess.forgetPassword_success)
    })
    .catch( error => {
      return reject(error)
    })
  })
 
}

let verifyPassword = (token) => {
  return new Promise( async (resolve , reject ) => {
    let user = await userModel.findUserByPasswordToken(token) ; 
    if(!user){
      return reject(transErrors.token_undefined);
    }
  
    resolve(user);
  })
}


let changePassword = (dataPassword) => {
  return new Promise(async (resolve , reject) => {
    let user = await userModel.findUserByPasswordToken(dataPassword.currentPassword);
    if(!user){
      return reject(transErrors.token_undefined) ; 
    }
    let regExp_password = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    if(dataPassword.newPassword !== dataPassword.confirmPassword ){
      return reject(transValidation.password_confirm_incorrect);
    }
    
    if(!regExp_password.test(dataPassword.newPassword)){
      return reject(transValidation.password_incorrect);
    }
    let salt = bcrypt.genSaltSync(saltRound) ;
    await userModel.updateTokenPasswordToNewPassword(dataPassword.currentPassword , bcrypt.hashSync(dataPassword.newPassword , salt));
    return resolve(true);
    
  })
}

module.exports = {
  register : register ,
  verifyAccount : verifyAccount,
  forgetPassword : forgetPassword,
  verifyPassword : verifyPassword,
  changePassword : changePassword
}