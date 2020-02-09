function removeNotificationHasRead(){
  $("#remove-notification-read").on("click" , function(){
    
    $.ajax({
      type: "delete",
      url: `/notification/remove-notification-read`,
      success: function (response) {
        if(response.success){
          $("div.noti_content").find("div").each( function(index , value){
            $(this).not(".notification-request-contact-unread").remove();
          })
        }
      }
    });
  })
}

$(document).ready(function () {
  removeNotificationHasRead();
});