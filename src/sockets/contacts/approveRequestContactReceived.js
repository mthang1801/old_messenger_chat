import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketioHelper"
let approveRequestContactReceived = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id ; 
    clients = pushSocketIdToArray(clients , currentUserId , socket.id);
    
    socket.on("approve-request-contact-received" , (data) => {
      let currentUser = {
        id: currentUserId , 
        username : socket.request.user.username , 
        address : socket.request.user.address ? socket.request.user.address : "" ,
        avatar : socket.request.user.avatar, 
      }
      let response = {
        user : currentUser , 
        contact : data.contactInfor 
      }
      if(clients[data.contactId]){
      emitNotifyToArray(clients , data.contactId , io , "response-approve-request-contact-received" , response);
      }
    })

    socket.on("disconnect" , () => {
      clients = removeSocketIdFromArray(clients , currentUserId , socket.id);
    })
  })
}
module.exports = approveRequestContactReceived;