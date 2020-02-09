

function removeContact(){
  $(".user-remove-contact").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let username = $(this).parents("li").find(`div.user-name`).text();
    
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} ra khỏi danh sách bạn bè của mình?`,
      text: "Nếu đồng ý bạn sẽ không thể hoàn tác quá trình này!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ACC77',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Đồng ý',
      cancelButtonText : 'Hủy bỏ'
    }).then((result) => {
      if (!result.value) {
       return false ;
      }
      $.ajax({
        type: "put" , 
        url : "/contact/remove-contact" ,
        data : {uid : targetId} , 
        success : function(response){
          if(response.success){
            $("#contacts").find(`li[data-uid = ${targetId}]`).remove();
            $(`div.groupPanel[data-uid = ${targetId}]`).find(".member-talk").remove();
            $(`div.groupPanel[data-uid = ${targetId}]`).find(".btn-box").append(`
            <div class="member-request-contact-sent" data-uid="${targetId}" >
                <span>
                    Kết bạn
                </span>
            </div>`);
            decreaseNotificationContact("count-contacts");

            //check active
            let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active"); 

            $("#all-chat").find(`ul a[href='#uid_${targetId}']`).remove();
            $("#user-chat").find(`ul a[href='#uid_${targetId}']`).remove();
  
            $("#screen-chat").find(`#to_${targetId}`).remove(); 
            $("body").find(`#imagesModal_${targetId}`).remove();
            $("body").find(`#attachsModal_${targetId}`).remove();

            if(checkActive){
              $("ul.people").find("a")[0].click();
            }
            
            socket.emit("remove-contact" , {contactId : targetId}) ;

            addContactWithMemberFromGroup();
            addContact();
          }
        }
      })
    })  
    
  })
}

socket.on("response-remove-contact" , (user) => {
  $("#contacts").find(`li[data-uid = ${user.id}]`).remove();

  $(`div.groupPanel[data-uid = ${user.id}]`).find(".member-talk").remove();
  $(`div.groupPanel[data-uid = ${user.id}]`).find(".btn-box").append(`
  <div class="member-request-contact-sent" data-uid="${user.id}" >
      <span>
          Kết bạn
      </span>
  </div>`);
  let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active"); 
 
  $("#all-chat").find(`ul a[href='#uid_${user.id}']`).remove();
  $("#user-chat").find(`ul a[href='#uid_${user.id}']`).remove();

  $("#screen-chat").find(`#to_${user.id}`).remove(); 
  $("body").find(`#imagesModal_${user.id}`).remove();
  $("body").find(`#attachsModal_${user.id}`).remove();

  decreaseNotificationContact("count-contacts");
  if(checkActive){
    $("ul.people").find("a")[0].click();
  }
  addContactWithMemberFromGroup();
  addContact();
})

$(document).ready(function () {
  removeContact();
});