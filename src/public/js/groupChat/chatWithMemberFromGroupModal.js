function chatFromGroup(){
  $(`.member-talk`).off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let groupId = $(this).parents("div.groupPanel").data("group");
    $.get(`/contact/chat-with-user-from-contact-list?targetId=${targetId}` , function(data){

      //step00 : close modals
      $(`#membersGroupChat-${groupId}`).modal("hide") ; 
      //step01 : remove anything related with target
      $(`.person[data-chat = ${targetId}]`).parent().remove();
      $(`.right[data-chat = ${targetId}]`).remove();
      $(`#imagesModal_${targetId}`).remove() ;
      $(`#attachsModal_${targetId}`).remove();
      $("#contactsModal").modal("hide");
      //step02 : prepend to LeftSide
      $(`ul.people`).prepend(data.userChatLeftSide);
      $(".left").getNiceScroll().resize();
      //step03 : prepend to RightSide
      $(`#screen-chat`).prepend(data.userChatRightSide);
      convertToImage();
      changeScreenChat();
      $(`li.person[data-chat=${targetId}]`).click();
      //step04 : prepend Image Modal
      $("body").prepend(data.userChatImageModal);
      gridPhotos(5) ; 
      //step05 : prepend Attachment Modal
      $("body").prepend(data.userChatAttachmentModal);
      
      socket.emit("check-status");
      readMoreMessages();

    }).fail(error => {
      console.log(error);
    })
  })
}

$(document).ready(function () {
  chatFromGroup();
});