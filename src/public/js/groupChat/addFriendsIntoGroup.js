function removeFriendOutOfGroup(){
  $(".remove-user").off("click").on("click" , function(){
    let targetId = $(this).data("uid") ;
    let userHTML = $("#friends-added").find(`div[data-uid=${targetId}]`).get(0).outerHTML;
    $("#friends-added").find(`div[data-uid=${targetId}]`).remove();
    let promise = new Promise( (resolve , reject) => {
      $("#group-chat-friends").prepend(userHTML);
      $("#group-chat-friends").find(`.remove-user[data-uid = ${targetId}]`).remove() ;
      $("#group-chat-friends").find(`li[data-uid=${targetId}]`).append(`<div class="add-user" data-uid=${targetId}>Thêm vào nhóm</div>`);
      if(!$("#friends-added").find("li").length){
        $("#groupChatModal .list-user-added").hide();
      }
    })
    promise.then( success => {
      $("ul#friends-added").find(`div[data-uid = ${targetId}]`).remove();
    })
    addFriendsIntoGroup();
    createGroupChat();
  })
}
function addFriendsIntoGroup(){
  $(".add-user").off("click").on("click" , function(){
    let targetId = $(this).data("uid") ; 
    let userHTML = $("#group-chat-friends").find(`div[data-uid=${targetId}]`).get(0).outerHTML;
    $("#group-chat-friends").find(`div[data-uid=${targetId}]`).remove();
    let promise = new Promise( (resolve , reject ) => {
      $("ul#friends-added").append(userHTML)  ;
      $("#groupChatModal .list-user-added").show();
      $("#friends-added").find(`.add-user[data-uid=${targetId}]`).remove();
      $("#friends-added").find(`li[data-uid=${targetId}]`).append(`<div class="remove-user" data-uid="${targetId}">Hủy bỏ<div>`)
    })
    promise.then( success => {
      $("ul#group-chat-friends").find(`div[data-uid = ${targetId}]`).remove();
    })
    removeFriendOutOfGroup();
    createGroupChat();
  })
}

$(document).ready(function () {
  addFriendsIntoGroup() ;
});