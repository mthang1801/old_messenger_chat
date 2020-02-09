import passport from "passport" ;
import passportLocal from "passport-local" ;
import userModel from "./../../models/userModel";
import chatGroupModel from "./../../models/chatGroupModel";
import {transErrors , transSuccess} from "./../../../lang/vi";
import _ from "lodash";
let passportStrategy = passportLocal.Strategy ; 

let initPassportLocal = () =>{
  passport.use(new passportStrategy({
    usernameField : "email",
    passwordField : "password" ,
    passReqToCallback : true 
  },async (req , email , password , done) => {
    try {
      let user = await userModel.findUserByEmail(email) ; 
      if(!user)
        return done(null , null , req.flash("errors" , transErrors.user_not_exist)) ;
      if(!user.local.isActive)
        return done(null , null , req.flash("errors" , transErrors.account_not_active)) ;
      let checkPassword = user.comparePassword(password) ;
      if(!checkPassword)
        return done( null , null , req.flash("errors" , transErrors.password_failed)) ;
      return done (null , user , req.flash("success" , transSuccess.login_success(user.username))) ;
    } catch (error) {
      return done(null , null , req.flash("errors" , transErrors.server_failed));
    }
  }))

  passport.serializeUser( (user , done ) => {
    done(null , user._id) ;
  })

  passport.deserializeUser( async (id, done) => {
    try {
      let user = await userModel.findUserById(id); 
      user = user.toObject() ; 
      let chatGroups = await  chatGroupModel.findGroupChatByUserId(id);
      user.chatGroups = chatGroups ; 
      let adminGroup = await chatGroupModel.findGroupAndCheckAdmin(id) ;
      let adminIdArray = adminGroup.map( group => {
        return group._id.toString();
      })
      user.adminGroup = adminIdArray;
      let hostGroup = await chatGroupModel.findGroupAndCheckHostGroup(id);
      let hostIdArray = hostGroup.map( group => {
        return group._id.toString() ;
      })
      user.hostGroup = hostIdArray;
      return done(null , user) ;
    } catch (error) {
      return done(error , null )
    }
  })
}

module.exports = initPassportLocal;