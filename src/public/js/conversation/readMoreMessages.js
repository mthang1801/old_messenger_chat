function readMoreMessages(){
  $(`.right .chat`).off("scroll").on("scroll" , function(){
    //get first message
    let firstMessage = $(this).find("div.bubble:first"); 
    //get position of first message
    let currentRightScreen = $(this);
    let currentOffsetTop = firstMessage.offset().top - $(this).scrollTop() ; 
    if($(this).scrollTop() == 0){
      let messageLoading = `<div class="message-loading"><div></div><div></div><div></div></div>`;
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessages = $(this).find("div.bubble").length;
     
      let isChatGroup = $(`#write-chat-${targetId}`).hasClass("chat-in-group") ? true : false ;
        
     

       $.get(`/message/read-more-messages?targetId=${targetId}&skipMessages=${skipMessages}&isChatGroup=${isChatGroup}` , function(data){
         //Step01 : handle RightSide
          $(`.chat[data-chat= ${targetId}]`).prepend(data.rightSide);
          
         //step02 : handle scroll bar
          $(`.chat[data-chat= ${targetId}]`).scrollTop(firstMessage.offset().top - currentOffsetTop);
          //remove loading
          currentRightScreen.find("div.message-loading").remove();
          //step03 :convert EmojiText
         
          convertToImage() ;
          changeScreenChat() ;
          zoomImageModal();
          //step04 : handle image Modal
          $(`#imagesModal_${targetId}`).find("div.all-images").prepend(data.imageModal);
          gridPhotos(5);
          //step05 : handle attachment Modal
          $(`#attachsModal_${targetId}`).find("ul.list-attachs").prepend(data.attachmentModal)
       }).fail( error => {
         console.log(error);
       })
    }
    
    
  })
}

$(document).ready(function () {
  readMoreMessages();
});