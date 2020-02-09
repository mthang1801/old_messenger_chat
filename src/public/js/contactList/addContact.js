
function addContact(){
  $(".user-add-new-contact").bind("click" , function(){

    let targetId = $(this).data("uid");

   
    $.post("/contact/add-new-contact" , {uid : targetId} , function(result){
      console.log(result);
      if(result.success){
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display" , "inline-block");
        let userInforHTML = $("#find-user").find(`li[data-uid = ${targetId}]`).get(0).outerHTML;
        $("div.members-list").find(`div.member-request-contact-sent[data-uid = ${targetId}]`).remove();
        $(`div.groupPanel[data-uid = ${targetId}]`).find(".btn-box").append(`
        <div class="member-cancel-contact-sent" data-uid="${targetId}">
          <span>
             Hủy kết bạn
          </span>
        </div>`);
        $("#request-contact-sent").find("ul").prepend(userInforHTML);
       
        increaseNotificationContact("count-request-contact-sent");
        increaseNotification("noti_contact_counter" , 1);
        removeRequestContact();
        let dataToEmit = {
          contactId : targetId ,
          notificationId : result.newNotification._id
        }
        socket.emit("add-new-contact" , dataToEmit );
      }
    })
  })
}
$(document).ready(function () {
  

socket.on("response-add-new-contact" , (user) => {
  console.log(user);
  alertify.notify(`<strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!` , "custom" , 7);
  let notify ;
  if(user.avatar == "avatar-default.jpg"){
    notify = ` 
            <div class="notification-request-contact-unread add-contact" data-notif-uid="${user.notificationId}" data-uid="${user.id}">
            <img class="avatar-small" src="images/users/default/${user.avatar}" alt=""> 
            <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </div>` ;
  }else notify = ` 
          <div class="notification-request-contact-unread add-contact" data-notif-uid="${user.notificationId}" data-uid="${user.id}">
          <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
          <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
          </div>` ;
  
  $("#find-user").find(`li[data-uid = ${user.id}]`).remove();
  $(".noti_content").prepend(notify);
  $(".list-notifications").prepend(`<li>${notify}</li>`);
  $(`div.groupPanel[data-uid = ${user.id}] `).find(`div.member-request-contact-sent[data-uid = ${user.id}]`).remove();
  $(`div.groupPanel[data-uid = ${user.id}] `).find(".btn-box").append(`
   <div class="approve-request-contact-sent" data-uid="${user.id}">
    <span>
      Xác nhận
    </span>
  </div>`);
  increaseNotificationContact("count-request-contact-received");
  increaseNotification("noti_contact_counter" , 1);
  increaseNotification("noti_counter" , 1);
  let userInforHTML ; 
  if (user.avatar == "avatar-default.jpg"){
    userInforHTML = `
                      <li class="_contactList" data-uid="${user.id}">
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
                                <span>${user.address}</span>
                            </div>
                            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>
                      `;
  }else userInforHTML = `
                      <li class="_contactList" data-uid="${user.id}">
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
                                <span>${user.address}</span>
                            </div>
                            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>
                      `;
  $("#request-contact-received ul").prepend(userInforHTML);
  removeRequestContactReceived();
  approveRequestContactReceived();
  approveRequestContactOfMemberFromGroup();
  readStatus();
})

});