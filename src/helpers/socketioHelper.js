export const pushSocketIdToArray = (clients , userId , socketId) => {
  if(clients[userId]){
    clients[userId].push(socketId) ;
  }else{
    clients[userId] = [socketId];
  }
  return clients; 
}

export const emitNotifyToArray = (clients ,userId, io , nameEvent , data) => {
  clients[userId].forEach( socketId => io.sockets.connected[socketId].emit(nameEvent , data));
}

export const removeSocketIdFromArray = (clients , userId , socketID) => {
  clients[userId] = clients[userId].filter(socketItem => socketItem != socketID) ;
  if(!clients[userId].length){
    delete clients[userId];
  }
  return clients;
}