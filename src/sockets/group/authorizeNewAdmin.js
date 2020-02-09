import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray } from "./../../helpers/socketioHelper";

let authorizeNewAdmin = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("authorize-new-admin-in-group" , data => {
     let response = {
       group : data.group,
       newAdmin : data.newAdmin
     }
     if(clients[data.newAdmin._id]){
       emitNotifyToArray(clients , data.newAdmin._id, io , "response-authorize-new-admin-in-group" , response );
     }
    });

    socket.on("show-others-member-new-admin" , data=> {
      let response = {
        group : data.group ,
        newAdmin : data.newAdmin 
      }

      data.group.members.forEach ( member => {
       if(clients[member.userId] && member.userId != socket.request.user._id && member.userId != data.newAdmin._id ){
         emitNotifyToArray(clients , member.userId , io , "response-show-others-member-new-admin" , response);
       }
      })
    });

    socket.on("disconnect" ,  ()=>{
      clients= removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    })
  })
}

module.exports = authorizeNewAdmin ;