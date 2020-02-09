
function readStatus(){
  $(".notification-request-contact-unread").off("click").on("click" , function(){
    
    let targetId = $(this).data("uid");
    let notifUID = $(this).data("notif-uid");
    $.ajax({
      type: "put",
      url: "/notification/read-status",
      data: {uid : targetId , notifUID : notifUID},
      success: function (data) {
        console.log(data);
        if(data.success){
          approveRequestContactReceived();
          removeRequestContactReceived();  
          
          if($(`div.notification-request-contact-unread[data-notif-uid = ${notifUID}]`).hasClass("add-contact")){
            let user = data.user ;
          if(user != null){
            
            $(`div.notification-request-contact-unread[data-notif-uid = ${notifUID}]`).removeClass("notification-request-contact-unread");
            $("#notificationModal").modal("hide");
            $("#contactsModal").modal("show");
            //$("#show-modal-contacts").click();
            // /$("#link-request-contact-received").parents('li').addClass("active");
            
            // $("#link-contacts").parents('li').removeClass("active") ;
            // $("#link-request-contact-sent").parents('li').removeClass("active") ;
            // $("#link-find-user").parents('li').removeClass("active") ;
            $("#contact-manager").find("li").removeClass("active");
            $("#find-user").removeClass("active");
           
            $("#link-request-contact-received").click();
            // $("#find-user").tab("hide");
            // $("#contacts").tab("hide");
            // $("#request-contact-sent").tab("hide");
            // $("#request-contact-received").tab("show");

            $("#request-contact-received").find("li").each( function(index , value) {
            if( $(this).data("uid") == user._id ){
              $("#request-contact-received").find(`li:eq(${index})`).remove();
            }
          })
          $.get(`/contact/check-existed-contact?targetId=${targetId}` ,  function(data ){
            if(data.success){
            let  userInforHTML = `
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
                                      <div class="user-approve-request-contact-received" data-uid="${user._id}">
                                          Chấp nhận
                                      </div>
                                      <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                                          Xóa yêu cầu
                                      </div>
                                  </div>
                                </li>
                                `;
          
            $("#request-contact-received ul").prepend(userInforHTML);
            approveRequestContactReceived();
            removeRequestContactReceived();
            addContactWithMemberFromGroup();
            }
          })
          
        
          } 
        }else {
          $(`div.notification-request-contact-unread[data-uid = ${targetId}]`).removeClass("notification-request-contact-unread");
        }
      }
      }
    });
  })
}

$(document).ready(function () {
  
  $("#link-request-contact-received").parents('li').removeClass("active");
  $("#find-user").addClass("in active");
  $("#link-find-user").parents('li').addClass("active") ;
  $("#request-contact-received").removeClass("in active");
  readStatus();
});