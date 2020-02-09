import passport from "passport" ;
import passportFacebook from "passport-facebook" ; 
import userModel from "./../../models/userModel" ;
import {transErrors , transSuccess} from "./../../../lang/vi"

let facebookStrategy = passportFacebook.Strategy ; 

let fbAppId = process.env.FB_APP_ID ;
let fbAppSecret = process.env.FB_APP_SECRET ;
let fbCallbackURL = process.env.FB_CALLBACK_URL

let initPassportFacebook = () => {
  passport.use( new facebookStrategy({
    clientID : fbAppId,
    clientSecret : fbAppSecret , 
    callbackURL : fbCallbackURL ,
    passReqToCallback : true ,
    profileFields : ["email" , "gender" , "displayName"] 
  } , async (req, accessToken , refreshToken , profile , done) => {
    try {
      let user = await userModel.findUserByUid(profile.id) ; 
      if(user){
        return done (null , user , req.flash("succes" , transSuccess.login_success(user.username)));
      }

      //this case indicates that user does not exist
      console.log(profile) ;
      let newUserItem = {
        username : profile.displayName , 
        gender : profile.gender ,
        local : { isActive : true } ,
        facebook : {
          uid : profile.id,
          token : accessToken ,
          email : profile.emails[0].value
        },
        
      }

      let userNew = await userModel.createNewUser(newUserItem) ;
      return done(null ,  userNew , req.flash("success" , transSuccess.login_success(userNew.username)));

    } catch (error) {
      console.log(error) ; 
      return done(null , false , req.flash("errors" , transErrors.server_failed));
    }
  }))

  passport.serializeUser( (user,done) => {
    done(null , user._id)
  })

  passport.deserializeUser( (id , done ) => 
  userModel.findUserById(id)
  .then( user => done(null , user))
  .catch( err => done(err , null )) 
  )

}

module.exports = initPassportFacebook;
