import userModel from "./../models/userModel";
import bcrypt from "bcrypt";
import { transErrors } from "../../lang/vi";


let saltRounds = 10 ; 
/**
 * 
 * @param {id} :  id User
 * @param {item} :  avatar ,  updatedAt
 */
let updateUser = (id , updateData ) => {
  return userModel.updateUserAvatar(id,updateData);
}

let updatePassword = (id , updateData) => {
  return new Promise( async (resolve , reject )=> {
    let user = await userModel.findUserById(id); 
    if(!user){
      return reject(transErrors.account_not_exist);
    }

    let checkPassword = await user.comparePassword(updateData.currentPassword);
    if(!checkPassword){
      return reject(transErrors.password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds) ;
    await userModel.updateUserPassword(id , bcrypt.hashSync(updateData.newPassword , salt));
    resolve(true);
  })
}
module.exports = {
  updateUser : updateUser,
  updatePassword : updatePassword
}