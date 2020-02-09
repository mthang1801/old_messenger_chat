function readMoreRequestContactReceived(){
  $(".link-more-request-contact-received").on("click" , function(){
    let skipNumber = $("#request-contact-received").find(`li`).length; 
    $(".link-more-request-contact-received").css("display" , "none");
    $(".read-more-request-contact-received-loader").css("display" , "block")
    $.get(`/contact/read-more-request-contact-received?skipNumber=${skipNumber}` , function(users) {
      if(!users.length){
        alertify.notify("Không còn yêu cầu kết bạn" , "error" , 5);
        $(".link-more-request-contact-received").css("display" , "none");
        $(".read-more-request-contact-received-loader").css("display" , "block")
        return false ;
      }
      users.forEach( user => {
        let userInforHTML  ;
        if(user.avatar == "avatar-default.jpg"){
          userInforHTML = `
          <li class="_contactList" data-uid="${user._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="/images/users/default/${user.avatar}"  alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${user.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>${user.address ? user.address : ""}</span>
                </div>
                <div class="user-approve-request-contact-received" data-uid="${user._id}">
                    Chấp nhận
                </div>
                <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                    Xóa yêu cầu
                </div>
            </div>
          </li>
          `;
        } else {
          userInforHTML = `
          <li class="_contactList" data-uid="${user._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="/images/users/${user.avatar}"  alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${user.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>${user.address ? user.address : ""}</span>
                </div>
                <div class="user-approve-request-contact-received" data-uid="${user._id}">
                    Chấp nhận
                </div>
                <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                    Xóa yêu cầu
                </div>
            </div>
          </li>
          `;
        }
        $("#request-contact-received ul").append(userInforHTML);
        removeRequestContactReceived();
        approveRequestContactReceived();
      })
      $(".link-more-request-contact-received").css("display" , "inline-block");
      $(".read-more-request-contact-received-loader").css("display" , "none")
    })
  })
}



$(document).ready(function () {
  readMoreRequestContactReceived();
});
