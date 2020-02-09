import {pushSocketIdToArray, emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketioHelper"
let removeRequestContact = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients , currentUserId , socket.id);

    socket.on("remove-request-contact" , (data) => {
      
      let userItem = {
        id : currentUserId
      }
      if(clients[data.contactId]){
     emitNotifyToArray(clients , data.contactId , io , "response-remove-request-contact" , userItem);
      }
    })

    socket.on("disconnect" , () => {
     clients = removeSocketIdFromArray(clients, currentUserId , socket.id);
    })
    
  })
}


module.exports = removeRequestContact;