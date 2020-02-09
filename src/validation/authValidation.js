import {check} from "express-validator/check";
import {transValidation} from "../../lang/vi";
let register = [
  check("email" , transValidation.email_incorrect).isEmail().trim() , 
  check("gender" , transValidation.gender_incorrect).isIn(["male" , "female"]) ,
  check("password" , transValidation.password_incorrect)
  .isLength({min: 8 , max:30})
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("password_confirmation" , transValidation.password_confirm_incorrect)
  .custom( (value, {req}) => {
    return value == req.body.password ;
  })
]

let forget = [
  check("email" , transValidation.email_incorrect).isEmail().trim() ,
  check("confirm-email" , transValidation.confirm_email_wrong)
  .custom( (value , {req} ) => {
    return value === req.body.email;
  })
]

let newPassword = [
  check("newPassword" , transValidation.password_incorrect)
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/) ,
  check("confirmPassword" , transValidation.password_confirm_incorrect)
  .custom( (value , {req}) => {
    return value === req.body.newPassword
  })
]
module.exports = {
  register : register,
  forget: forget ,
  newPassword : newPassword
}