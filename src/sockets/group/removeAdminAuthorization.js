import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let removeAdminAuthorization = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("remove-admin-authorization" , data => {
      let response = {
        memberId : data.memberId , 
        group : data.group 
      }
      if(clients[data.memberId]){
        emitNotifyToArray(clients , data.memberId , io , "response-remove-admin-authorization" , response );
      }
      data.group.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id && member.userId != data.memberId){
          emitNotifyToArray(clients , member.userId , io , "response-remove-admin-authorization-to-others" , response );
        }
      })
    })
    
    socket.on("disconnect" ,  ()=>{
      clients= removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    })
  })
}

module.exports = removeAdminAuthorization ;