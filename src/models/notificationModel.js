import mongoose from "mongoose";
import { user } from "../services";

let Schema = mongoose.Schema; 

let notificationSchema = new Schema({
  senderId : String , 
  receiverId : String , 
  type : String , 
  isRead : {type : Boolean , default : false } ,
  createdAt : { type : Number , default : Date.now }
})

notificationSchema.statics = {
  createNewNotification(item){
    return this.create(item);
  },
  removeRequestNotificationContact(userId , contactId , type){
    return this.remove({
      $and : [
        {"senderId" : userId},
        {"receiverId" : contactId} ,
        {"type" : type }
      ]
    }).exec();
  },
  findNotificationRequestContact(userId , limit){
    return this.find({"receiverId" : userId}).sort({"createdAt" : -1}).limit(limit).exec();
  },
  countNotificationRequestContactUnread(userId){
    return this.count({
      $and : [
        {"receiverId" : userId} ,
        {"isRead" : false } 
      ]
    }).exec();
  },
  readMoreNotification(userId , skipNumber , limit){
    return this.find({"receiverId" : userId}).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },
  markNotificationAsRead( userId , targetUsers){
    return this.updateMany({
      $and :[
        {"receiverId" : userId}, 
        {"senderId" : {$in : targetUsers}}
      ]
    }, {"isRead" : true}).exec();
  },
  readStatus(userId , contactId , notifUID){
    return this.update({
      $and : [
        {"_id" : notifUID },
        {"senderId" : contactId} ,
        {"receiverId" : userId} ,
        {"isRead" : false }
      ]
    } , {"isRead" : true }).exec();
  },
  markAsRead(userId , contactId , type ){
    return this.updateOne({
      $and : [
        {"senderId" : contactId} , 
        {"receiverId" : userId} , 
        {"type" : type} ,
        {"isRead" : false }
      ]
    } , {"isRead" : true}).exec();
  },
  removeNotificationsRead(userId){
    return this.remove({
      $and : [
        {"receiverId" : userId} ,
        {"isRead" : true}
      ]
    }).exec();
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT : "add_contact" ,
  ACCEPT_CONTACT : "accept_contact"
}

const NOTIFICATION_CONTENTS = {
  getContent : (id , type , isRead , userId , userName , userAvatar) => {
    if(type == NOTIFICATION_TYPES.ADD_CONTACT){
      if(!isRead){
        if(userAvatar == "avatar-default.jpg"){
          return `<div class="notification-request-contact-unread add-contact" data-notif-uid="${id}" data-uid="${userId}">
                <img class="avatar-small" src="images/users/default/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
        }
        return `<div class="notification-request-contact-unread add-contact" data-notif-uid="${id}" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      }else {
        if(userAvatar == "avatar-default.jpg"){
          return `<div data-uid="${userId}" data-notif-uid="${id}" class="add-contact">
                <img class="avatar-small" src="images/users/default/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
        }
        return  `<div data-uid="${userId}" data-notif-uid="${id}" class="add-contact" >
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      }       
    }
    if(type == NOTIFICATION_TYPES.ACCEPT_CONTACT){
      if(!isRead){
        if(userAvatar == "avatar-default.jpg"){
          return `<div class="notification-request-contact-unread accept-contact" data-notif-uid="${id}" data-uid="${userId}">
                <img class="avatar-small" src="images/users/default/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
        }
        return `<div class="notification-request-contact-unread accept-contact" data-notif-uid="${id}" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
      }else {
        if(userAvatar == "avatar-default.jpg"){
          return `<div data-uid="${userId}" data-notif-uid="${id}" class="accept-contact">
                <img class="avatar-small" src="images/users/default/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
        }
        return  `<div data-uid="${userId}" data-notif-uid="${id}" class="accept-contact">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
      }       
    }
    return "No notification matching type of this notification";
  }
}

module.exports = {
  model : mongoose.model("notification" ,notificationSchema ) , 
  types : NOTIFICATION_TYPES ,
  contents : NOTIFICATION_CONTENTS 
}