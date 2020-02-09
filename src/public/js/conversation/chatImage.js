let bufferToBase64 = (arrayBuffer) => {
  return btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}


function imageChat(divId){
  $(`#image-chat-${divId}`).off("change").on("change" ,  function(){
    let currentImageChat = $(this);
    let fileData = $(this).prop("files")[0];
    let match = ["image/jpg" , "image/jpeg" , "image/png"];
    let limit = 1048576 ; 
    if($.inArray(fileData.type , match) == -1){
      alertify.notify("Hình ảnh phải có đuôi dạng jpg , jpeg ,png" ,"error" , 5 ) ;
      $(this).val(null);
      return false ; 
    }
    if(fileData.size > limit){
      alertify.notify("Kích thước hình ảnh quá lớn" , "error" , 5) ; 
      $(this).val(null);
      return false ;
    }

    let messageFormData = new FormData() ; 
    messageFormData.append("my-image-chat" , fileData) ; 
    
    let targetId = $(this).data("chat");
    messageFormData.append("targetId" , targetId) ;

    if($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup" , true) ;
    }
    
    $.ajax({
      type: "post",
      url: "/message/add-new-image-chat",
      cache : false ,
      contentType : false , 
      processData : false  , 
      data: messageFormData,
      success: function (data) {   
        console.log(data);
        let dataToEmit = {
          message : data.message 
        }     
        console.log(data.message.file.data.data)
        console.log(bufferToBase64(data.message.file.data.data));
        let myMessage = $(`<div class="bubble me bubble-image-file" data-mess-id="${targetId}"></div>"` );
        let imageMessage = `
        <a href="javascript:void(0)" class="btn-msg-image-modal" data-mess-id="img-${data.message._id}">
         <img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}" class="show-image-chat" />
        </a>

        <div id="img-${data.message._id}" class="img-modal">
            <span class="img-close">&times;</span>
            <div class="img-modal-content">
              <img class="img-content" src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}"/>
            </div>                                      
        </div>
        `;
        if(data.message.conversationType == "group"){
          dataToEmit.groupId = divId ; 
          let myAvatar = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" />`
          myMessage.html(`${myAvatar} ${imageMessage}`);
        }else{
          dataToEmit.contactId = divId ;
          myMessage.html(`${imageMessage}`);
        }

        //02 
        
        $(`.chat[data-chat= ${divId}]`).append(myMessage);
        zoomImageModal();
        nineScrollRight(divId) ;
        
        $(`#imagesModal_${divId}`).find(".all-images").append(`<img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}"/>`);
        gridPhotos(5);
        //03 : 
        currentImageChat.val(null); 

        //04 : 
        $(`.person[data-chat = ${divId}]`).find(".time").removeClass("message-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find(".preview").html(`<strong>Hình ảnh...</strong>`);

        //05 : 
        $(`.person[data-chat = ${divId}]`).on("moveConversationWithImageChattoTop" , function(){
          let dataToMove = $(this).parent() ; 
          $(this).closest("ul").prepend(dataToMove) ;
          $(this).off("moveConversationWithImageChattoTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger("moveConversationWithImageChattoTop");

        socket.emit("user-chat-image" , dataToEmit );

        socket.emit("have-new-conversation-from-read-more" , dataToEmit) ;
      }

    });
  })
}

$(document).ready(function () {
  socket.on("response-user-chat-image" ,  response => {
    let yourMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message.sender.id}"></div>`);
    let yourImage = `
    <a href="javascript:void(0)" class="btn-msg-image-modal" data-mess-id="img-${response.message._id}">
      <img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}" class="show-image-chat" />
    </a>
    <div id="img-${response.message._id}" class="img-modal">
      <span class="img-close">&times;</span>
      <div class="img-modal-content">
        <img class="img-content" src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}"/>
      </div>                                      
    </div>
    `;
    let divId = "" ; 
    if(response.groupId){
      divId = response.groupId ; 
      let yourAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" />`;
      yourMessage.html(`${yourAvatar} ${yourImage}`) ;

    }else{
      divId = response.currentUserId ; 
      yourMessage.html(`${yourImage}`) ;
    }
    if(response.currentUserId != $(`#dropdown-navbar-user`).data("uid")){
      $(`.chat[data-chat = ${divId}]`).append(yourMessage);
      zoomImageModal();
      $(`.person[data-chat = ${divId}]`).find(".time").addClass("message-real-time");
       $(`#imagesModal_${divId}`).find(".all-images").append(`<img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}"/>`);
       gridPhotos(5);
      nineScrollRight(divId) ; 
    }else{
      nineScrollRight(divId) ; 
    }

   
    $(`.person[data-chat = ${divId}]`).find(".time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat = ${divId}]`).find(".preview").html(`<strong>Hình ảnh...</strong>`);

    $(`.person[data-chat = ${divId}]`).on("moveConversationWithImageChattoTop" , function(){
      let dataToMove= $(this).parent();
      $(this).closest("ul").prepend(dataToMove) ; 
      $(this).off("moveConversationWithImageChattoTop") ;
    })
    $(`.person[data-chat = ${divId}]`).trigger("moveConversationWithImageChattoTop");

  })
});