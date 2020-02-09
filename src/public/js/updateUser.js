let userAvatar = null ; 
let userInfo = {} ;
let originAvatarSrc = null ; 
let originalUserInfo = {} ; 
let originalUserPassword = {} ; 
let userPassword = {} ; 

function callLogout(){
  Swal.fire({
    position: 'top-end',
    type: 'success',
    title: 'Tự động đăng xuất sau 3s',
    html : 'Time: <strong></strong>',
    showConfirmButton: false,
    timer: 3000 ,
    onBeforeOpen : () => {
      Swal.showLoading() ;
      timerInterval = setInterval( () => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
      } , 1000)
    },
    onClose : () => {
      clearInterval(timerInterval) ;
    }
  }).then(result => {
    $.get("/logout" , function(){
      location.reload();
    })
  });
}

function updateUserInfo(){
  $("#input-change-avatar").bind("change" , function(){
    let fileData = $(this).prop("files")[0] ; 
    let limit = 300000 ;
   
    let match = ["image/jpg" , "image/png" , "image/jpeg"];
    if($.inArray(fileData.type , match) === -1){
      alertify.notify("Kieu file khong hop le, chi chap nhan file co dang jpg , jpeg , png" ,"error" , 5) ;
      $(this).val(null) ; 
      return false ; 
    }
    if( fileData.size > limit ){
      alertify.notify("kich thuoc file qua lon" , "error" , 5);
      $(this).val(null) ; 
      return false ;
    }

    if( typeof (FileReader) != undefined  ){
      let filePreview = $("#image-edit-profile") ; 
      filePreview.empty() ; 
      let fileReader = new FileReader() ; 
      fileReader.onload = function(event){
        $("<img>" , {
          "src" : event.target.result , 
          "class" : "avatar img-circle", 
          "id" : "user-modal-avatar" ,
          "alt" : "avatar" 
        }).appendTo(filePreview);
      };
      fileReader.readAsDataURL(fileData);
      
      let formData = new FormData() ; 
      formData.append("avatar" ,fileData);
      userAvatar = formData ;
    }
    else{
      alertify.notify("Trinh duyet cua ban khong ho tro FileReader" , "error" , 5);
    }
  })

  $("#input-change-username").bind("change" , function(){
    let username = $(this).val();
    let regEx_username = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regEx_username.test(username)){
      alertify.notify("username có độ dài ít nhất 3 ký tự , dài nhất 20 ký tự và không được chứa ký tự đặc biệt" , "error" , 5);
      $(this).val(originalUserInfo.username);
      delete userInfo.username; 
      return false ;
    }

    userInfo.username =  username;
  })
  $("#input-change-gender-male").bind("click" , function(){
    let gender = $(this).val();
    if(gender !== "male"){
      alertify.notify("Bạn đã thay đổi giá trị của trường này , giờ tính sao ?" , "error" , 5);
      $(this).val(originalUserInfo.gender);
      delete userInfo.gender ; 
      return false ;
    }
    userInfo.gender = gender ;
  })
  $("#input-change-gender-female").bind("click" , function(){
    let gender = $(this).val();
    if(gender !== "female"){
      alertify.notify("Bạn đã thay đổi giá trị của trường này , giờ tính sao ?" , "error" , 5);
      $(this).val(originalUserInfo.gender);
      delete userInfo.gender ; 
      return false ;
    }
    userInfo.gender = gender ;
  })
  $("#input-change-address").bind("change" , function(){
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change" , function(){
    let phone = $(this).val();
    let regExp_phone = new RegExp(/^(0)[0-9]{9,10}$/);
    if(!regExp_phone.test(phone)){
      alertify.notify("Số điện thoại không hợp lệ" , "error" , 5);
      $(this).val(originalUserInfo.phone);
      delete userInfo.phone; 
      return false ;
    }
    userInfo.phone =  phone;
  });

  $("#input-change-currentPassword").bind("change" , function(){
    let currentPassword = $(this).val();
    let regExp_currentPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    if(!regExp_currentPassword.test(currentPassword)){
      alertify.notify("Mật khẩu không hợp lệ , phải có ít nhất 8 ký tự gồm in hoa , thường , số và ký tự đặc biệt" , "error" , 5);
      $(this).val(null);
      delete userPassword.currentPassword; 
      return false ;
    }
    userPassword.currentPassword = currentPassword;
  }) ; 
  $("#input-change-newPassword").bind("change" , function(){
    let newPassword = $(this).val();
    let regExp_newPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    if(!regExp_newPassword.test(newPassword)){
      alertify.notify("Mật khẩu không hợp lệ , phải có ít nhất 8 ký tự gồm in hoa , thường , số và ký tự đặc biệt" , "error" , 5);
      $(this).val(null);
      delete userPassword.newPassword; 
      return false ;
    }
    userPassword.newPassword = newPassword;
  }) ; 
  $("#input-change-confirmNewPassword").bind("change" , function(){
    let confirmNewPassword = $(this).val() ; 
    if( confirmNewPassword !== userPassword.newPassword || confirmNewPassword.length < 8 ){
      alertify.notify("Mật khẩu nhập lại không khớp với mật khẩu mới" , "error"  ,5);
      $(this).val(null);
      delete userPassword.confirmNewPassoword ;
      return false ;
    }
    userPassword.confirmNewPassoword = confirmNewPassword
  }) ; 


}

