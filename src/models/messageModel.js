import mongoose from "mongoose" ;

let Schema = mongoose.Schema ; 

let messageSchema = new Schema({
  senderId : String , 
  receiverId : String ,
  conversationType : String , 
  messageType : String , 
  sender : {
    id : String , 
    name : String , 
    avatar : String 
  },
  receiver : {
    id : String , 
    name : String , 
    avatar : String 
  },
  text : String , 
  file : {data : Buffer , contentType : String , fileName : String } ,
  createdAt : {type : Number , default : Date.now} ,
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null } 
})

messageSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  getMessagesInGroup(receiverId , limit){
    return this.find({"receiverId" : receiverId}).sort({"createdAt" : -1}).limit(limit).exec();
  },
  getMessagesInPrivate(senderId , receiverId , limit){
    return this.find({
      $or : [
        {$and : [
          {"senderId" : senderId} , 
          {"receiverId" : receiverId }
        ]},
        {$and : [
          {"senderId" : receiverId} , 
          {"receiverId": senderId} 
        ]}
      ]
    }).sort({"createdAt" : -1 }).limit(limit).exec();
  },
  getMoreMessagesInGroup(receiverId , skipMessages , limit ){
    return this.find({"receiverId" : receiverId}).sort({"createdAt" : -1}).skip(skipMessages).limit(limit).exec();
  },
  getMoreMessagesInPerson(senderId , receiverId , skipMessages , limit){
    return this.find({
      $or : [
        {$and : [
          {"senderId" : senderId } , 
          {"receiverId" : receiverId} 
        ]}, 
        {$and : [
          {"senderId" : receiverId } , 
          {"receiverId" : senderId}
        ]}
      ]
    }).sort({"createdAt" : -1 }).skip(skipMessages).limit(limit).exec();
  }
}

const MESSAGE_TYPES = {
  TEXT : "text" , 
  IMAGE : "image" , 
  FILE : "file" 
}

const MESSAGE_CONVERSATION_TYPES = {
  PRIVATE : "private" , 
  GROUP : "group"
}
module.exports = {
  model : mongoose.model("message" , messageSchema), 
  TYPES : MESSAGE_TYPES , 
  CONVERSATION_TYPES : MESSAGE_CONVERSATION_TYPES 
}
