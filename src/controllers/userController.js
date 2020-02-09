import multer from "multer" ;
import {validationResult} from "express-validator/check"
import {app} from "./../config/common";
import {transErrors , transSuccess, transEmail} from "./../../lang/vi";
import fsExtra from "fs-extra";
import {user} from "./../services/index"

//Setup destination and name for file
let avatarStorage = multer.diskStorage({
  destination : (req , file , callback) => {
    callback(null , app.avatar_directory);
  },
  filename : (req ,file , callback) => {
    let match = app.avatar_type ;
    if(match.indexOf(file.mimetype) === -1){
      return callback(transErrors.avatar_type) 
    }
    let avatarName = `${Date.now()}-${file.originalname}`;
    callback(null, avatarName) ;
  }
})

//Config for file
let uploadUserAvatar = multer({
  storage : avatarStorage , 
  limits : {fileSize : app.avatar_limit_size}
}).single("avatar");

let updateAvatar = (req , res) => {
  uploadUserAvatar(req , res , async (error) => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.avatar_size)
      }
      return res.status(500).send(error);
    }
   try {
     console.log(req.file);
     let userUpdateItem = {
       avatar : req.file.filename ,
       updatedAt : Date.now() 
     }

     //update user avatar
     let updateUserAvatar = await user.updateUser(req.user._id , userUpdateItem);

     //remove old avatar 
     //await fsExtra.remove(`${app.avatar_directory}/${updateUserAvatar.avatar}` );

     let result = {
       message : transSuccess.avatar_updated , 
       imageSrc : `images/users/${req.file.filename}`
     }

     return res.status(200).send(result);
   } catch (error) {
     console.log(error);
     return res.status(500).send(error);
   }
  })
}

let updateInfo = async (req , res ) => {
  let errorArr = [] ; 
  let validationError = validationResult(req) ;
  if(!validationError.isEmpty()){
    let errors = Object.values(validationError.mapped());
    errors.forEach( item => {
      errorArr.push(item.msg);
    })
    return res.status(500).send(errorArr);
  }
  
  try {
    
    let userItem = req.body ;
    await user.updateUser(req.user._id, userItem) ;
    let result = {
      username : req.body.username ,
      message : transSuccess.userInfo_updated
    }
    return res.status(200).send(result) ; 
  } catch (error) {
    console.log(error) ;
    return res.status(500).send(error);
  }
}

let updatePassword =  async (req , res) => {
  try {
    let userItem = req.body ;
    await user.updatePassword(req.user._id , userItem) ;
    let result = {
      message : transSuccess.update_password
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error) ;
  }
}
module.exports = {
  updateAvatar : updateAvatar ,
  updateInfo : updateInfo , 
  updatePassword : updatePassword
}
