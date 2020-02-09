import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketioHelper" ;

let chatImage = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id );
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })


    socket.on("new-group-created" , data => {
      clients = pushSocketIdToArray(clients , data.newGroup._id , socket.id);
    })

    socket.on("member-received-group-chat" , data => {
      clients = pushSocketIdToArray(clients , data.groupChatId , socket.id );
    })
  
    socket.on("user-chat-image" ,  data => {
      
      if(data.groupId){
        let response = {
          currentUserId : socket.request.user._id , 
          groupId : data.groupId ,
          message : data.message 
        }
        if(clients[data.groupId]){
          emitNotifyToArray(clients , data.groupId  ,io , "response-user-chat-image" , response) ;
        }
      }
      if(data.contactId){
        let response = {
          currentUserId : socket.request.user._id  ,
          message : data.message 
        }
        if(clients[data.contactId]){
          emitNotifyToArray(clients , data.contactId , io , "response-user-chat-image" , response) ;
        }
      }
    })

    socket.on("disconnect" , ()=> {
      clients = removeSocketIdFromArray(clients , socket.request.user._id , socket.id ) ; 
      socket.request.user.chatGroups.forEach( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id ) ;
      })
    })
  })
}

module.exports = chatImage ; 