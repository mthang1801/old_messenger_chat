import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let removeMemberOutOfGroup = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("remove-member-out-of-group" , data => {
      let response = {
        memberId : data.memberId , 
        group : data.group ,
        position : data.position
      }
      if(clients[data.memberId]){
        emitNotifyToArray(clients , data.memberId , io , "response-remove-member-out-of-group" , response );
      }
    })

    
    socket.on("show-to-the-others-member-out-of-group" , data => {
      let response = {
        memberId : data.memberId , 
        group : data.group ,
        position : data.position
      }
      data.group.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id  && member.userId != data.memberId){
          emitNotifyToArray(clients , member.userId , io , "response-show-to-the-others-member-out-of-group" , response );
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

module.exports = removeMemberOutOfGroup ;