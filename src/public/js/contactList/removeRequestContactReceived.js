
function removeRequestContactReceived(){
  $(".user-remove-request-contact-received").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
  
   
    $.ajax({
      type: "delete",
      url: "/contact/remove-request-contact-received",
      data: {uid : targetId},
      success: function (response) {
       if(response.success){
        $("div.members-list").find(`div.approve-request-contact-sent[data-uid = ${targetId}]`).remove();
        $(`div.groupPanel[data-uid = ${targetId}]`).find(".btn-box").append(`
        <div class="member-request-contact-sent" data-uid="${targetId}" >
            <span>
                Kết bạn
            </span>
        </div>`);
        $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();
        decreaseNotificationContact("count-request-contact-received");
        decreaseNotification("noti_contact_counter" , 1);
        socket.emit("remove-request-contact-received" , {contactId : targetId});
        addContactWithMemberFromGroup();
       }
      }
    });
  })
}

socket.on("response-remove-request-contact-received" , (user) =>{
 
  $("div.members-list").find(`div.member-cancel-contact-sent[data-uid = ${user.id}]`).remove();
  $(`div.groupPanel[data-uid = ${user.id}]`).find(".btn-box").append(`
  <div class="member-request-contact-sent" data-uid="${user.id}" >
      <span>
          Kết bạn
      </span>
  </div>`);
  $("#find-user").find(`li[data-uid= ${user.id}] .user-remove-request-contact-sent`).hide() ;
  $("#find-user").find(`li[data-uid= ${user.id}] .user-add-new-contact`).css("display" , "inline-block");
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();
  decreaseNotificationContact("count-request-contact-sent"); 
  decreaseNotification("noti_contact_counter" , 1);
  addContactWithMemberFromGroup();
})


$(document).ready(function () {
  removeRequestContactReceived();
});