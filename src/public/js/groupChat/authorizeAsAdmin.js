//Ủy quyền admin
function authorizeAsAdmin(){
  $(".more-authorize-admin").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let groupId= $(this).closest("ul").data("group");
    let targetName = $(`#membersGroupChat-${groupId}`).find(`.groupPanel[data-uid = ${targetId}] .member-name`).text().trim();
    Swal.fire({
      title : `Bạn có chắc chắn muốn &nbsp; <strong style="color:#1abc9c">${targetName}</strong> &nbsp; làm quản trị nhóm` ,
      showConfirmButton : true , 
      showCancelButton : true , 
      confirmButtonText : "Đồng ý" , 
      cancelButtonText : "Hủy bỏ" , 
      confirmButtonColor : "#3498db" , 
      cancelButtonColor : "#e74c3c" , 
      width : "60rem"
    }).then( result => {
      if(!result.value){
        return false ; 
      }
      $.ajax({
        type : "put" , 
        url : `/group-chat/authorize-member-as-admin?memberId=${targetId}&groupId=${groupId}` ,
        success : function(data){
          console.log(data);
          $(`.normal-members[data-group=${groupId}]`).find(`.member[data-chat= ${targetId}]`).remove();
          $(`.administrators[data-group=${groupId}]`).append(data.newAdminRendering);
          removeRequestContact();
          removeRequestContactWithMemberFromGroup();
          approveRequestContactOfMemberFromGroup() ;
          chatFromGroup() ;
          removeMemberOutOfGroup();
          removeAdminAuthorization();
          socket.emit("check-status") ;
          let dataToEmit = {
            group : data.groupInfor ,
            newAdmin : data.newAdmin
          }
          socket.emit("authorize-new-admin-in-group" , dataToEmit) ;
          socket.emit("show-others-member-new-admin" , dataToEmit) ;
        }
      })
    })
   
  })
}

$(document).ready(function () {
  authorizeAsAdmin();
  socket.on("response-authorize-new-admin-in-group" , response => {
    let newAdminHTML = `
    <div class="col-md-6 col-sm-12 member" data-chat="${response.newAdmin._id}">
      <div class="groupPanel text-center admin" data-group="${response.newAdmin.groupId}" data-uid="${response.newAdmin._id}">
        <div class="member-avatar">                                
            <div class="dropdown-in-group">
              <div class="dropdown dropleft">
                <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${response.newAdmin._id}" class=" dropdown-toggle more-icons">
                  <img src="images/icons/more.png" >
                </a>                                    
                    <ul class="dropdown-menu more-authorize" data-button="${response.newAdmin._id}" data-group="${response.newAdmin.groupId}">
                      <li><a href="javascript:void(0)" class="more-leave-group" data-uid= "${response.newAdmin._id}">Rời khỏi nhóm</a></li>                                        
                    </ul>                                                                        
              </div>  
            </div>                                
          <div class="member-dot"></div>
          <img src="images/users/${response.newAdmin.avatar}"  class="img-avatar">
        </div>
        <div class="member-name">                              
            ${response.newAdmin.username}                            
        </div>
        <div class="member-address">
          <p>
            ${response.newAdmin.address ? response.newAdmin.address : ""}
          </p>
        </div>
        <div class="row" >
          
        </div>
      </div>
    </div>
    `;
    $(`.normal-members[data-group=${response.newAdmin.groupId}]`).find(`.member[data-chat= ${response.newAdmin._id}]`).remove();
    $(`.administrators[data-group=${response.newAdmin.groupId}]`).prepend(newAdminHTML);
    $(`.normal-members[data-user =${response.newAdmin.groupId}-${response.newAdmin._id}]`).find("div.member").each( (index, value) =>{
      targetId = $(value).data("chat");
      let authorizationOfAdmin = `
      <div class="dropdown-in-group">
        <div class="dropdown dropleft">
          <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${targetId}" class="dropdown-toggle more-icons">
            <img src="images/icons/more.png" >
          </a>                                    
            <ul class="dropdown-menu more-authorize" data-button="${targetId}" data-group="${response.newAdmin.groupId}">
                <li><a href="javascript:void(0)" class="more-remove-member" data-uid="${targetId}">Mời khỏi nhóm</a></li>
            </ul>                                    
        </div>
      </div>
      `
      $(`.normal-members[data-user =${response.newAdmin.groupId}-${response.newAdmin._id}]`).find(`.groupPanel[data-uid = ${targetId}] div.member-avatar`).prepend(authorizationOfAdmin);

      //removeMemberOutOfGroup

      removeRequestContact();
      removeRequestContactWithMemberFromGroup();
      approveRequestContactOfMemberFromGroup() ;
      chatFromGroup() ;
      addContactWithMemberFromGroup();
      removeMemberOutOfGroup();
      leaveGroup();
      socket.emit("check-status");
    })
  })

  socket.on("response-show-others-member-new-admin" , response => {
    console.log(response) ;
    response.group.members.forEach( member => {
      $(`.normal-members[data-user = ${response.group._id}-${member.userId}]`).find(`.groupPanel[data-uid=${response.newAdmin._id}]`).addClass("admin");
      $(`.normal-members[data-user = ${response.group._id}-${member.userId}]`).find(`div.member[data-chat= ${response.newAdmin._id}] .dropdown-in-group`).remove();
      let newAdminHTML =  $(`.normal-members[data-user = ${response.group._id}-${member.userId}]`).find(`div.member[data-chat= ${response.newAdmin._id}]`).html();
      $(`.normal-members[data-user = ${response.group._id}-${member.userId}]`).find(`div.member[data-chat= ${response.newAdmin._id}]`).remove();
      newAdminOuterHTML = `<div class="col-md-6 col-sm-12 member" data-chat="${response.newAdmin._id}">${newAdminHTML}</div>`;
      $(`#membersGroupChat-${response.group._id}[data-user= ${response.group._id}-${member.userId}]`).find("div.administrators").append(newAdminOuterHTML);
      removeRequestContact();
      removeRequestContactWithMemberFromGroup();
      approveRequestContactOfMemberFromGroup() ;
      chatFromGroup() ;
      addContactWithMemberFromGroup();
      removeMemberOutOfGroup();
      socket.emit("check-status");
    })
  })
});