
function chatAttachment(divId){
  $(`#attach-chat-${divId}`).off("change").on("change" , function(){
    let currentAttachment = $(this);
    let fileData = $(this).prop("files")[0] ;
    let match = ["image/jpeg" , "image/png" , "image/jpg"] ; 
    let limit = 1048576 ; 
    if($.inArray(fileData.type , match) != -1){
      alertify.notify("Tệp đính kèm không hợp lệ" , "error" ,5 );
      $(this).val(null) ; 
      return false ;
    }

    if(fileData.size > limit ){
      alertify.notify("Kích thước tệp quá lớn" , "error" , 5);
      $(this).val(null) ;
      return false  ;
    }

    let targetId = $(this).data("chat");
    let newAttachmentForm = new FormData();
    newAttachmentForm.append("my-attach-chat" , fileData) ;
    newAttachmentForm.append("targetId" , targetId) ;
    if($(this).hasClass("chat-in-group")){
      newAttachmentForm.append("isChatGroup" , true) ;
    }
    
    $.ajax({
      type: "post",
      url: "/message/add-new-attachment-chat",
      cache : false , 
      contentType : false ,
      processData : false ,
      data: newAttachmentForm,
      success: function (data) {
        let dataToEmit = {
          message : data.message 
        }     
        let myMessage = $(`<div class="bubble me bubble-image-file" data-mess-id="${targetId}"></div>"` );
        let attachmentMessage = `<a href="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
          ${data.message.file.fileName} 
        </a>
        `;
        if(data.message.conversationType == "group"){
          dataToEmit.groupId = divId ; 
          let myAvatar = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" />`
          myMessage.html(`${myAvatar} ${attachmentMessage}`);
        }else{
          dataToEmit.contactId = divId ;
          myMessage.html(`${attachmentMessage}`);
        }
         //02 
         $(`.chat[data-chat= ${divId}]`).append(myMessage);
         nineScrollRight(divId) ;
          $(`#attachsModal_${divId}`).find("ul.list-attachs").append(`<li>
          <a href="data:${ data.message.file.contentType };base64,${ bufferToBase64(data.message.file.data.data) }" 
          download="${ data.message.file.fileName }">
              ${ data.message.file.fileName }
          </a>
        </li>`);
         //03 
         currentAttachment.val(null) ;

        //04 : 
        $(`.person[data-chat = ${divId}]`).find(".time").removeClass("message-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find(".preview").html(`<strong>Tệp đính kèm...</strong>`);

        //05 : 
        $(`.person[data-chat = ${divId}]`).on("moveConversationWithImageChattoTop" , function(){
          let dataToMove = $(this).parent() ; 
          $(this).closest("ul").prepend(dataToMove) ;
          $(this).off("moveConversationWithImageChattoTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger("moveConversationWithImageChattoTop");

        socket.emit("user-chat-attachment" , dataToEmit)
        
        socket.emit("have-new-conversation-from-read-more" , dataToEmit) ;
      }
    });
  })
}

$(document).ready(function () {
  socket.on("response-user-chat-attachment" , response => {
    let yourMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message.sender.id}"></div>`);
    let attachmentMessage = `<a href="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
     ${response.message.file.fileName} 
     </a>
    `
    let divId = "";
    if(response.groupId){
      divId = response.groupId;
      let yourAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" />`;
      yourMessage.html(`${yourAvatar} ${attachmentMessage}`) ;
      
    }else{
      divId = response.currentUserId ; 
      yourMessage.html(`${attachmentMessage}`) ; 
    }
    console.log(divId);
    if( response.currentUserId != $("#dropdown-navbar-user").data("uid")){
      $(`.chat[data-chat = ${divId}]`).append(yourMessage);
      nineScrollRight(divId) ;
      $(`.person[data-chat= ${divId}]`).find(".time").addClass("message-real-time");
      $(`#attachsModal_${divId}`).find("ul.list-attachs").append(`<li>
          <a href="data:${ response.message.file.contentType };base64,${ bufferToBase64(response.message.file.data.data) }" 
          download="${ response.message.file.fileName }">
              ${ response.message.file.fileName }
          </a>
        </li>`);
      
    }else{
      nineScrollRight(divId);
    }

   

    $(`.person[data-chat= ${divId}]`).find(".time").html( moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow()) ;
    $(`.person[data-chat= ${divId}]`).find(".preview").html(`<strong>Tệp đính kèm</strong>`);
    $(`.person[data-chat= ${divId}]`).on("moveConversationAttachmentToTop" , function(){
      let dataToMove = $(this).parent() ; 
      $(this).closest("ul").prepend(dataToMove) ;
      $(this).off("moveConversationAttachmentToTop");
    })

    $(`.person[data-chat= ${divId}]`).trigger("moveConversationAttachmentToTop") ; 

  })
});