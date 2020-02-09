import {check} from "express-validator/check" ; 
import { transValidation, transSuccess } from "../../lang/vi";

let updateUserInfo = [
  check("username" , transValidation.update_username)
  .optional()
  .isLength({min : 3 , max : 20}),
  check("gender" ,  transValidation.update_gender)
  .optional()
  .isIn(["male" , "female"]),
  check("phone" , transValidation.update_phone)
  .optional()
  .matches(/^(0)[0-9]{9,10}$/)
]

let userContact = [
  check("keyword" , transValidation.user_name)
  .isLength({min : 1 , max :20}) 
  .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
]

module.exports = {
  updateUserInfo : updateUserInfo ,
  userContact : userContact
}