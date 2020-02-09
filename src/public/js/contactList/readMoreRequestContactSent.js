function readMoreRequestContactSent(){
  $(".link-more-request-contact-sent").off("click").on("click" , function(){
    let skipNumber = $("#request-contact-sent").find("li").length; 

    $(".link-more-request-contact-sent").css("display" , "none");
    $(".read-more-request-contact-sent-loader").css("display" , "block")
    $.get(`/contact/read-more-request-contact-sent?skipNumber=${skipNumber}`, function(users){
      if(!users.length){
        alertify.notify("Không còn người dùng chờ xác nhận để xem" , "error" , 5);
        $(".link-more-request-contact-sent").css("display" , "none");
       $(".read-more-request-contact-sent-loader").css("display" , "block")
        return false ; 
      }
      users.forEach( user => {
        let userInforHTML ;
        if(user.avatar == "avatar-default.jpg"){
          userInforHTML = `
          <li class="_contactList" data-uid="${user._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/default/${user.avatar}" alt="">
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
                <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${user._id}">
                    Hủy yêu cầu
                </div>
            </div>
         </li>
          `;
        }else {userInforHTML = `
        <li class="_contactList" data-uid="${user._id}">
          <div class="contactPanel">
              <div class="user-avatar">
                  <img src="images/users/${user.avatar}" alt="">
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
              <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${user._id}">
                  Hủy yêu cầu
              </div>
          </div>
       </li>
        `;
      }
      $("#request-contact-sent ul").append(userInforHTML)
      removeRequestContact();
      })
      $(".link-more-request-contact-sent").css("display" , "inline-block");
      $(".read-more-request-contact-sent-loader").css("display" , "none");
    })
  })
}

$(document).ready(function () {
  readMoreRequestContactSent();
});