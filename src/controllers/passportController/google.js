import passport from "passport" ;
import passportGoogle from "passport-google-oauth";
import userModel from "./../../models/userModel" ;
import {transErrors , transSuccess} from "./../../../lang/vi";

let googleStrategy = passportGoogle.OAuth2Strategy ; 

let ggAppId = process.env.GG_APP_ID ;
let ggAppSecret = process.env.GG_APP_SECRET ; 
let ggCallbackURL = process.env.GG_CALLBACK_URL ;
let initGooglePassport = () => {
  passport.use( new googleStrategy({
    clientID : ggAppId , 
    clientSecret : ggAppSecret , 
    callbackURL : ggCallbackURL , 
    passReqToCallback : true 
  },async (req , accessToken , refreshToken ,profile , done) => {
    try {
      let user = await userModel.findUserByGoogleUid(profile.id) ;
      if(user){
        return done(null , user , req.flash("success" , transSuccess.login_success(user.username))) ;
      }

      console.log(profile) ; 
      let newUserItem = {
        username : profile.displayName , 
        gender : profile.gender , 
        local : {isActive : true }, 
        google : {
          uid : profile.id , 
          token : accessToken , 
          email : profile.emails[0].value 
        }
      }

      let newUser = await userModel.createNewUser(newUserItem);
      return done(null , newUser , req.flash("success" , transSuccess.login_success(newUser.username)));
    } catch (error) {
      console.log(error) ;
      return done(null,false , req.flash("errors" , transErrors.server_failed));
    }
  }))
  passport.serializeUser( (user , done) => {
    done(null , user._id) ; 
  })
  passport.deserializeUser( (id , done) => {
    userModel.findUserById(id)
    .then(user => done(null , user))
    .catch(error => done(error ,null)) ;
  })
}

module.exports = initGooglePassport;