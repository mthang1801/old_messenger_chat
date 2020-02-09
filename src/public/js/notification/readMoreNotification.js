function readMoreNotification(){
  $(".link-read-more-notification").on("click" , function(){
    let skipNumber = $("ul.list-notifications").find("li").length ; 
    $(".link-read-more-notification").css("display" , "none");
    $(".read-more-notif-loader").css("display" , "block");
   
    setTimeout( () => {$.get(`/contact/read-more-notification?skipNumber=${skipNumber}` , function(notifications){
      if(!notifications.length){
        alertify.notify("Không còn thông báo nào để xem" , "error" , 5) ;
        $(".link-read-more-notification").css("display" , "none");
         $(".read-more-notif-loader").css("display" , "block");
        return false ; 
      }
      
      notifications.forEach( function(notification){
        $(".list-notifications").append(`<li>${notification}</li>`);
      })
      $(".link-read-more-notification").css("display" , "inline-block");
       $(".read-more-notif-loader").css("display" , "none");
       readStatus();
    })} , 200)
  })
}

$(document).ready(function () {
  readMoreNotification();
});