function callUpdateUserAvatar(){
  $.ajax({
    type: "put",
    url: "/user/update-avatar",
    data: userAvatar,
    contentType: false ,
    cache : false , 
    processData : false ,
    success: function (response) {

      $(".update-success").find("span").text(response.message);
      $(".update-success").css("display", "block");
      $("#navbar-avatar").attr("src" , response.imageSrc);
      $("#btn-reset-user").click();
      originAvatarSrc = response.imageSrc;
      $(".update-error").css("display" , "none");
      $("#btn-reset-user").click();
    },
    error : function(error) {
      $(".update-success").css("display", "none");
      $(".update-error").find("span").text(error.reponseText) ;
      $(".update-error").css("display" , "block");
      $("#btn-reset-user").click();
    }
  });
}


function callUpdateUserInfo(){
  $.ajax({
    type: "put",
    url: "/user/update-info",
    data: userInfo,
    success: function (response) {
      console.log(response);
      $("#update-success-message").text(response.message);
      $(".update-success").css("display", "block");
      $(".update-error").css("display" , "none");
      $("#user-avatar").text(response.username);
      originalUserInfo = Object.assign(originalUserInfo, userInfo) ;

      $("#btn-reset-user").click();
    },
    error : function(error){
      console.log(error);
      $("#update-error-message").text(error.responseText) ;
      $(".update-success").css("display", "none");
      $(".update-error").css("display" , "block");
     
      
      $("#btn-reset-user").click();
    }
  });
}

function updateUserPassword(){
  $.ajax({
    type: "put",
    url: "/user/update-password",
    data: userPassword ,
    success: function (response) {
      console.log(response);
      $(".alert-success-password").css("display" ,"block"); 
      $(".alert-error-password").css("display","none");
      $("#update-password-success-message").text(response.message);
      $("#btn-cancel-update-password").click();
      callLogout();
    },
    error : function(error){
      $(".alert-success-password").css("display" ,"none"); 
      $(".alert-error-password").css("display","block");
      $("#update-password-error-message").text(error.responseText);
      $("#btn-cancel-update-password").click();
    }
  });
}

//Ready function
$(document).ready(function(){
  
  updateUserInfo() ;
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originalUserInfo = {
    username :$("#input-change-username").val()  ,
    gender : ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val() ,
    address : $("#input-change-address").val() ,
    phone : $("#input-change-phone").val()
  }
  //console.log(originalUserInfo);
  //Solve user info 
  $("#btn-update-user").bind("click" , function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Cap nhat that bai, vui long dien thong tin vao cac truong" , "error" ,5);   
      $("#btn-reset-user").click();
    }
    if(userAvatar){
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)){
      callUpdateUserInfo();
    }
    
  })

  $("#btn-reset-user").bind("click" ,function(){
   $
    userAvatar = null  ;
    userInfo ={} ;
    $("#user-modal-avatar").attr("src" ,originAvatarSrc);
    $("#input-change-avatar").val(null);
    $("#input-change-username").val(originalUserInfo.username) ; 
    (originalUserInfo.gender == "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originalUserInfo.address) ;
    $("#input-change-phone").val(originalUserInfo.phone);

  })

  //Solve user password
  $("#btn-update-password").bind("click" , function(){
    
    if( !userPassword.newPassword || !userPassword.currentPassword || !userPassword.confirmNewPassoword){
      alertify.notify("Vui lòng nhập đầy đủ thông tin vào các trường dữ liệu" , "error" , 5) ;
      $("#btn-cancel-update-password").click();
      return false ;
    }
    Swal.fire({
      title: 'Bạn có chắc chắn muốn thay đổi',
      text: "Sẽ không thể hoàn tác lại!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#dff7675',
      confirmButtonText: 'Chấp nhận' ,
      cancelButtonText : 'Hủy bỏ',
    }).then((result) => {
      if(result.value){
        updateUserPassword();
      }
      return false  ;
    })
    
  })

  $("#btn-cancel-update-password").bind("click" , function(){
    userPassword ={};
    $("#input-change-currentPassword").val(null) ; 
    $("#input-change-newPassword").val(null) ; 
    $("#input-change-confirmNewPassword").val(null) ; 
  })
})