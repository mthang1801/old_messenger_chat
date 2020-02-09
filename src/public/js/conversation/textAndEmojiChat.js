function popupMessageTime(timeStamp){
  if(!timeStamp){
    return "" ;
  }
  return moment(timeStamp).format('lll');
}
function convertTimeNewMessage(timeStamp){
  if(!timeStamp){
    return "" ;
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
}

function textAndEmojiChat(divId){
  $(".emojionearea").off("keyup").on("keyup" , function(event){
    let currentTextArea = $(this);
    if(event.which == 13 ){
      let messageVal = $(`#write-chat-${divId}`).val() ; 
      let targetId=  $(`#write-chat-${divId}`).data("chat");
      let isGroup = false ; 
      if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        isGroup = true  ;
      }
      
      $.post(`/message/add-new-text-emoji?messageVal=${messageVal}&targetId=${targetId}&isGroup=${isGroup}` , function(data){
        let dataToEmit= {
          message : data.message 
        }
       
       let myMessage = $(` <div class="bubble me" data-mess-id="${data.message._id}" ></div> `) ; 
       myMessage.text(data.message.text);
        let convertEmojiText = emojione.toImage(myMessage.html());

        if(data.message.conversationType== "group"){
          let myAvatar  = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small"/>`;
          myMessage.html(`${myAvatar} ${convertEmojiText}`);
          dataToEmit.groupId = divId ; 
        }else{
          myMessage.html(`${convertEmojiText}`);
          dataToEmit.contactId = divId  ;
        }
        $(".left").getNiceScroll().resize();
        nineScrollLeft();        
                 
        
        //02 : append message 
        $(`.chat[data-chat = ${divId}]`).append(myMessage) ; 
        nineScrollRight(divId);
        changeScreenChat();
        //03 remove all input data
        $(`#write-chat-${divId}`).val("");
        currentTextArea.find(".emojionearea-editor").text("");

        //04 : change data preview and  time in leftSide
        let messageText = data.message.text; 
        messageText.length > 15 ? messageText + "..." : messageText ; 
        $(`li.person[data-chat=${divId}]`).find(".preview").html(  emojione.toImage(messageText));
        $(`li.person[data-chat=${divId}]`).find(".time").removeClass("message-real-time").html(convertTimeNewMessage(data.message.createdAt)) ; 
        
        //05 : push conversation to top leftSide
        $(`.person[data-chat=${divId}]`).on("pushConversationToTop" , function(){
          let dataToMove = $(this).parent() ; 
          $(this).closest("ul").prepend(dataToMove); 
          $(this).off("pushConversationToTop");
        })
        $(`li.person[data-chat=${divId}]`).trigger("pushConversationToTop");

        socket.emit("have-new-conversation-from-read-more" , dataToEmit) ;
       
        socket.emit("chat-text-emoji" , dataToEmit) ; 
        
        typingOff(divId);
        
        let checkTyping = $(`.chat[data-chat = ${divId}]`).find("div.bubble-typing-gif");
        if(checkTyping.length){
          checkTyping.remove();
        }
      })
    }
  })
}


$(document).ready(function () {
  socket.on("response-chat-text-emoji" ,response => {
    let yourMessage = $(`<div class="bubble you" data-mess-id=${response.message._id}> </div>`);
    yourMessage.text(response.message.text) ;
    let convertToEmojiText = emojione.toImage(yourMessage.html());
    let divId = "" ; 
    if(response.groupId){
      divId = response.groupId;
      let yourAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" />`;
      yourMessage.html(`${yourAvatar} ${convertToEmojiText}`);
      
    }else{
      divId = response.message.sender.id ; 
      yourMessage.html(`${convertToEmojiText}`);
    }
   
     //02 : append message 
     if( response.currentUserId != $(`#dropdown-navbar-user`).data("uid")) {    
      $(`.chat[data-chat = ${divId}]`).append(yourMessage) ;     
      nineScrollRight(divId);
      $(`li.person[data-chat=${divId}]`).find(".time").addClass("message-real-time")
     }else{
       nineScrollRight(divId);
     }
  
     //03 : nothing to code
  
     //04 : change data preview and  time in leftSide
     let messageText = response.message.text; 
     messageText.length > 15 ? messageText + "..." : messageText ; 
     $(`li.person[data-chat=${divId}]`).find(".preview").html(  emojione.toImage(messageText));
     $(`li.person[data-chat=${divId}]`).find(".time").html(convertTimeNewMessage(response.message.createdAt)) ; 
  
      //05 : push conversation to top leftSide
      $(`.person[data-chat=${divId}]`).on("pushConversationToTop" , function(){
        let dataToMove = $(this).parent() ; 
        $(this).closest("ul").prepend(dataToMove); 
        $(this).off("pushConversationToTop");
      })
      $(`li.person[data-chat=${divId}]`).trigger("pushConversationToTop");
  })
})


