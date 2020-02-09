socket.emit("check-status");

socket.on("server-send-list-users-online" , usersIdOnline => {
  usersIdOnline.forEach( userId => {
    $(`.person[data-chat =${userId}]`).find("div.dot").addClass("online") ;
    $(`.person[data-chat =${userId}]`).find("img").addClass("avatar-online");
    $(`.member[data-chat =${userId}]`).find("div.member-dot").addClass("online");
    $(`.member[data-chat =${userId}]`).find("img").addClass("avatar-online");
    $(`.person-navbar[data-chat =${userId}]`).find("div.dot-navbar").addClass("online") ;
    $(`.person-navbar[data-chat =${userId}]`).find("img").addClass("avatar-online");
  })
})

socket.on("server-send-user-currently-online" , userId => {
  $(`.person[data-chat =${userId}]`).find("div.dot").addClass("online") ;
  $(`.person[data-chat =${userId}]`).find("img").addClass("avatar-online");
  $(`.member[data-chat =${userId}]`).find("div.member-dot").addClass("online");
  $(`.member[data-chat =${userId}]`).find("img").addClass("avatar-online");
  $(`.person-navbar[data-chat =${userId}]`).find("div.dot-navbar").addClass("online") ;
  $(`.person-navbar[data-chat =${userId}]`).find("img").addClass("avatar-online");
})

socket.on("server-send-user-currently-offline" , userId => {
  $(`.person[data-chat =${userId}]`).find("div.dot").removeClass("online") ;
  $(`.person[data-chat =${userId}]`).find("img").removeClass("avatar-online");
  $(`.member[data-chat =${userId}]`).find("div.member-dot").removeClass("online");
  $(`.member[data-chat =${userId}]`).find("img").removeClass("avatar-online");
  $(`.person-navbar[data-chat =${userId}]`).find("div.dot-navbar").removeClass("online") ;
  $(`.person-navbar[data-chat =${userId}]`).find("img").removeClass("avatar-online");
}) 