import mongoose from "mongoose" ;
import {app} from "./../config/common"
let Schema = mongoose.Schema  ;

let chatGroupSchema = new Schema({
  name : String ,
  userAmount : {type : Number , min: 3 } ,
  messageAmount : {type : Number , default : 0} , 
  userId : String , 
  administrators : [ {userId : String }] ,
  members : [ {userId : String }] ,
  avatar : {type : String , default : app.default_avatar_group},
  createdAt : {type : Number , default : Date.now} ,
  updatedAt : {type : Number , default : Date.now } ,
  deletedAt : {type : Number , default : null } ,
  updatedGroup : {type : Number , default : null }
})

chatGroupSchema.statics =  {
  createNew(item){
    return this.create(item);
  },
  getGroupsConversation(userId , limit){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}} 
    }).sort({"updatedAt" : -1}).limit(limit).exec();
  },
  getGroupInfor(groupId){
    return this.findById(groupId).exec();
  },
  updateTimeWhenHasNewMessage(groupId , messageAmount){
    return this.findByIdAndUpdate(groupId , {"updatedAt" : Date.now() , "messageAmount" : messageAmount } ).exec();
  },
  findGroupChatByUserId(userId){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}}
    }, {_id : 1}).exec();
  },
  getMoreGroups(userId , skipGroup , limit){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}} 
    }).sort({"updatedAt" : -1 }).skip(skipGroup).limit(limit).exec() ;
  },
  findAllInforGroupsChatByUserId(userId){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}}
    }).exec();
  },
  checkIsAdmin(userId , groupId){
    return this.find({
      $and : [
        {"_id" : groupId} , 
        {"administrators" : {$elemMatch : {"userId" : userId}}}
      ]
    }).exec();
  },
  checkIsHost(userId , groupId ){
    return this.find({
      $and : [
        {"_id" : groupId} , 
        {"userId" : userId}
      ]
    }).exec();
  },
  findGroupAndCheckAdmin(userId){
    return this.find({
      "administrators" : {$elemMatch : {"userId" : userId}}
    }, {_id: 1}).exec();
  },
  findGroupAndCheckHostGroup(userId){
    return this.find({"userId" : userId} , {_id : 1 }).exec();
  },
  getMembersId(groupId){
    return this.find({"_id" : groupId}, {members : 1 , _id : 0}).exec();
  },
  pushNewUserIntoGroup(targetId , groupId  ){
    return this.update({"_id" : groupId} , {$push : {"members" : {"userId" : targetId}}}).exec();
  },
  getAdminsId(groupId){
    return this.findById(groupId, { _id : 0 , administrators : 1}).exec();
  },
  getHostId(groupId){
    return this.find({"_id" : groupId}, {_id : 0 , userId : 1}).exec();
  },
  updateMemberAsAdmin(memberId , groupId){
    return this.update( {"_id" : groupId } , {$push : {"administrators": {"userId" : memberId}}}).exec();
  },
  removeAdminOutOfGroup(memberId , groupId){
    return this.update(
      {"_id" : groupId} ,
      { $pull : { "administrators" :{"userId" : memberId} , "members" : {"userId" : memberId}}}).exec();
  },
  removeMemberOutOfGroup(memberId , groupId){
    return this.update(
      {"_id" : groupId} ,
      { $pull : { "members" :{ "userId" : memberId} }}).exec();
  },
  removeUserOutOfData(userId , groupId ){
    return this.update(
      {"_id" : groupId } ,
      { $pull : {"members" : {"userId" : userId} , "administrators" : {"userId" : userId}}} 
    ).exec();
  },
  removeAdminAuthorization(memberId , groupId){
    return this.findByIdAndUpdate(groupId , { $pull : {"administrators" : {"userId" : memberId } }});
  },
  updateAvatarGroup(fileName , groupId){
    return this.findByIdAndUpdate(groupId , 
      {"avatar" : fileName }).exec();
  },
  updateNameGroup(groupName , groupId){
    return this.findByIdAndUpdate(groupId, 
      {"name" : groupName , "updatedGroup" : Date.now()}).exec() ;
  }
  
}
module.exports = mongoose.model("chat-group" , chatGroupSchema)
