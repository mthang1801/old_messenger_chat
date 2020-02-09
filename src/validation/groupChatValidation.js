import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi"
let groupChatValidation = [
  check("groupName" , transValidation.group_name)
  .isLength({min: 3})
  .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("members" , transValidation.group_members)
  .custom( value => {
    if(!Array.isArray(value)){
      return false  ;
    }
    if(value.length < 2){
      return false ;
    }
    return true ;
  })
]

module.exports = {
  groupChatValidation : groupChatValidation
}