
function readMoreAllConversation() {
  $("#link-read-more-all-chat").off("click").on("click" , function(){
    let skipGroup = $("#all-chat").find("li.group-chat").length;
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length ;

    $("#read-more-all-chat").hide() ;
    $(".all-chat-loading").css("display" , " block");
    $.get(`/message/read-more-all-conversations?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}` , data => {
      if(data.allChatLeftSide.trim() == ""){
        alertify.notify("Danh sách liên lạc đã hết" , "error" , 5) ; 
        $("#read-more-all-chat").hide() ;
        $(".all-chat-loading").css("display" , " block");
        return false ; 
      }
      $(".emojionearea").remove();
      //step01 : handle leftSide 
      $("#all-chat").find("ul.people").append(data.allChatLeftSide) ;
      //resize scroll
      $(".left").getNiceScroll().resize();
      nineScrollLeft();

      //step02 : handle rightSide 
      $("#screen-chat").append(data.allChatRightSide) ; 
      
      zoomImageModal();
      changeScreenChat();
      gridPhotos(5);
      convertToImage();
      //step03 : handle Image Modal
      $("body").append(data.allChatImage) ; 
      //step04 : handle Attachment Modal
      $("body").append(data.allChatAttachment);
      //step05: appen groupchat Modal
      $("body").append(data.groupChatAvatarModal);
      socket.emit("check-status");
      $("#read-more-all-chat").show() ;
      $(".all-chat-loading").css("display" , "none");

      readMoreMessages();
      openGroupModalAndEditingGroup();
    })
  })
 

}

function readMoreUserConversation(){
  $("#link-read-more-user-chat").off("click").on("click" ,  function(){
    let skipPersonal = $("#user-chat").find("li.person").length; 
    $("#link-read-more-user-chat").hide() ; 
    $(".user-chat-loading").css("display" , "block"); 
    $.get(`/message/read-more-user-conversations?skipPersonal=${skipPersonal}` , (data) => {
      if(data.userChatLeftSide.trim() == ""){
        alertify.notify("Danh bạ cá nhân đã hết" , "error" , 5 ) ; 
        $("#link-read-more-user-chat").hide() ; 
        $(".user-chat-loading").css("display" , "block"); 
        return false ;
      }
      $(".emojionearea").remove();
      //handle leftSide 
      $("#user-chat").find("ul.people").append(data.userChatLeftSide) ;
      $(".left").getNiceScroll().resize(); 
      nineScrollLeft() ; 

      //handle RightSide 
      $("#screen-chat").append(data.userChatRightSide) ;
      $(".room-chat").off("click").on("click" , function(){
        let divId = $(this).find("li").data("chat") ; 
        if($(`#write[data-chat = ${divId}]`).find("emojionearea").length == 2){
          $(`#write[data-chat = ${divId}]`).find("emojionearea")[1].remove();
        }
      });
      changeScreenChat() ; 
      convertToImage();

      //handle Image Modal 
      $("body").append(data.userChatImageModal) ; 
      //handle Attachment Modal
      $("body").append(data.userChatAttachmentModal) ; 
      //appennd groupchat avatar modal
      $("body").append(data.groupChatAvatarModal);
      socket.emit("check-status") ; 
      $("#link-read-more-user-chat").show() ; 
      $(".user-chat-loading").css("display" , "none"); 
      readMoreMessages();
      openGroupModalAndEditingGroup();
    }).fail (err => {
      alertify.notify(err , "error" , 5) ;
    })
  })
}

function readMoreGroupConversation(){
  $("#link-read-more-group-chat").off("click").on("click" , function() {
    let skipGroup = $("#group-chat").find("li.group-chat").length ; 
    $("#link-read-more-group-chat").hide() ; 
    $(".group-chat-loading").css("display" , "block"); 
    $.get(`/message/read-more-group-conversations?skipGroup=${skipGroup}` , (data) => {
      if(data.groupChatLeftSide.trim() == ""){
        alertify.notify("Danh bạ nhóm đã hết" , "error" , 5 ) ; 
        $("#link-read-more-group-chat").hide() ; 
        $(".group-chat-loading").css("display" , "block"); 
        return false ;
      }
      //handle leftSide 
      $("#group-chat").find("ul.people").append(data.groupChatLeftSide) ;
      $(".left").getNiceScroll().resize(); 
      nineScrollLeft() ; 

      //handle RightSide 
      $("#screen-chat").append(data.groupChatRightSide) ;
      changeScreenChat() ; 
      convertToImage();

      //handle Image Modal 
      $("body").append(data.groupChatImageModal) ; 
      //handle Attachment Modal
      $("body").append(data.groupChatAttachmentModal) ; 

      socket.emit("check-status") ; 
      $("#link-read-more-group-chat").show() ; 
      $(".group-chat-loading").css("display" , "none");
      
      readMoreMessages();
      openGroupModalAndEditingGroup();
    }).fail (err => {
      alertify.notify(err , "error" , 5) ;
    })
  })
}
$(document).ready(function () {
  readMoreAllConversation();
  readMoreUserConversation();
  readMoreGroupConversation() ; 
});