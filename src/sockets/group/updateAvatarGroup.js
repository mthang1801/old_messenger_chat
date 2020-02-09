import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let updateAvatarGroup = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("update-avatar-group" , data => {
      
      let response = {
        group : data.group 
      }
      data.group.members.forEach( member => {
        if(clients[member.userId]){
          emitNotifyToArray(clients , member.userId , io , "response-update-avatar-group" , response );
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

module.exports = updateAvatarGroup ;