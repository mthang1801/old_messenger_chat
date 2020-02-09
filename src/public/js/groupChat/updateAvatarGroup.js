let originalAvatar; 
let originalGroupProfile = null ; 
let avatarGroup = null ; 
let groupProfile = {} ;
function updateAvatarGroup(){
  $(".input-avatar-group").off("change").on("change" , function(){
    let targetId = $(this).data("img-id");
    let groupId = $(this).data("group-uid");
    let fileData = $(this).prop("files")[0];
    let fileMatch = ["image/jpg" , "image/png" , "image/jpeg"] ; 
    let limitSize = 1048576 ; 
    if($.inArray(fileData.type, fileMatch ) == -1){
      alertify.notify("Kiểu file không phù hợp, file phải có dạng .png, .jpeg hoặc .jpg" , "error" , 7);
      $(this).val("");
      return false ;
    }
    if( fileData.size >limitSize ){
      alertify.notify("Kích thước file quá lớn, vui lòng chọn file khác nhỏ hơn 1MB" , "error" , 7)  ; 
      $(this).val("");
      return false ;
    }
    
    if( typeof (FileReader) != undefined ){
    let filePreview = $(`#${targetId}`) ; 
    filePreview.empty();
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      $("<img>" , {
        "src" : event.target.result , 
        "class" : "avatar-group img-circle", 
        "id" : `img-avatar-group-${targetId}`,
        "alt" : "avatar"
      }).appendTo(filePreview);
    };

    fileReader.readAsDataURL(fileData);
    let formData = new FormData() ; 
    formData.append("avatar-group", fileData); 

    avatarGroup = formData ; 
    }else{
      alertify.notify("Trình duyệt của bạn hiện không hỗ trợ chức năng cập nhật hình ảnh mới, vui lòng cập nhật hoặc thay đổi trình duyệt khác" , "error" , 7);
      $(this).val("");
      return false ;
    }
  })
};

function changeGroupName(){
  $(".edit-group").off("click").on("click" ,  function(){
    let groupNameUID = $(this).data("group-name");
    let groupId = groupNameUID.split("-")[2];
    let lastTimeUpdatedGroup = 0 ;
    //request server to check last updated 
    let promise = new Promise ( (resolve , reject ) => {
      $.get(`/group-chat/check-last-update-group-profie?groupId=${groupId}` , function(data){
        lastTimeUpdatedGroup = data.group.updatedGroup ;    
        resolve(true) ; 
      })
    })
    promise.then( success => {
      let leftTimeToChange = 24 - ( Date.now() - lastTimeUpdatedGroup) / (1000 * 3600) ;
      let hour = parseInt(leftTimeToChange);
      let mins =(leftTimeToChange % hour) * 60 ;
      let secs =  parseInt(( mins %  parseInt(mins)) * 60) ;
         
      if( leftTimeToChange <= 0 ){
        $(`#${groupNameUID}`).prop("disabled" , false);
        $(`#${groupNameUID}`).on("change" , function(){      
          groupProfile.name = $(this).val();
        })
      }else{
        $(`#${groupNameUID}`).prop("disabled" , true ) ;
        alertify.notify(`Hiện tại không thể thay đổi tên nhóm, vui lòng chờ trong: ${hour}h ${parseInt(mins)}ph ${secs}s` , "error" , 10);
      }
    })

  })
};

function callUpdateAvatarGroup(groupId){
  $.ajax({
    type : "put" , 
    url : `/group-chat/update-avatar-group?groupId=${groupId}` , 
    data : avatarGroup , 
    contentType: false ,
    cache : false , 
    processData : false ,
    success : function (data ){
      console.log(data);
      if(data.success){
        //change avatar at leftside
        $(`li.person[data-chat = ${groupId}]`).find("div.left-avatar img").attr("src" , `images/users/${data.group.avatar}`)
        //change avatar at rightside
        $(`#right-avatar-group-${groupId}`).attr("src" , `images/users/${data.group.avatar}`);
        originalGroupProfile.avatar = data.group.avatar ;
        let dataToEmit = {
          group : data.group
        }
        socket.emit("update-avatar-group" , dataToEmit) ;
      }
    },
    error : function( response ){
      console.log(response.responseText)
    }
  })
}

function callUpdateProfileGroup(groupId){
  $.ajax({
    type : "put" , 
    url : `/group-chat/update-name-group?groupId=${groupId}` , 
    data : groupProfile , 
    success : function (data ){
      console.log(data);
      if(data.success){
        let groupName = data.group.name ;
        if(groupName.length > 15) {
          groupName.substr(0,14) + "...";
        }
        //change name at leftside
        $(`li.person[data-chat = ${groupId}]`).find(".group-chat-name").html(`${groupName}`);
        //change name at rightside
        $(`#screen-chat`).find(`div.right[data-chat=${groupId}] .name`).html(`${groupName}`);
        //change name at top
        $(`#avatar-group-${groupId}`).find(".modal-title").html(`${data.group.name}`);
        $(`#group-updated-time-${groupId}`).val(Date(data.group.updatedGroup));
        originalGroupProfile.name = data.group.name;
        let dataToEmit = {
          group : data.group
        }
        socket.emit("update-name-group" , dataToEmit );
      }
    },
    error : function( response ){
      console.log(response.responseText)
    }
  })
}

