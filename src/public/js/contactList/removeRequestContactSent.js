

function removeRequestContact(){
  $(".user-remove-request-contact-sent").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    
    $.ajax({
      type: "delete",
      url: "/contact/delete-request-contact",
      data: {uid : targetId},
      success: function (response) {
        $("div.members-list").find(`div.member-cancel-contact-sent[data-uid = ${targetId}]`).remove();
        $(`div.groupPanel[data-uid = ${targetId}]`).find(".btn-box").append(`
        <div class="member-request-contact-sent" data-uid="${targetId}" >
            <span>
                Kết bạn
            </span>
        </div>`);
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).show();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display" , "none");
        
        $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();
        decreaseNotificationContact("count-request-contact-sent");
        decreaseNotification("noti_contact_counter" , 1);
        
        socket.emit("remove-request-contact" , {contactId : targetId});
        addContactWithMemberFromGroup();
      }
    });
  })
}

socket.on("response-remove-request-contact" , (user) =>{
  $("div.members-list").find(`div.approve-request-contact-sent[data-uid = ${user.id}]`).remove();
  $(`div.groupPanel[data-uid = ${user.id}]`).find(".btn-box").append(`
  <div class="member-request-contact-sent" data-uid="${user.id}" >
      <span>
          Kết bạn
      </span>
  </div>`);
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
  decreaseNotificationContact("count-request-contact-received");
  decreaseNotification("noti_contact_counter" , 1);
  decreaseNotification("noti_counter" , 1);
  approveRequestContactOfMemberFromGroup();
  addContactWithMemberFromGroup();
})

$(document).ready(function () {
  removeRequestContact();
});