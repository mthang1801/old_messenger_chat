function addFriendsIntoGroupFromScreenChat(){
  $(".add-user").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let targetName = $(this).siblings(".user-name").text().trim();
    let groupId = $(this).closest("ul").data("group-uid");
    let userId = $("#dropdown-navbar-user").data("uid");

    let userIsHost = $(`.groupPanel[data-uid = ${userId}]`).hasClass("host") ? "host" : "admin"  ;    
    Swal.fire({
      title :`Bạn có chắc chắn muốn thêm &nbsp; <span style="color:#f1c40f">${targetName}</span> &nbsp; vào nhóm` , 
      showConfirmButton: true , 
      confirmButtonText : "Đồng ý" , 
      confirmButtonColor: "#2ecc71" ,
      showCancelButton : true , 
      cancelButtonText : "Hoàn tác",
      cancelButtonColor: "#e74c3c" ,
      width : "60rem"
    }).then( result => {
      if(!result.value){
        return false ;
      }
      $.ajax({
        type : "put" , 
        url : `/group-chat/add-more-members-into-group?targetId=${targetId}&groupId=${groupId}`,
        success : function(data){
          //remove from contactList 
          $(`ul.contactsList[data-group-uid = ${groupId}]`).find(`div[data-uid = ${targetId}]`).remove();
          let memberGroupChatHTML ;
          if(userIsHost == "host"){
            memberGroupChatHTML = `
          <div class="col-md-6 col-xs-12 member" data-chat="${targetId}">
            <div class="groupPanel text-center" data-group="${groupId}" data-uid="${targetId}">
              <div class="member-avatar">
               
                <div class="dropdown-in-group">
                  <div class="dropdown dropleft">
                    <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${targetId}" class=" dropdown-toggle more-icons">
                      <img src="images/icons/more.png" >
                    </a>                    
                        <ul class="dropdown-menu more-authorize" data-button="${targetId}" data-group="${groupId}">
                          <li><a href="javascript:void(0)" class=" more-authorize-admin" data-uid= "${targetId}">Cấp quyền admin</a></li>
                          <li><a href="javascript:void(0)" class="more-remove-member" data-uid="${targetId}">Mời khỏi nhóm</a></li>
                        </ul>
                    
                  </div>
                </div>                
                <div class="member-dot"></div>
                <img src="images/users/${data.memberInfor.avatar}" class="img-avatar">
              </div>
              <div class="member-name">                
                 ${data.memberInfor.username}                
              </div>
              <div class="member-address">
                  <p>
                    ${data.memberInfor.address ? data.memberInfor.address : ""}
                  </p>
                </div>
              <div class="row">
            
                <div class="col-xs-6  col-xs-push-3 btn-box">                  
                  <div class="member-talk" data-uid="${targetId}" >
                    <span>
                      Nhắn tin
                    </span>
                  </div>                 
                </div>
              
              </div>
            </div>
        </div>
          `;
        } else {
          memberGroupChatHTML = `
          <div class="col-md-6 col-xs-12 member" data-chat="${targetId}">
          <div class="groupPanel text-center" data-group="${groupId}" data-uid="${targetId}">
            <div class="member-avatar">
                <div class="dropdown-in-group">
                  <div class="dropdown dropleft">
                    <a href="javascript:void(0)" data-toggle="dropdown" data-uid="${targetId}" class=" dropdown-toggle more-icons">
                      <img src="images/icons/more.png" >
                    </a>                                    
                      <ul class="dropdown-menu more-authorize" data-button="${targetId}" data-group="${groupId}">
                          <li><a href="javascript:void(0)" class="more-remove-member" data-uid="${targetId}">Mời khỏi nhóm</a></li>
                      </ul>                                    
                  </div>
                </div>
              <div class="member-dot"></div>
              <img src="images/users/${data.memberInfor.avatar}" class="img-avatar">
            </div>
            <div class="member-name">                
               ${data.memberInfor.username}                
            </div>
            <div class="member-address">
                <p>
                  ${data.memberInfor.address ? data.memberInfor.address : ""}
                </p>
              </div>
            <div class="row">
          
              <div class="col-xs-6  col-xs-push-3 btn-box">                  
                <div class="member-talk" data-uid="${targetId}" >
                  <span>
                    Nhắn tin
                  </span>
                </div>                 
              </div>
            
            </div>
          </div>
      </div>
          `
        }
        

        //append to group Modal 
        $(`div.normal-members[data-group=${groupId}]`).append(memberGroupChatHTML);
        socket.emit("check-status") ;
        let dataToEmit = {
          contactId : targetId ,
          memberInfor : data.memberInfor ,
          groupInfor : data.groupInfor
        }
        
        //increase MemberAmount 
        increaseMemberAmount(groupId , userId);
        socket.emit("add-friend-into-group-chat" , dataToEmit);
        socket.emit("new-member-join-group" , dataToEmit );
        chatFromGroup();
        authorizeAsAdmin();
        removeMemberOutOfGroup();
        leaveGroup();
        },
        error : function(error) {
          alertify.notify(error.responseText , "error" , 7);
        }
      })
    })
  })
}


