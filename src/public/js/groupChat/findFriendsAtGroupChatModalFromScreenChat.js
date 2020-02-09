function findFriendsAtGroupChatModalFromScreenChat(event){
  if(event.which == 13 || event.type =="click"){
    let groupId = $(this).data("group-uid");
    let inputVal = $(`#input-search-friend-to-add-chat-group-${groupId}`).val();
    $(`#group-chat-friends-${groupId}`).html("");
    $(`.contactsList[data-group-uid = ${groupId}]`).html("");
    if(!inputVal.length){
      return false ; 
    }
    $.get(`/group-chat/find-more-friends-to-add-existed-group?inputVal=${inputVal}&groupId=${groupId}` , function(data){
      if(data.usersList.trim() == ""){
        $(`#group-chat-friends-${groupId}`).html("");
        $(`.contactsList[data-group-uid = ${groupId}]`).html("");
        return false ;
      }
      $(`ul.contactsList[data-group-uid = ${groupId} ]`).append(data.usersList);
      addFriendsIntoGroupFromScreenChat();
    })
  }
}

$(document).ready(function () {
  $(".input-search-more-friend-to-add-group-chat").on("keypress" ,findFriendsAtGroupChatModalFromScreenChat);
  $(".btn-search-more-friend-to-add-group-chat").on("click" , findFriendsAtGroupChatModalFromScreenChat);
});