function removeRequestContactWithMemberFromGroup(){
  $(".member-cancel-contact-sent").off("click").on("click" ,  function(){
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.ajax({
      type: "delete",
      url: "/contact/member-cancel-request-contact-sent",
      data: {targetId : targetId},
      success: function (data) {
        if(data.success){
           $(`div.groupPanel[data-uid=${targetId}]`).find(".approve-request-contact-sent").remove();
          $("div.members-list").find(`div.groupPanel[data-uid = ${targetId}]`).append(`
          <div class="member-request-contact-sent" data-uid="${targetId}" >
              <span>
                  Kết bạn
              </span>
          </div>`);
          $("div.members-list").find(`div.member-cancel-contact-sent[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).show();
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).css("display" , "none");
          decreaseNotificationContact("count-request-contact-sent"); // js/calculateNotifyContact.js
          decreaseNotification("noti_contact_counter", 1); //js.calculateNotification.js
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();
          socket.emit("remove-request-contact" , {contactId : targetId}) 
          addContactWithMemberFromGroup();
          approveRequestContactOfMemberFromGroup() ;
          chatFromGroup() ;
       
        }
      }
    });
  })
}

$(document).ready(function () {
  removeRequestContactWithMemberFromGroup();
});