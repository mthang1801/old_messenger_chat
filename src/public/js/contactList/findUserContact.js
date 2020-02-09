$(document).ready(function () {
  $("#input-find-users-contact").bind("keypress" , findUsersContact);
  $("#btn-find-users-contact").bind("click" , findUsersContact) ;
});

function findUsersContact(element){
  if(element.which == 13 || element.type == "click"){
    let keyword = $("#input-find-users-contact").val();
    let keyword_regExp = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!keyword_regExp.test(keyword)){
      alertify.notify("Lỗi tìm kiếm , từ khóa tìm kiếm gồm chữ cái và số, không có ký tự đặc biệt" , "error" , 5);
      $("#input-find-users-contact").val("");
      return false ;
    }
    if(!keyword.length){
      alertify.notify("Vui lòng nhập từ khóa tìm kiếm" , "error" ,5 );
      $("#input-find-users-contact").val("");
      return false ;
    }

    $.get(`/contact/find-user-contact/${keyword}` , function(result) {
      if(result){
        $("#find-user ul").html(result);
        addContact();
        removeRequestContact();
      }
    })
  }
}