function updateProfileGroup(){
  $(".btn-update-group").off("click").on("click", function(){ 
    let groupId = $(this).data("group-uid");
    let groupName = $(`#name-group-${groupId}`).val();
    Swal.fire({
      type : "warning",
      title : `Bạn chắc chắn muốn cập nhật thông tin cho nhóm &nbsp;<strong style="color:#12CBC4">${groupName}</strong>&nbsp;`,
      html : `<h4 style="font-weight:bold">Sau khi cập nhật bạn sẽ không thể thay đổi tên nhóm trong vòng 24 giờ tới, <strong style="color:#2ecc71">nhưng hình đại diện bạn vẫn có thể thay đổi<strong></h4>`,

      showConfirmButton: true, 
      showCancelButton : true ,
      confirmButtonText : "Chắc chắn" , 
      cancelButtonText : "Xem lại" ,
      confirmButtonColor: "#2ecc71" , 
      cancelButtonColor: "#e74c3c" , 
      width : "66rem" 
    }).then( result => {
      if(!result.value){
        return false ;
      }
      if($.isEmptyObject(groupProfile) && !avatarGroup){
        alertify.notify("Cập nhật thất bại", "error" , 7) ;
        return false ;
      }
      if(avatarGroup){
        callUpdateAvatarGroup(groupId) ;
      }
      if(!$.isEmptyObject(groupProfile)){
        if(groupProfile.name.length >= 3 && groupProfile.name.length <= 24){
        callUpdateProfileGroup(groupId);
        }else{
          alertify.notify("Tên nhóm không hợp lệ, cần có ít nhất 3 ký tự và nhiều nhất là 24, không chứa ký tự đậc biệt" , "error" , 7);
          $(`#name-group-${groupId}`).val(originalGroupProfile.name) ;
          return false ;
        }
      }
      let alertSuccess = `
      <div class="alert alert-success">
        <strong>Cập nhật thành công</strong>
      </div>
      `
      if($(`#avatar-group-${groupId}`).find(".alert-success")){
        $(`#avatar-group-${groupId}`).find(".alert-success").remove();
      }
      $(`#avatar-group-${groupId}`).find(".modal-body").prepend(alertSuccess);
      $(`#name-group-${groupId}`).prop("disabled" , true ) ;  
      $(".input-avatar-group").val("");
      
    });
  })
}

function cancelUpdateProfileGroup(){
  $(".btn-cancel-update-group").off("click").on("click" , function(){
    let groupId = $(this).data("group-uid");
    let filePreview =  $(`#input-update-avatar-group-${groupId}`);   
    filePreview.find("img").attr("src" , `images/users/${originalGroupProfile.avatar}`);
    $(".input-avatar-group").val("");
    $(`#name-group-${groupId}`).val(originalGroupProfile.name);
    $(`#name-group-${groupId}`).prop("disabled" , true ) ; 
    groupProfile.name = originalGroupProfile.name ;  
  })
}

function closeGroupModalAndResetAll(groupId){
  $(`#avatar-group-${groupId}`).on("hidden.bs.modal" , function(){ 
    let filePreview =  $(`#input-update-avatar-group-${groupId}`);   
    filePreview.find("img").attr("src" , `images/users/${originalGroupProfile.avatar}`);
    $(".input-avatar-group").val("");
    $(`#name-group-${groupId}`).val(originalGroupProfile.name);
    $(`#name-group-${groupId}`).prop("disabled" , true ) ;  
    groupProfile.name = originalGroupProfile.name ;  
  })
}

function openGroupModalAndEditingGroup(){
  $(".avatar-group").off("click").on("click" , function(){
    let groupId =  $(this).data("group-uid");
    $(`#avatar-group-${groupId}`).find("alert-success").remove();
    let avatarGroupURL =  $(`#input-update-avatar-group-${groupId}`).find("img").attr("src") ;
    console.log(avatarGroupURL);
    let avatarGroup = avatarGroupURL.split("/");
    let avatar = avatarGroup[avatarGroup.length - 1];
    originalGroupProfile = {
      avatar : avatar ,
      name : $(`#name-group-${groupId}`).val()
    }    
    updateAvatarGroup();
    changeGroupName();
    updateProfileGroup();
    cancelUpdateProfileGroup();
    closeGroupModalAndResetAll(groupId);
  })
}
$(document).ready(function () {
  openGroupModalAndEditingGroup();

  socket.on("response-update-avatar-group" , response => {
    $(`li.person[data-chat = ${response.group._id}]`).find("div.left-avatar img").attr("src" , `images/users/${response.group.avatar}`);
  });

  socket.on("response-update-name-group" , response => {
     //change name at leftside
     $(`li.person[data-chat = ${response.group._id}]`).find(".group-chat-name").html(`${response.group.name}`);
     //change name at rightside
     $(`#screen-chat`).find(`div.right[data-chat=${response.group._id}] .name`).html(`${response.group.name}`);
  })
});