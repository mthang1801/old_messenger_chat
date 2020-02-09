import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let newGroupChat = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("new-group-created" , data => {
    
      clients = pushSocketIdToArray(clients , data.newGroup._id , socket.id );
      
      data.newGroup.members.forEach( member => {       
        if(clients[member.userId] && member.userId != socket.request.user._id ){
          let response = {
            newGroup : data.newGroup ,
            memberId : member.userId 
          }
          emitNotifyToArray(clients , member.userId , io , "response-new-group-created" , response );
        }
      })
    });
    
    socket.on("member-received-group-chat" , data => {
      clients = pushSocketIdToArray(clients , data.groupChatId , socket.id );
     
    })

    socket.on("check-status" , ()=>{
      let usersIdOnline = Object.keys(clients) ;
      
      socket.emit("server-send-list-users-online" , usersIdOnline);
      
      socket.broadcast.emit("server-send-user-currently-online" , socket.request.user._id ) ; 
  
    })
    
    socket.on("disconnect" ,  ()=>{
      clients= removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    })
  })
}

module.exports = newGroupChat ;