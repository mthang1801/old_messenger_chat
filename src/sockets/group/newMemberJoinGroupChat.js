import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let newMemberJoinGroup = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("new-member-join-group" , data => {
      let currentUser = {
        id : socket.request.user._id ,
        username : socket.request.user.username , 
        avatar : socket.request.user.avatar
      }
      let response = {
        member : data.memberInfor , 
        group : data.groupInfor ,
        user : currentUser 
      }
      data.groupInfor.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id && member.userId != data.memberInfor._id ){
          emitNotifyToArray(clients , member.userId , io , "response-new-member-join-group" , response) ;
        }
      })
    });
    
    socket.on("member-received-group-chat" , data => {
      clients = pushSocketIdToArray(clients , data.groupChatId , socket.id );
    })

    socket.on("disconnect" ,  ()=>{
      clients= removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    })
  })
}

module.exports = newMemberJoinGroup ;