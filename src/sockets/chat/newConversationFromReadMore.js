import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let newConversationFromReadMore = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("have-new-conversation-from-read-more" , data => {
      if(data.groupId){
        let response = {
          currentUserId : socket.request.user._id  ,
          groupId : data.groupId , 
          message : data.message 
        }
        if(clients[data.groupId]){
          emitNotifyToArray(clients , data.groupId , io , "response-have-new-conversation-from-read-more" , response ) ;
        }
      }
      if(data.contactId){
        let response = {
          currentUserId : socket.request.user._id ,
          message : data.message
        }
        if(clients[data.contactId]){
          emitNotifyToArray(clients , data.contactId , io , "response-have-new-conversation-from-read-more" , response ) ;
        }
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

module.exports = newConversationFromReadMore ;