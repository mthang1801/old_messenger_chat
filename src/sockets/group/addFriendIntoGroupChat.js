import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let addFriendIntoGroupChat = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("add-friend-into-group-chat" , data => {
      let currentUser = {
        id : socket.request.user._id ,
        username : socket.request.user.username , 
        avatar : socket.request.user.avatar
      }
      let response = {
        memberId : data.contactId, 
        member : data.memberInfor , 
        group : data.groupInfor ,
        user : currentUser 
      }
      if(clients[data.contactId]){
        emitNotifyToArray(clients , data.contactId , io , "response-add-friend-into-group-chat" , response );
      }
    })


    socket.on("disconnect" ,  ()=>{
      clients= removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    })
  })
}

module.exports = addFriendIntoGroupChat ;