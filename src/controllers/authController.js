import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";
import {transErrors , transSuccess } from "./../../lang/vi";
import { user } from ".";

let getLoginRegister = (req , res) => {
  res.render("auth/master" , {
    errors : req.flash("errors"),
    success : req.flash("success")
  });
}

let postRegister = async (req , res ) => {
  let errorArray = []; 
  let successArray = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationResult(req).mapped());
    errors.forEach( item => {
      errorArray.push(item.msg); 
    })
    req.flash("errors" , errorArray) ;
    return res.redirect("/login-register") ;
  }
  
  try {
    let createUserSuccess = await auth.register(req.body.email , req.body.gender , 
      req.body.password , req.protocol , req.get("host")) ;
      successArray.push(createUserSuccess);
      req.flash("success" , successArray) ;
      return res.redirect("/login-register");
  } catch (error) {
    errorArray.push(error); 
    req.flash("errors" , errorArray) ;
    return res.redirect("/login-register") ;
  } 
}

let verifyAccount = async (req , res) => {
  let successArr = [] ; 
  let errorArr = [] ; 

  try {
    let verifySuccess = await auth.verifyAccount(req.params.token) ; 
    successArr.push(verifySuccess) ;
    req.flash("success" , successArr);
    return res.redirect("/login-register");  
  } catch (error) {
    errorArr.push(error); 
    req.flash("errors" , errorArr) ;
    return res.redirect("/login-register") ;
  }
}

let LogoutAccount = (req , res ) => {
  req.logout() ; 
  req.flash("success" , transSuccess.logout_success) ;
  return res.redirect("/login-register");
}

let checkLoggedIn = (req ,res ,next) => {
  if(!req.isAuthenticated()){
    return res.redirect("/login-register"); 
  }
  next() ;
}

let checkLoggedOut = (req , res,  next) => {
  if(req.isAuthenticated()){
    return res.redirect("/");
  }
  next() ;
}


let postForgetPassword = async (req , res) => {
  console.log(req.body);
  let errorArr = [] ; 
  let successArr = [] ;
  let validationErrors = validationResult(req) ; 
  if(!validationErrors.isEmpty()){
    let errors = Object.values( validationErrors.mapped()) ;
    errors.forEach( item => {
      errorArr.push(item.msg);
    })
    req.flash("errors" , errorArr);
    return res.redirect("/login-register") ;
  }
  try {
    let activePasswordSuccess = await auth.forgetPassword(req.body.email ,req.protocol , req.get("host")) ;
    console.log(activePasswordSuccess);
    successArr.push(activePasswordSuccess) ; 
    req.flash("success" , successArr) ; 
    return res.redirect("/login-register");
  } catch (error) {
    console.log(error); 
    errorArr.push(error); 
    req.flash("errors" , errorArr) ;
    return res.redirect("/login-register") ;
  }
}

let verifyPassword = async (req , res) => {
  try {
    let data = await auth.verifyPassword(req.params.token);
   
   return res.render("update/update_password" , {data: data});
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
}


let getPassword = async (req , res)=> {
  
  // let errorArr = [] ; 
  // let validationErrors = validationResult(req) ; 
  // if(!validationErrors.isEmpty()){
  //   let errors = Object.values( validationErrors.mapped()) ;
  //   errors.forEach( item => {
  //     errorArr.push(item.msg);
  //   })
  //   return res.status(500).send(errorArr);
  // }
  try {
    let password = req.body ; 
    console.log(req.currentPassword);
    console.log(password);
    let updatePasswordSuccess = await auth.changePassword(password);
    let result = {
      message : transSuccess.update_password
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

module.exports = {
  getLoginRegister : getLoginRegister ,
  postRegister : postRegister,
  verifyAccount : verifyAccount,
  LogoutAccount : LogoutAccount,
  checkLoggedIn : checkLoggedIn, 
  checkLoggedOut : checkLoggedOut ,
  postForgetPassword : postForgetPassword,
  verifyPassword : verifyPassword,
  getPassword : getPassword
}