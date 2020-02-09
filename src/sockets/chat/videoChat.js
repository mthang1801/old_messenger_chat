import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketioHelper";

let videoChat = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    clients = pushSocketIdToArray(clients , socket.request.user._id , socket.id ) ; 


    socket.on("new-group-created" , data => {
      clients = pushSocketIdToArray(clients , data.newGroup._id , socket.id);
    })

    socket.on("member-received-group-chat" , data => {
      clients = pushSocketIdToArray(clients , data.groupChatId , socket.id );
    })
    
    socket.on("caller-request-check-listener-is-online", data => {
      let response = {
        callerName : socket.request.user.username , 
        callerId : socket.request.user._id , 
        listenerId : data.listenerId
      }
      if(clients[data.listenerId]){
        emitNotifyToArray( clients , data.listenerId , io , "server-send-listener-is-online" , response ) ;
      }else{
        socket.emit("server-send-listener-is-offline");
      }
    });

    socket.on("listener-send-peerId-to-server" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.callerId]){
        emitNotifyToArray(clients , data.callerId , io , "server-send-peerId-to-caller" , response);
      }
      
    });

    socket.on("caller-request-call-to-server" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.listenerId]){
        emitNotifyToArray(clients , data.listenerId , io , "server-send-caller-request-call-to-listener" , response  );
      }
    })

    socket.on("caller-cancel-request-call" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.listenerId]){
        emitNotifyToArray(clients , data.listenerId , io , "server-send-caller-cancel-request-call" , response ) ; 
      }
    })

    socket.on("listener-reject-call-to-server" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.callerId]){
        emitNotifyToArray(clients , data.callerId , io , "server-send-listener-reject-call" , response) ;
      }
    })

    socket.on("listerner-accept-call-to-server" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.callerId]){
        emitNotifyToArray(clients , data.callerId , io , "server-send-accept-call-to-caller" , response ) ; 
      }
      if(clients[data.listenerId]){
        emitNotifyToArray(clients , data.listenerId , io , "server-send-accept-call-to-listener" , response ) ; 
      }
    })

    socket.on("caller-end-call" , data => {
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.listenerId]){
        emitNotifyToArray(clients , data.listenerId , io , "server-send-caller-end-call" , response);
      }
    })

    socket.on("listener-end-call"  , data=>{
      let response = {
        callerName : data.callerName , 
        callerId :  data.callerId , 
        listenerId : data.listenerId , 
        listenerName : data.listenerName, 
        listenerPeerId : data.listenerPeerId
      }
      if(clients[data.callerId]){
        emitNotifyToArray(clients , data.callerId , io , "server-send-listener-end-call" , response );
      }
    })
    socket.on("disconnect" ,  () => {
      clients = removeSocketIdFromArray(clients , socket.request.user._id , socket.id );
    })
  })
}

module.exports = videoChat ; 