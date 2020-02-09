

function markNotificationAsRead(targetUsers){
  $.ajax({
    type: "put",
    url: "/notification/mark-notification-as-read",
    data: {targetUsers : targetUsers},
    success: function (response) {
      if(response.success){
        targetUsers.forEach( contactId => {
          $(".noti_content").find(`div[data-uid = ${contactId}]`).removeClass("notification-request-contact-unread");
          $(".list-notifications").find(`li div[data-uid = ${contactId}]`).removeClass("notification-request-contact-unread");
        })
      }
    }
  });
}


$(document).ready(function () {
  $("#popup-mark-all-notification-as-read").on("click" , function(){
    let targetUsers = [] ; 
    $("div.noti_content").find("div").each( function(index , value ){
      targetUsers.push($(this).data("uid"));
    })
    markNotificationAsRead(targetUsers);
   })

   $(".modal-mark-notification-as-read").on("click" , function(){
     let tartgetUsers = [] ; 
     $(".list-notifications").find("div").each( function(index, value){
       tartgetUsers.push($(this).data("uid"));
     })
     
     markNotificationAsRead(tartgetUsers);
   })

 
});