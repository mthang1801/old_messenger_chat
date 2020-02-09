function findFriendsAtGroupChatModal(element) {
    if(element.which == 13 || element.type == "click"){ 
    $("#group-chat-friends").html("");
    let inputVal = $("#input-search-friend-to-add-group-chat").val() ;
    if(inputVal.length == 0){
      return false ; 
    }
    $.get(`/group-chat/find-friends?inputVal=${inputVal}` , function(data){
      if(data.usersList.trim() == ""){
        $("#group-chat-friends").html("");
        return false ; 
      }
      $("#group-chat-friends").append(data.usersList);
      addFriendsIntoGroup();
    });
    }
}


$(document).ready(function () {
  $("#input-search-friend-to-add-group-chat").on("keypress" , findFriendsAtGroupChatModal ) ;
  $("#btn-search-friend-to-add-group-chat").on("click" , findFriendsAtGroupChatModal);
});