$(document).ready(function () {
  addFriendsIntoGroupFromScreenChat();
  socket.on("response-add-friend-into-group-chat" , response =>{
    console.log(response);
    let subGroupName = response.group.name ;
    if(subGroupName.length > 15){
      subGroupName = subGroupName.substr(0,14) + "..." ;
    }
    //prepend at LeftSide 
    let leftSideHTML = `
    <a href="#uid_${response.group._id}" class="room-chat" data-target="#to_${response.group._id}">
      <li class="person group-chat" data-chat="${response.group._id}">
          <div class="left-avatar">              
              <img src="/images/users/${response.group.avatar}" alt="${response.group.name}">
          </div>
          <span class="name">
              <span class="group-chat-name">
                  ${subGroupName}
              </span>
          </span>
      
          <span class="time">
              
          </span>
          <span class="preview  convert-emoji">
             
          </span>
        </li>
      </a>
    `;
    $("#all-chat").find("ul.people").prepend(leftSideHTML) ; 
    $("#group-chat").find("ul.people").prepend(leftSideHTML);
    $(".left").getNiceScroll().resize();
    //prepend at Right Side
    let rightSideHTML = `
    <div class="right tab-pane" data-chat="${response.group._id}" id="to_${response.group._id}" data-user="${response.group._id}-${response.memberId}">
      <div class="top">
          <span>To: <span class="name">${response.group.name}</span></span>
          <span class="chat-menu-right">
              <a href="#attachsModal_${response.group._id}" class="show-attachs" data-toggle="modal">
                  Tệp đính kèm
                  <i class="fa fa-paperclip"></i>
              </a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
              <a href="#imagesModal_${response.group._id}" class="show-images" data-toggle="modal">
                  Hình ảnh
                  <i class="fa fa-photo"></i>
              </a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
              <a href="#membersGroupChat-${response.group._id}" class="show-number-members" data-toggle="modal" data-user="${response.group._id}-${response.memberId}" >
                  ${response.group.members.length}
                  <i class="fa fa-users"></i>
              </a>
          </span>          
          <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)" class="show-number-messages" data-toggle="modal">
                  ${response.group.messageAmount}
                  <i class="fa fa-comments"></i>
              </a>
          </span>
      </div>
      <div class="content-chat">
          <div class="chat convert-emoji" data-chat="${response.group._id}">
              
          </div>
      </div>
      <div class="write" data-chat="${response.group._id}">
          <input type="text" class="write-chat chat-in-group" id="write-chat-${response.group._id}" data-chat="${response.group._id}">
          <div class="icons">
              <a href="#" class="icon-chat"  data-chat="${response.group._id}"><i class="fa fa-smile-o"></i></a>
              <label for="image-chat-${response.group._id}" class="label-image-chat" >
                  <input type="file" class="image-chat chat-in-group" id="image-chat-${response.group._id}" name="my-image-chat" data-chat="${response.group._id}">
                  <i class="fa fa-photo"></i>
              </label>
              <label for="attach-chat-${response.group._id}" class="label-attachment-chat">
                  <input type="file" id="attach-chat-${response.group._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${response.group._id}">
                  <i class="fa fa-paperclip"></i>
              </label>
              <a href="javascript:void(0)" id="video-chat-${response.group._id}" class="chat-in-group">
                  <i class="fa fa-video-camera"></i>
              </a>
              
          </div>
      </div>
  </div>
    `
    $("#screen-chat").prepend(rightSideHTML);
    changeScreenChat() ; 
    convertToImage();

    let imageModalHMTL = `
    <div class="modal fade" id="imagesModal_${response.group._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
              </div>
              <div class="modal-body">
                  <div class="all-images" style="visibility: hidden;">
                      
                  </div>
              </div>
          </div>
      </div>
  </div>
    `;

    $("body").append(imageModalHMTL);
    gridPhotos(5);

    let attachmentModal = `
    <div class="modal fade" id="attachsModal_${response.group._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện</h4>
              </div>
              <div class="modal-body">
                  <ul class="list-attachs">
                      
                  </ul>
              </div>
          </div>
      </div>
    </div>  
    `

    $("body").append(attachmentModal);
    socket.emit("check-status");
    let dataToEmit = {
      groupChatId : response.group._id 
    }
    socket.emit("member-received-group-chat" , dataToEmit) ;
  
    $.get(`/group-chat/new-member-get-old-members-in-group?memberId=${response.member._id}&groupId=${response.group._id}` , function(data){
      console.log(data);
      let groupChatModal = `
      <div class="modal fade" id="membersGroupChat-${response.group._id}" role="dialog" data-user="${response.group._id}-${response.memberId}">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Thành viên trong nhóm <span style="font-weight:bold;color:#1abc9c">${response.group.name}</span></h4>
                </div>
                <div< class="modal-body">
                  
                    <div class="container-fluid">
                      <div class="row">
                      <div class="col-md-5 col-sm-12 find-user-in-group">
                        <div class="form-search-members-in-group">
                            <div class="input-group">
                              <input type="text" class="form-control" class="input-search-friend-in-group-chat" placeholder="Nhập E-mail hoặc username ..." >
                              <div class="input-group-btn">
                                <button type="button" class="btn btn-default" id="btn-search-friend-in-group-chat">
                                  <i class="glyphicon glyphicon-search"></i>
                                </button>
                              </div>
                            </div>
                            
                        </div>
                      </div>
                    </div>
                  <div class="members-list">
                    <div class="admins">
                      Quản trị viên
                      <hr class="hr-members">                      
                        <div class="row administrators" data-group="${response.group._id}">

                        </div>
                    </div>
                                        
                    <div class="normal-membersList">
                      Thành viên
                      <hr class="hr-members" >
                      <div class="row normal-members" data-group="${response.group._id}" data-user="${response.group._id}-${response.memberId}">
                      
                      </div>
                    </div>   
                  </div>   
                </div>
            </div>
        </div>
      </div>
      `

      $("body").append(groupChatModal);
      $(`.administrators[data-group = ${response.group._id}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
      $(`.normal-members[data-group = ${response.group._id}]`).find(`.member[data-chat = ${response.memberId}]`).remove();
      $(`.administrators[data-group = ${response.group._id}]`).html(`${data.hostInfor} ${data.adminsInfor} `);
      $(`.normal-members[data-group = ${response.group._id}]`).html(`${data.memberSelfInfor} ${data.membersInfor} `);
      addContactWithMemberFromGroup();
      removeRequestContactWithMemberFromGroup();
      approveRequestContactOfMemberFromGroup() ;
      chatFromGroup() ;
      addFriendsIntoGroupFromScreenChat();
      authorizeAsAdmin();
      leaveGroup();
      socket.emit("check-status");
      let dataToEmit = {
        groupChatId : response.group._id 
      }
      socket.emit("member-received-group-chat" , dataToEmit);
    })
  })

  socket.on("response-new-member-join-group" , response => {
    console.log(response);
    response.group.members.forEach( member => {
      let memberId = member.userId ; 
     $.get(`/group-chat/check-relationship-between-new-member-and-old-members?newMemberId=${response.member._id}&oldMemberId=${memberId}&groupId=${response.group._id}` , function(data){   
        
      $(`#membersGroupChat-${response.group._id}[data-user = ${response.group._id}-${memberId}]`).find(`.normal-members`).append(data.newMember);
      increaseMemberAmount(response.group._id , memberId);
      addContactWithMemberFromGroup();
      removeRequestContactWithMemberFromGroup();
      approveRequestContactOfMemberFromGroup() ;
      chatFromGroup() ;
      removeMemberOutOfGroup();
      authorizeAsAdmin();
      socket.emit("check-status");
     
     })
    })
  })
});