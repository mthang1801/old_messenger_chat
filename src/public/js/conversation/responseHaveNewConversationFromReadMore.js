$(document).ready(function () {
  socket.on("response-have-new-conversation-from-read-more" , async response => {
   console.log(response);
    if(response.groupId && !$("ul.people").has(`[data-chat = ${response.groupId}]`).length  && ( response.currentUserId != $(`#dropdown-navbar-user`).data("uid")) ){
      let dataToRequest = {
        isGroup : true , 
        targetId : response.groupId
      } ;   
      await $.ajax({
        type : "get" , 
        url : `/message/find-conversation-from-read-more-and-take-to-the-first-row?targetId=${dataToRequest.targetId}&isGroup=${dataToRequest.isGroup}`,
        success : (data) => {
        
          //prepend to the first row at leftSide
          $("#all-chat").find("ul.people").prepend(data.leftSide);
          if(response.groupId){
            $("#group-chat").find("ul.people").prepend(data.leftSide) ;
          }else{
            $("user-chat").find("ul.people").prepend(data.leftSide);
          }
          $(".left").getNiceScroll().resize();
          nineScrollLeft();        
                 
          $("#screen-chat").append(data.rightSide);
          changeScreenChat();
  
          $("body").append(data.imagesModal);
          gridPhotos(5);
  
          $("body").append(data.attachmentsModal);
          socket.emit("check-status");
          openGroupModalAndEditingGroup();

          readMoreMessages();
       }
      })
      return ; 
    }
  
    if(!response.groupId && !$("ul.people").has(`[data-chat = ${response.currentUserId}]`).length  && ( response.currentUserId != $(`#dropdown-navbar-user`).data("uid"))){
      let dataToRequest = {
        isGroup : false ,
        targetId : response.currentUserId 
      };   
      await $.ajax({
        type : "get" , 
        url : `/message/find-conversation-from-read-more-and-take-to-the-first-row?targetId=${dataToRequest.targetId}&isGroup=${dataToRequest.isGroup}`,
        success : (data) => {
          
          //prepend to the first row at leftSide
          $("#all-chat").find("ul.people").prepend(data.leftSide);
          if(response.groupId){
            $("#group-chat").find("ul.people").prepend(data.leftSide) ;
          }else{
            $("user-chat").find("ul.people").prepend(data.leftSide);
          }
          $(".left").getNiceScroll().resize();
          nineScrollLeft();        
                 
          $("#screen-chat").append(data.rightSide);
          changeScreenChat();
  
          $("body").append(data.imagesModal);
          gridPhotos(5);
  
          $("body").append(data.attachmentsModal);
          socket.emit("check-status");
          openGroupModalAndEditingGroup();
          readMoreMessages();
       }
      })
      return ;
    }
    
  });
});