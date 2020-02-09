export const transValidation = {
  email_incorrect : "Địa chỉ email không hợp lệ" ,
  confirm_email_wrong : `email nhập lại không đúng`,
  password_incorrect : "Mật khẩu không hợp lệ , mật khẩu phải có ít nhất 8 ký tự gồm chữ thường , chữ hoa và ký tự đặc biệt" ,
  gender_incorrect : "Vui lòng không chỉnh sửa trường dữ liệu này" ,
  password_confirm_incorrect : "Mật khẩu nhập lại không khớp",
  update_username : "username có độ dài ít nhất 3 ký tự , dài nhất 20 ký tự và không được chứa ký tự đặc biệt" ,
  update_gender : "Vui lòng không thay đổi trường dữ liệu này" ,
  update_phone : "Số điện thoại không hợp lệ",
  user_name : "Tên người dùng gồm chữ cái và số , không chứa ký tự đặc biệt",
  group_name :  "Tên nhóm không hợp lệ , tên nhóm cần ít nhất 3 ký tự không bao gồm ký tự đặc biệt",
  group_members : "Số thành viên trong nhóm ít nhất là 3"
}

export const transErrors = {
  account_removed : `Tai khoan da bi xoa khoi he thong`,
  account_not_active : `Tai khoan chua duoc kich hoat, vui long dang nhap vao email de kich hoat tai khoan`,
  account_in_use : `Tai khoan da duoc su dung`,
  account_not_exist : `Tài khoản không tồn tại`,
  token_undefined : `Token không tồn tại`,
  user_not_exist : `Nguoi dung khong ton tai`,
  password_failed : `Mật khẩu không đúng`,
  server_failed : `Loi tu he thong, vui long thu lai`,
  avatar_type : ` file can phai co dang jpg , jpeg , png `,
  avatar_size : `Kich thuoc file qua lon, vui long chon file khac`,
  image_type : ` file can phai co dang jpg , jpeg , png `,
  image_size : `Kích thước file quá lớn`,
  attachment_not_type : `Tệp đính kèm không không hợp lệ` ,
  attachment_override_limit_size : `Tệp đính kèm có kích thước quá lớn`
}

export const transSuccess = {
  user_created : username => `Tài khoản <strong>${username}</strong> đã được tạo thành công , vui lòng kích hoạt tài khoản để đăng nhập`,
  account_active : `Tài khoản của bạn đã được kích hoạt thành công, bạn có thể đăng nhập vào ứng dụng`,
  login_success : (username) => `Đăng nhập thành công, chào mừng <strong>${username}</strong> đã đến với My Messenger Chat`,
  logout_success : `Đăng xuất thành công`,
  avatar_updated : "Cập nhật ảnh đại diện thành công"   , 
  userInfo_updated : "Cập nhật thông tin cá nhân thành công",
  update_password : `Cập nhật mật khẩu thành công`,
  forgetPassword_success : `Vui lòng kiểm tra email để kích hoạt mật khẩu mới`
}

export const transEmail = {
  subject : "My Messenger Chat: Xác nhận kích hoạt tài khoản thành công" ,
  templateActivated : (linkVerify) => 
     `
    <h2>Bạn đã đăng ký tài khoản trên My Messenger Chat thành công, còn 1 bước nữa để có thể đăng nhập</h2>
    <h3>Vui lòng click vào liên kết bên dưới để  xác nhận kích hoạt tài khoản</h3>
    <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>
    <h4>Trân trọng.</h4>
  `
  ,
  send_failed : 'Có lỗi xảy ra trong quá trình gửi email, vui lòng thử lại hoặc liện hệ với bộ phận hỗ trợ',
  forget_subject : "My messenger Chat: Xác nhận kích hoạt lại mật khẩu" , 
  templateForgotPwd : (linkVerify) => `
    <h2>Có vẻ như bạn đã quên mật khẩu và đã kích hoạt xác nhận lại mật khẩu từ My Messenger Chat<h2>
    <h3>Vui lòng bấm vào đường link bên dưới để  kích hoạt lại mật khẩu</h3>
    <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>
    <h4>Trân trọng.</h4>
  `
}

