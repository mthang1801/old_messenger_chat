function cancelGroupChat(){
  $("#btn-cancel-group-chat").off("click").on("click" ,  function(){
    let promise = new Promise ( (resolve , reject ) => {
      $("#input-name-group-chat").val("");
      let usersHTML = $("ul#friends-added").html() ; 
      $("ul#friends-added").html("");
      $("ul#group-chat-friends").prepend(usersHTML) ; 
      $("#group-chat-friends").find("li").each( (index ,  value) => {
        let targetId = $(value).find(".remove-user").data("uid") ; 
        $("#group-chat-friends").find(`.remove-user[data-uid = ${targetId}]`).remove() ;
        $("#group-chat-friends").find(`li[data-uid=${targetId}]`).append(`<div class="add-user" data-uid=${targetId}>Thêm vào nhóm</div>`);
      })
      resolve(true ) ;
    })
   
    promise.then( success => {
      $("#groupChatModal .list-user-added").hide();
    })
    addFriendsIntoGroup();
  })
}

function createGroupChat(){
  $("#btn-create-group-chat").off("click").on("click" , function(){
    let groupName = $("#input-name-group-chat").val() ; 
    let userId = $("#dropdown-navbar-user").data("uid");
    if(groupName.length < 3){
      alertify.notify("Tên nhóm phải có ít nhất 3 ký tự" , "error" , 6) ; 
      $("#name-group-chat").val("") ;
      return false ; 
    }

    let groupNameRegExp = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!groupNameRegExp.test(groupName)){
      alertify.notify("Tên nhóm không được chứa ký tự đặc biệt" , "error" , 6);
      $("#name-group-chat").val("") ;
      return false ;
    }
    
    let numberMembers = $("#friends-added").find("li").length ; 
    if(numberMembers.length < 2 ){
      alertify.notify("Để tạo nhóm cần có ít nhất 3 thành viên" , "error" , 6) ; 
      return false ;
    }
    let members = [] ; 
     $("#friends-added").find("li").each( (index , item) => {
      members.push({"userId" : $(item).data("uid")}) ;
    })
    Swal.fire({
      type : "info" , 
      title : `Bạn có chắc chắn muốn tạo nhóm &nbsp; <span style="color:#d43f3a">${groupName}</span>` ,
      backdrop : "rgba(85,85,85,0.4)" ,
      width : "60rem",
      allowOutsideClick : false  ,
      showConfirmButton : true , 
      confirmButtonText : "Đồng ý" , 
      showCancelButton : true ,
      cancelButtonColor : "#d9534f",
      cancelButtonText : "Trở về" 
    }).then( result => {
      if(!result.value){
        return false ;
      }
        $.post("/group-chat/create-new-group-chat" , 
          { groupName : groupName ,
            members : members 
          },
          function(data){
            console.log(data) ; 
            //step01 : close Modal 
            $("#input-search-friend-to-add-group-chat").val("");
            $("#btn-cancel-group-chat").click() ;
            $("#groupChatModal").modal("hide") ;
            //step02 : add leftSide template 
            let subGroupChatName = data.newGroup.name ; 
            if(subGroupChatName.length > 15 ){
              subGroupChatName = subGroupChatName.substr(0,12) + "..." 
            }
            let leftSideData = `
              <a href="#uid_${data.newGroup._id}" class="room-chat" data-target="#to_${data.newGroup._id}">
                <li class="person group-chat" data-chat="${data.newGroup._id}">
                    <div class="left-avatar">
                        <img src="/images/users/${data.newGroup.avatar}" alt="">
                    </div>
                    <span class="name">
                        <span class="group-chat-name">
                            ${subGroupChatName} 
                        </span>
                    </span>

                    <span class="time"> </span>
                    <span class="preview  convert-emoji"></span>
                </li>
              </a>  
            `
            $("#all-chat").find("ul.people").prepend(leftSideData) ;
            $("#group-chat").find("ul.people").prepend(leftSideData) ;

            //Step03 : handle Rightside
            let subNameGroup = data.newGroup.name ; 
            if(subNameGroup.length > 15){
              subNameGroup = subNameGroup.substr(0,14) + "..."
            }
            let rightSideData = `
              <div class="right tab-pane" data-chat="${data.newGroup._id}" id="to_${data.newGroup._id}">
                <div class="top">
                    <span>To: <span class="name">${data.newGroup.name}</span></span>
                    <span class="chat-menu-right">
                        <a href="#attachsModal_${data.newGroup._id}" class="show-attachs" data-toggle="modal">
                            Tệp đính kèm
                            <i class="fa fa-paperclip"></i>
                        </a>
                    </span>
                    <span>
                        <a href="javascript:void(0)" style="text-decoration: none">&nbsp;</a>
                    </span>
                    <span>
                        <a href="#avatar-group-${data.newGroup._id}" data-toggle="modal" class="avatar-group" data-group-uid="${data.newGroup._id}">
                            <img src="images/users/${data.newGroup.avatar}" id="right-avatar-group-${data.newGroup._id}">
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#imagesModal_${data.newGroup._id}" class="show-images" data-toggle="modal">
                            Hình ảnh
                            <i class="fa fa-photo"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#membersGroupChat-${data.newGroup._id}" class="show-number-members" data-toggle="modal" data-user="${data.newGroup._id}-${userId}">
                            ${data.newGroup.members.length}
                            <i class="fa fa-users"></i>
                        </a>
                    </span>
                   
                    <span class="chat-menu-right">
                      <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#addMembers-${data.newGroup._id}" class="add-members" data-toggle="modal" >
                            Thêm thành viên
                            <i class="fa fa-plus"></i>
                        </a>
                    </span>
                      <span class="chat-menu-right">
                          <a href="javascript:void(0)">&nbsp;</a>
                      </span>
                      <span class="chat-menu-right">
                          <a href="javascript:void(0)" class="show-number-messages" data-toggle="modal">
                              ${data.newGroup.messageAmount}
                              <i class="fa fa-comments"></i>
                          </a>
                      </span>
                </div>
                <div class="content-chat">
                  <div class="chat convert-emoji" data-chat="${data.newGroup._id}"></div>
                </div>
                <div class="write" data-chat="${data.newGroup._id}">
                    <input type="text" class="write-chat chat-in-group" id="write-chat-${data.newGroup._id}" data-chat="${data.newGroup._id}">
                    <div class="icons">
                        <a href="#" class="icon-chat"  data-chat="${data.newGroup._id}"><i class="fa fa-smile-o"></i></a>
                        <label for="image-chat-${data.newGroup._id}" class="label-image-chat" >
                            <input type="file" class="image-chat chat-in-group" id="image-chat-${data.newGroup._id}" name="my-image-chat" data-chat="${data.newGroup._id}">
                            <i class="fa fa-photo"></i>
                        </label>
                        <label for="attach-chat-${data.newGroup._id}" class="label-attachment-chat">
                            <input type="file" id="attach-chat-${data.newGroup._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${data.newGroup._id}">
                            <i class="fa fa-paperclip"></i>
                        </label>
                        <a href="javascript:void(0)" id="video-chat-${data.newGroup._id}" class="chat-in-group">
                            <i class="fa fa-video-camera"></i>
                        </a>    
                    </div>
                </div>
              </div>
            `
           
            $("#screen-chat").prepend(rightSideData);

            //Step04: call function changeScreenChat
            changeScreenChat() ; 
           
            //Step05 : handle Image Modal 
            let imageModalData = `
            <div class="modal fade" id="imagesModal_${data.newGroup._id}" role="dialog">
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
            `

            $("body").append(imageModalData); 
             //Step06 : call function gridPhoto
            
           
             //Step07 : handle attachment modal

             let attachmentModalData = `
             <div class="modal fade" id="attachsModal_${data.newGroup._id}" role="dialog">
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
            $("body").append(attachmentModalData);

             //step08 : append Group Chat Modal
             
            $("body").append(data.avatarGroupModal);

            //step09:  append Add More Memer GroupChat Modal
            let addMoreMemberToGroupChatModal = `
            <div class="modal fade" id="addMembers-${data.newGroup._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Thêm thành viên vào nhóm ${data.newGroup.name}</h4>
                      </div>
                      <div class="modal-body">
                          <div class="col-md-5 col-sm-12 find-user-add-to-group">
                              <div class="row form-search-to-add">
                                  <div class="form-group">
                                      <input type="text" class="form-control input-search-more-friend-to-add-group-chat" id="input-search-friend-to-add-chat-group-${data.newGroup._id}" data-group-uid="${data.newGroup._id}" placeholder="Nhập E-mail hoặc username của bạn bè..." />
                                      <span class="btn-group-btn">
                                          <button class="btn btn-lg btn-search-more-friend-to-add-group-chat" type="button" data-group-uid="${data.newGroup._id}">
                                              <i class="glyphicon glyphicon-search"></i>
                                          </button>
                                      </span>
                                  </div>
                              </div>
                              <div class="row result-more-searched">
                                  <ul class="contactsList" data-group-uid="${data.newGroup._id}">
                                    
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
            `
            $("body").append(addMoreMemberToGroupChatModal);
            //search friend from new GroupChatModal
            $(".input-search-more-friend-to-add-group-chat").on("keypress" ,findFriendsAtGroupChatModalFromScreenChat);
            $(".btn-search-more-friend-to-add-group-chat").on("click" , findFriendsAtGroupChatModalFromScreenChat);
            
            //step 10: append members in Group Modal
            $("body").append(data.membersInGroupModal);

            //chat with member in group 
            chatFromGroup();
            //authorize member as admin
            authorizeAsAdmin();
            //remove member out of group
            removeMemberOutOfGroup();            
            
            socket.emit("new-group-created" , {newGroup : data.newGroup}) ;

            socket.emit("check-status");

            openGroupModalAndEditingGroup();
          }
        ).fail( error => {
          alertify.notify(error.responseText , "error" , 7);
        })
      });   
  })
}


$(document).ready(function () {
  createGroupChat();
  cancelGroupChat();

  socket.on("response-new-group-created" , response => {
    console.log(response);
    let subGroupChatName = response.newGroup.name ; 
    if(subGroupChatName.length > 15 ){
      subGroupChatName = subGroupChatName.substr(0,14) + "..." 
    }
    
    let leftSideData = `
              <a href="#uid_${response.newGroup._id}" class="room-chat" data-target="#to_${response.newGroup._id}">
                <li class="person group-chat" data-chat="${response.newGroup._id}">
                    <div class="left-avatar">
                        <img src="/images/users/${response.newGroup.avatar}" alt="">
                    </div>
                    <span class="name">
                        <span class="group-chat-name">
                            ${subGroupChatName} 
                        </span>
                    </span>

                    <span class="time"> </span>
                    <span class="preview  convert-emoji"></span>
                </li>
              </a>  
            `
            $("#all-chat").find("ul.people").prepend(leftSideData) ;
            $("#group-chat").find("ul.people").prepend(leftSideData) ;

            //Step03 : handle Rightside

            let rightSideData = `
              <div class="right tab-pane" data-chat="${response.newGroup._id}" id="to_${response.newGroup._id}">
                <div class="top">
                    <span>To: <span class="name">${response.newGroup.name}</span></span>
                    <span class="chat-menu-right">
                        <a href="#attachsModal_${response.newGroup._id}" class="show-attachs" data-toggle="modal">
                            Tệp đính kèm
                            <i class="fa fa-paperclip"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#imagesModal_${response.newGroup._id}" class="show-images" data-toggle="modal">
                            Hình ảnh
                            <i class="fa fa-photo"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#membersGroupChat-${response.newGroup._id}" class="show-number-members" data-toggle="modal" data-user="${response.newGroup._id}-${response.memberId}">
                            ${response.newGroup.members.length}
                            <i class="fa fa-users"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)" class="show-number-messages" data-toggle="modal">
                            ${response.newGroup.messageAmount}
                            <i class="fa fa-comments"></i>
                        </a>
                    </span>
                </div>
                <div class="content-chat">
                  <div class="chat convert-emoji" data-chat="${response.newGroup._id}"></div>
                </div>
                <div class="write" data-chat="${response.newGroup._id}">
                    <input type="text" class="write-chat chat-in-group" id="write-chat-${response.newGroup._id}" data-chat="${response.newGroup._id}">
                    <div class="icons">
                        <a href="#" class="icon-chat"  data-chat="${response.newGroup._id}"><i class="fa fa-smile-o"></i></a>
                        <label for="image-chat-${response.newGroup._id}" class="label-image-chat" >
                            <input type="file" class="image-chat chat-in-group" id="image-chat-${response.newGroup._id}" name="my-image-chat" data-chat="${response.newGroup._id}">
                            <i class="fa fa-photo"></i>
                        </label>
                        <label for="attach-chat-${response.newGroup._id}" class="label-attachment-chat">
                            <input type="file" id="attach-chat-${response.newGroup._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${response.newGroup._id}">
                            <i class="fa fa-paperclip"></i>
                        </label>
                        <a href="javascript:void(0)" id="video-chat-${response.newGroup._id}" class="chat-in-group">
                            <i class="fa fa-video-camera"></i>
                        </a>    
                    </div>
                </div>
              </div>
            `

            $("#screen-chat").prepend(rightSideData);

            //Step04: call function changeScreenChat
            changeScreenChat() ; 
            
            //Step05 : handle Image Modal 
            let imageModalData = `
            <div class="modal fade" id="imagesModal_${response.newGroup._id}" role="dialog">
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
            `

            $("body").prepend(imageModalData); 
             //Step06 : call function gridPhoto
             

             //Step07 : handle attachment modal

             let attachmentModalData = `
             <div class="modal fade" id="attachsModal_${response.newGroup._id}" role="dialog">
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
            $("body").prepend(attachmentModalData);
            
            // step08:  get Members in Group Chat Modal
            $.get(`/group-chat/get-members-in-group-chat-modal?memberId=${response.memberId}&groupId=${response.newGroup._id}` , function(data){
              $("body").append(data.membersGroupChatModal);

              chatFromGroup(); 
              addContactWithMemberFromGroup();
              removeRequestContactWithMemberFromGroup();
              leaveGroup();
             
              socket.emit("member-received-group-chat", {groupChatId : response.newGroup._id  });
              socket.emit("check-status");
            })
          
        })
});

