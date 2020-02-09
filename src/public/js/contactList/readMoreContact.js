function readMoreContact(){
  $(".link-read-more-contact").off("click").on("click" , function(){
    let skipNumber = $("#contacts").find(`li`).length;
    $(".link-read-more-contact").css("display" , "none") ; 
    $(".read-more-contact-loader").css("display" , "block");
    $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}` , function( users ){
      if(!users.length){
        alertify.notify("Không còn bạn bè để xem thêm" , "error" , 5);
        $(".link-read-more-contact").css("display" , "none") ; 
    $(".read-more-contact-loader").css("display" , "block");
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
                <div class="user-talk" data-uid="${user._id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user._id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
          `
        }else userInforHTML = `
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
                <div class="user-talk" data-uid="${user._id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user._id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
        `;
        $("#contacts").find("ul").append(userInforHTML);
        $(".link-read-more-contact").css("display" , "inline-block") ; 
       $(".read-more-contact-loader").css("display" , "none");
       removeContact();
       chatFromContactList();
      })
    })
  })
}


$(document).ready(function () {
  readMoreContact();
});