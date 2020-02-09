/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
function showRegisterForm() {
    $('.loginBox , .forgetBox').fadeOut('fast', function() {
      $('.registerBox').fadeIn('fast');
      $('.login-footer').fadeOut('fast', function() {
        $('.register-footer ,.forget-footer').fadeIn('fast');
      });
      $('.modal-title').html('Đăng ký tài khoản');
    });
    $('.error').removeClass('alert alert-danger').html('');
  
  }
  
function showLoginForm() {
  $('#loginModal .registerBox , .forgetBox').fadeOut('fast', function() {
    $('.loginBox').fadeIn('fast');
    $('.register-footer').fadeOut('fast', function() {
      $('.login-footer , .forget-footer').fadeIn('fast');
    });

    $('.modal-title').html('Đăng nhập');
  });
  
}

function showForgetForm(){
  $('#loginMadal , .registerBox , .loginBox').fadeOut('fast' , function(){
    $('.forgetBox').fadeIn('fast') ; 
    $('.login-footer , .register-footer').fadeIn('fast' , function(){
      $('.forget-footer').fadeOut('fast')  
    });

    $('.modal-title').html('Quên mật khẩu');
  });
  $('.error').removeClass('alert alert-danger').html('');
}

function showUpdateForm(){
  $('#loginMadal , .registerBox , .loginBox , .forgetBox').fadeOut('fast' , function(){
    $('.updateBox').fadeIn('fast') ;
    $('.login-footer , .register-footer , .forget-footer').fadeOut() ;
    $('.modal-title').html('Cập nhật mật khẩu');
  })
  $('.error').removeClass('alert alert-danger').html('');
}
function openLoginModal() {
  setTimeout(function() {
    showLoginForm();
    $('#loginModal').modal('show');
  }, 230);
}

function openRegisterModal() {
  setTimeout(function() {
    showRegisterForm();
    $('#loginModal').modal('show');
  }, 230);
}

function openForgetForm(){
  setTimeout(function(){
    showForgetForm();
    $('#loginModal').modal('show');
  },230);
}

function openForgetForm(){
  setTimeout(function(){
    showUpdateForm();
    $('#loginModal').modal('show');
  },230);
}