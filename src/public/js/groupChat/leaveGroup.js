
//Tự thoát khỏi nhóm
function leaveGroup(){
  $(".more-leave-group").off("click").on("click" , function(){
    let memberId = $(this).data("uid") ; 
    let groupId = $(this).closest("ul").data("group");
    $.ajax({
      type : "delete" , 
      url : `/group-chat/leave-group?groupId=${groupId}`,
      success : function(data){
        console.log(data);
        let checkActive = $("#all-chat").find(`li[data-chat = ${groupId}]`).hasClass("active"); 
        let promise = new Promise( (resolve , reject) => {
          $(`#membersGroupChat-${groupId}[data-user=${groupId}-${memberId}]`).on("shown.bs.modal" , function(){
            $(`#membersGroupChat-${groupId}[data-user=${groupId}-${memberId}]`).modal("hide");
          });
          resolve(true);
        })
        promise.then(success => {
          $("#all-chat").find(`ul a[href='#uid_${groupId}']`).remove();
          $("#user-chat").find(`ul a[href='#uid_${groupId}']`).remove();
  
          $("#screen-chat").find(`#to_${groupId}`).remove(); 
          if(data.position == "member-is-normal"){
            $(`.normal-members[data-user= ${groupId}-${memberId}]`).find(`.member[data-chat = ${memberId}]`).remove();
          }else{
            $(`#membersGroupChat-${groupId}[data-user =${groupId}-${memberId}]`).find(`.member[data-chat = ${memberId}]`).remove();
          }
        
          $(`#membersGroupChat-${groupId}`).remove();
          $("body").find(`#imagesModal_${groupId}`).remove();
          $("body").find(`#attachsModal_${groupId}`).remove();
          if(checkActive){
            $("ul.people").find("a")[0].click();
          }
          let dataToEmit = {
            memberId : memberId , 
            groupId : groupId ,
            group : data.group ,
            position : data.position
          }
          socket.emit("leave-group" , dataToEmit);
          
          location.reload();
        }) 
      }
    })
  })
}

$(document).ready(function () {
  leaveGroup();
  socket.on("response-leave-group" , response => {
    console.log(response);
    response.group.members.forEach( member => {
      if(response.position == "member-is-normal"){
        $(`.normal-members[data-user= ${response.group._id}-${member.userId}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
      }else{
        $(`#membersGroupChat-${response.group._id}[data-user =${response.group._id}-${member.userId}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
      }
      decreaseMemberAmount(response.group._id, member.userId)
    })
  })
});