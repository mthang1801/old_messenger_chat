let Password = {} ; 

$(document).ready(function () {
  initialLoading();
 
  
  
  $("#btn-update-newpassword").on("click" , function(){
    callUpdateNewPassword() ;
  })
  $("#btn-cancel-update-newpassword").on("click" , function(){
    Password = {} ; 
    $("#input-change-newPassword").val(null);
    $("#input-change-confirmNewPassword").val(null);
  })
});

function initialLoading(){
  $("#btn-updatePassword").click();
  $("#input-change-newPassword").on("change" , function(){
    Password.newPassword = $(this).val();
  })
  $("#input-change-confirmNewPassword").bind("change" , function(){
    Password.confirmPassword = $(this).val();
  })
  Password.currentPassword = $("#hidden-password").text();

}
function callUpdateNewPassword(){
  $.ajax({
    url : "/forget/get-password" , 
    type : "put" ,
    data : Password , 
    success : function(response){
    $("#update-new-password-success-message").text(response.message);
    $(".update-new-password-success").css("display" , "block");
    $(".update-new-password-error").css("display" , "none");
    $("#btn-cancel-update-newpassword").click();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Cập nhật lại tài khoản',
      showConfirmButton: false,
      timer: 3000
    }).then( result => {
      location.replace("http://localhost:3000/login-register");
    })
    
    },
    error : function(error) {
      $("#update-new-password-error-message").text(error.responseText);
      $(".update-new-password-success").css("display" , "none");
    $(".update-new-password-error").css("display" , "block");
    $("#btn-cancel-update-newpassword").click();

    let timerInterval
    Swal.fire({
      timer: 3000,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong')
            .textContent = Swal.getTimerLeft()
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      location.reload();
    });
    }
  })
}