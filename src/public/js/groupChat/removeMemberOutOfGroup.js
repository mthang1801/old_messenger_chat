function removeMemberOutOfGroup(){
  $(".more-remove-member").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let groupId = $(this).closest("ul").data("group");
    let userId = $("#dropdown-navbar-user").data("uid");
    let targetName = $(`#membersGroupChat-${groupId}`).find(`.member[data-chat = ${targetId}] .member-name`).text().trim();
    Swal.fire({
      type : "warning" , 
      title : `Bạn có chắc chắn mời &nbsp; <strong style="color:#e74c3c">${targetName}</strong> &nbsp; ra khỏi nhóm` , 
      width : "55rem" , 
      showConfirmButton : true , 
      showCancelButton : true,
      confirmButtonText : "Xác nhận" ,
      cancelButtonText : "Hủy bỏ" ,
      confirmButtonColor : "#2ecc71" , 
      cancelButtonColor : "#e74c3c" 
    }).then( result => {
      if(!result.value){
        return false ; 
      }
      $.ajax({
        type : "delete" , 
        url : `/group-chat/remove-member-out-of-group?memberId=${targetId}&groupId=${groupId}` , 
        success : function(data){
          if(data.position){
            if(data.position == "member-is-normal"){
            $(`.normal-members[data-group=${groupId}]`).find(`.member[data-chat = ${targetId}]`).remove();
            }else{
            $(`.administrators[data-group=${groupId}]`).find(`.member[data-chat = ${targetId}]`).remove();
            }
            //Giảm số thành viên 
            decreaseMemberAmount(groupId , userId);
            let dataToEmit = {
              memberId : targetId , 
              groupId : groupId ,
              group : data.group ,
              position : data.position
            }
            socket.emit("remove-member-out-of-group" , dataToEmit);
            socket.emit("show-to-the-others-member-out-of-group" , dataToEmit );
            addFriendsIntoGroupFromScreenChat();
          }
        }
      });
    });
  })
}

$(document).ready(function () {
  removeMemberOutOfGroup();
  socket.on("response-remove-member-out-of-group" , response => {
    let groupName = $("#all-chat").find(`li.person[data-chat= ${response.group._id}] .group-chat-name`).text().trim();
    let checkActive = $("#all-chat").find(`li[data-chat = ${response.group._id}]`).hasClass("active"); 
    $("#all-chat").find(`ul a[href='#uid_${response.group._id}']`).remove();
    $("#user-chat").find(`ul a[href='#uid_${response.group._id}']`).remove();

    $("#screen-chat").find(`#to_${response.group._id}`).remove(); 
    if(response.position == "member-is-normal"){
      $(`.normal-members[data-user= ${response.group._id}-${response.memberId}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
    }else{
      $(`#membersGroupChat-${response.group._id}[data-user =${response.group._id}-${response.memberId}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
    }
    
    $(`#membersGroupChat-${response.group._id}`).on("shown.bs.modal" , function(){
      $(`#membersGroupChat-${response.group._id}`).modal("hide");
    });
    $(`#membersGroupChat-${response.group._id}`).remove();
    $("body").find(`#imagesModal_${response.group._id}`).remove();
    $("body").find(`#attachsModal_${response.group._id}`).remove();
   
    if(checkActive){
      $("ul.people").find("a")[0].click();
    }
    
    // Swal.fire({
    //   type : "error" , 
    //   title : `Bạn đã bị mời ra khỏi nhóm &nbsp; <strong style="color:#e74c3c">${groupName} </strong> &nbsp;, không thể thực hiện thao tác này`,
    //   showConfirmButton : true , 
    //   confirmButtonText : "Xác nhận",
    //   width : "70rem"
    // }).then( result => {
    //   location.reload();
    // })
   
  });

  socket.on("response-show-to-the-others-member-out-of-group" , response => {
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