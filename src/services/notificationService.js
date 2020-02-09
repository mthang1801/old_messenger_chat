import notificationModel from "./../models/notificationModel";
import userModel from "./../models/userModel"
import contactModel from "./../models/contactModel";
const NUMBER_LIMIT = 10;
let getNotification = (currentUserId) => {
  return new Promise ( async ( resolve ,  reject) => {
    try {
      let notifications = await notificationModel.model.findNotificationRequestContact(currentUserId , NUMBER_LIMIT);
      let getContents = notifications.map( async (notification) => {
        let senderInfo = await userModel.findUsersNormalById(notification.senderId);
        return notificationModel.contents.getContent(notification._id ,  notification.type , notification.isRead , senderInfo._id , senderInfo.username , senderInfo.avatar);
      }) 
      
      resolve(await Promise.all(getContents));
    } catch (error) {
      reject(error);
    }
  })
}

let countNotificationRequestContactUnread = (currentUserId) => {
  return new Promise( async (resolve , reject ) => {
    try {
      let NumOfReqContactUnread = await notificationModel.model.countNotificationRequestContactUnread(currentUserId);
      resolve(NumOfReqContactUnread);
    } catch (error) {
      reject(error);
    }
  })
}

let readMoreNotification = (currentUserId , skipNumber ) => {
  return new Promise( async (resolve , reject ) => {
    try {
      let getMoreNotifications = await notificationModel.model.readMoreNotification(currentUserId , skipNumber , NUMBER_LIMIT);
      let getContents = getMoreNotifications.map(async (notification) => {
        let senderInfo = await userModel.findUserById(notification.senderId);
        return notificationModel.contents.getContent(notification._id,  notification.type , notification.isRead , senderInfo._id , senderInfo.username , senderInfo.avatar);
      })
      resolve(await Promise.all(getContents));
    } catch (error) {
      reject(error);
    }
  })
}

let markNotificationAsRead = (currentUserId , targetUsers) => {
  return new Promise( async (resolve , reject ) => {
    try {
      let resultMarkNotif = await notificationModel.model.markNotificationAsRead(currentUserId , targetUsers);
      if(resultMarkNotif.nModified == 0){
        return reject(false);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}

let readStatus = (currentUserId , contactId , notifUID ) => {
  return new Promise (async (resolve ,  reject) => {
    try {
      
      let markAsRead = await notificationModel.model.readStatus(currentUserId , contactId , notifUID );
      if(markAsRead.nModified == 0){
        return reject(false );
      }
      let getUserContact = await userModel.findUsersNormalById(contactId);
      let data = {
        success : true , 
        user : getUserContact ,
        notifUID : notifUID
      }
    
      resolve(data);
    } catch (error) {
      reject(error);
    }
  })
}

let removeNotificationsRead = ( currentUserId , skipNumber) => {
  return new Promise( async (resolve , reject) => {
    try {
      let removeNotifs = await notificationModel.model.removeNotificationsRead(currentUserId);
      if(removeNotifs.result.n == 0 ){
        return reject(false);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}
module.exports = {
  getNotification : getNotification,
  countNotificationRequestContactUnread : countNotificationRequestContactUnread,
  readMoreNotification : readMoreNotification,
  markNotificationAsRead : markNotificationAsRead,
  readStatus : readStatus,
  removeNotificationsRead : removeNotificationsRead
}