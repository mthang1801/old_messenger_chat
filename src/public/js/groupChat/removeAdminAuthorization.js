
function removeAdminAuthorization() {
  $(".more-remove-admin").off("click").on("click", function () {
    let memberId = $(this).data("uid");
    let groupId = $(this).closest("ul").data("group");
    let memberName = $(`#membersGroupChat-${groupId}`).find(`.member[data-chat = ${memberId}] .member-name`).text().trim();
    Swal.fire({
      type : "warning" , 
      title : `Bạn có chắc chắn để  &nbsp;<strong style="color:#e74c3c">${memberName}</strong> &nbsp; thôi chức vị quản trị viên ?` ,
      width : "600px" ,
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
        type : "put" , 
        url : `/group-chat/remove-admin-authorization?memberId=${memberId}&groupId=${groupId}` ,
        success : function(data){          
          $(`.administrators[data-group = ${groupId}]`).find(`.groupPanel[data-uid = ${memberId}]`).removeClass("admin");
          $(`.administrators[data-group = ${groupId}]`).find(`.more-remove-admin[data-uid=${memberId}]`).closest("li")[0].remove();
          let authorizeHost = `
            <li><a href="javascript:void(0)" class=" more-authorize-admin" data-uid= "${memberId}">Cấp quyền admin</a></li>
          `
          $(`.administrators[data-group = ${groupId}]`).find(`.more-authorize[data-button = ${memberId}]`).prepend(authorizeHost);
          let memberAfterRemovingAdmin = $(`.administrators[data-group = ${groupId}]`).find(`.member[data-chat = ${memberId}]`);
          $(`.administrators[data-group = ${groupId}]`).find(`.member[data-chat = ${memberId}]`).remove();
          $(`.normal-members[data-group = ${groupId}]`).prepend(memberAfterRemovingAdmin);
          let dataToEmit = {
            memberId : memberId , 
            group : data.group 
          }
          socket.emit("remove-admin-authorization" , dataToEmit) ;
          socket.emit("check-status");
          authorizeAsAdmin();
          removeMemberOutOfGroup();
        }
      })
    })
   
  })
}

$(document).ready(function () {
  removeAdminAuthorization();
  socket.on("response-remove-admin-authorization" , response => {
    console.log(response);
    
    let newMemberAuthorize = `
    <div class="dropdown-in-group">
      <div class="dropdown dropleft">
        <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${response.memberId}" class=" dropdown-toggle more-icons">
          <img src="images/icons/more.png" >
        </a>    
          <ul class="dropdown-menu more-authorize" data-button="${response.memberId}" data-group="${response.group._id}">
            <li><a href="javascript:void(0)" class="more-leave-group" data-uid= "${response.memberId}">Rời khỏi nhóm</a></li>
          </ul>                                    
      </div>
    </div>
    `;
    $(`.administrators[data-group = ${response.group._id}]`).find(`.groupPanel[data-uid = ${response.memberId}]`).removeClass("admin");
    $(`.administrators[data-group = ${response.group._id}]`).find(`div.dropdown-in-group`).remove();
    $(`.administrators[data-group = ${response.group._id}]`).find(`.groupPanel[data-uid = ${response.memberId}]`).find("div.member-avatar").prepend(newMemberAuthorize);
    let memberAfterRemovingAdmin = $(`.administrators[data-group = ${response.group._id}]`).find(`.member[data-chat = ${response.memberId}]`);
    $(`.administrators[data-group = ${response.group._id }]`).find(`.member[data-chat = ${response.memberId}]`).remove();
    $(`.normal-members[data-group = ${response.group._id }]`).prepend(memberAfterRemovingAdmin);
    socket.emit("check-status");
    leaveGroup();
  });

  socket.on("response-remove-admin-authorization-to-others" , response => {
    console.log(response);
    response.group.members.forEach( member => {
      let userId = member.userId ; 
      let memberId = response.memberId ; 
      let groupId = response.group._id ; 
      //check user is whether admin or not
      if( $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.groupPanel[data-uid =${userId}]`).hasClass("admin") ){
        $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.groupPanel[data-uid = ${memberId}]`).removeClass("admin");
       let memberAuthorize = `
       <div class="dropdown-in-group">
          <div class="dropdown dropleft">
            <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${response.memberId}" class=" dropdown-toggle more-icons">
              <img src="images/icons/more.png" >
            </a>    
              <ul class="dropdown-menu more-authorize" data-button="${response.memberId}" data-group="${response.group._id}">
              <li><a href="javascript:void(0)" class="more-remove-member" data-uid="${response.memberId}">Mời khỏi nhóm</a></li>
              </ul>                                    
          </div>
        </div>
       `
       $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.groupPanel[data-uid = ${response.memberId}]`).find("div.member-avatar").prepend(memberAuthorize);
       let memberAfterRemovingAdmin = $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.administrators .member[data-chat = ${memberId}]`);
       $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.administrators .member[data-chat = ${memberId}]`).remove();
       $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.normal-members`).prepend(memberAfterRemovingAdmin);
       removeMemberOutOfGroup();
       socket.emit("check-status");
        return ; 
      }
      $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.groupPanel[data-uid = ${memberId}]`).removeClass("admin");
      $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.groupPanel[data-uid = ${memberId}] .dropdown-in-group`).remove();
      let memberAfterRemovingAdmin = $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.administrators .member[data-chat = ${memberId}]`);
      $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.administrators .member[data-chat = ${memberId}]`).remove();
      $(`#membersGroupChat-${groupId}[data-user = ${groupId}-${userId}]`).find(`.normal-members`).append(memberAfterRemovingAdmin);
      socket.emit("check-status");
    })
  })
});