function typingOn(divId){
  if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
    socket.emit("user-is-typing" , {groupId : divId}) 
  }else{
    socket.emit("user-is-typing" , {contactId : divId})
  }
}

function typingOff(divId){
  if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
    socket.emit("user-stop-typing" , {groupId : divId}) 
  }else{
    socket.emit("user-stop-typing" , {contactId : divId})
  }
}


$(document).ready(function () {
  socket.on("response-user-is-typing" , response => {
    let messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src="images/chat/typing.gif" >
    </div>
    `;
    if(response.groupId){
     if(response.currentUserId != $(`#dropdown-navbar-user`).data("uid") ){
      let isTyping = $(`.right .chat[data-chat = ${response.groupId}]`).find(".bubble-typing-gif");
      if(isTyping.length){
        return false ;
      }
      $(`.right .chat[data-chat = ${response.groupId}]`).append(messageTyping);
      nineScrollRight(response.groupId);
     }
    }else{
      if(response.currentUserId != $(`#dropdown-navbar-user`).data("uid") ){
      let isTyping = $(`.right .chat[data-chat = ${response.currentUserId}]`).find(".bubble-typing-gif");
      if(isTyping.length){
        return false ;
      }
      $(`.right .chat[data-chat = ${response.currentUserId}]`).append(messageTyping);
      nineScrollRight(response.currentUserId);
      }
    }
  })

  socket.on("response-user-stop-typing" , response => {
    if(response.groupId){
      let isTyping = $(`.right .chat[data-chat = ${response.groupId}]`).find(".bubble-typing-gif");
      if(isTyping.length){
        isTyping.remove() ;
      }
    }else{
      if(response.currentUserId !=  $(`#dropdown-navbar-user`).data("uid")){
        let isTyping = $(`.right .chat[data-chat = ${response.currentUserId}]`).find(".bubble-typing-gif");
      if(isTyping.length){
        isTyping.remove() ;
      }
      }
    }
  })
});