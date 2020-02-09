import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketioHelper" ;

let userOnlineOffline = (io) => {
  let clients = {} ;
  io.on("connection" , socket => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id) ; 
    socket.request.user.chatGroups.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id );
    })

    socket.on("check-status" , ()=>{
      let usersIdOnline = Object.keys(clients) ;
      
      socket.emit("server-send-list-users-online" , usersIdOnline);
      
      socket.broadcast.emit("server-send-user-currently-online" , socket.request.user._id ) ; 
  
    } )
    

    socket.on("disconnect" , () =>{
      clients = removeSocketIdFromArray(clients , socket.request.user._id , socket.id) ;
      socket.request.user.chatGroups.forEach ( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })

      socket.broadcast.emit("server-send-user-currently-offline" ,  socket.request.user._id )
    })
  })
}

module.exports = userOnlineOffline ;