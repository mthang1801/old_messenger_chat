import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import notificationModel from "./../models/notificationModel";
import _ from "lodash";


const LIMIT_NUMBER = 8; 
let findUsersConctact = (currentUserId , keyword)=>{
  return new Promise ( async (resolve , reject ) => {
   try {
    let deprecatedUsers = [currentUserId.toString()] ; 
    let usersContact = await contactModel.findUserIdContacts(currentUserId);
    if(usersContact.length){
      usersContact.forEach( contact => {
        deprecatedUsers.push(contact.userId) ; 
        deprecatedUsers.push(contact.contactId);
      })
    }
    deprecatedUsers = _.uniqBy(deprecatedUsers);
    let users = await userModel.findUsersContact(deprecatedUsers , keyword );
    resolve(users);
   } catch (error) {
     reject(error);
   }
  })
};

let addNewContact = (currentUserId , contactId) =>{
  return new Promise( async (resolve , reject ) => {
      let checkExists = await contactModel.checkContactExists(currentUserId , contactId);
      if(checkExists){
        return reject(false);
      }
     
      let userContactItem = {
        userId : currentUserId , 
        contactId : contactId 
      }

      let newContact = await contactModel.createNew(userContactItem) ;

      //create notification to contactId
      let notificationItem = {
        senderId : currentUserId , 
        receiverId : contactId , 
        type : notificationModel.types.ADD_CONTACT
      }
      let newNotification = await notificationModel.model.createNewNotification(notificationItem) ;
      
      resolve({
        success : true ,
        newNotification : newNotification
      });
  })
};

let removeRequestContact = (currentUserId , contactId) => {
  return new Promise(async (resolve , reject) => {
    try {
      let removeContact = await contactModel.removeRequestContact(currentUserId , contactId);
       if(removeContact.result.n == 0){
         return reject(false);
       }
       let contactType = notificationModel.types.ADD_CONTACT;
       let removeNotification = await notificationModel.model.removeRequestNotificationContact(currentUserId , contactId, contactType);
       resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

let getContactSent = (currentUserId) => {
  return new Promise( async (resolve , reject ) =>{
    try {
      let contactContents = await contactModel.getContactSent(currentUserId , LIMIT_NUMBER);
      let contactInfor = contactContents.map( async (contact) => {
        return await userModel.findUsersNormalById(contact.contactId); 
      })
      resolve(await Promise.all(contactInfor));
    } catch (error) {
      reject(error);
    }
  }) 
};

let countReqContactsSent = (currentUserId) => {
  return new Promise( async (resolve, reject ) =>{
    try {
      let countReq = await contactModel.countContactSent(currentUserId);
      resolve(countReq);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreRequestContactsSent = (currentUserId , skipNumber) => {
  return new Promise( async (resolve ,reject ) => {
    try {
      let contacts = await contactModel.readMoreRequestContactsSent(currentUserId , skipNumber , LIMIT_NUMBER ) ;
      let getUsersInfor = contacts.map( async contact => {
        return await userModel.findUsersNormalById(contact.contactId); 
      })
      resolve(await Promise.all(getUsersInfor));
    } catch (error) {
      reject(error);
    }
  })
};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contactsReceived = await contactModel.getContactsReceived(currentUserId,LIMIT_NUMBER );
      let getUsersInfor = contactsReceived.map( async (contact) => {
        return await userModel.findUsersNormalById(contact.userId);
      })
    
     resolve(await Promise.all(getUsersInfor));
    } catch (error) {
      reject(error);
    }
  })
};

let countReqContactsReceived = (currentUserId) => {
  return new Promise(async (resolve , reject) => {
    try {
      let countReqReceived = await contactModel.countContactsReceived(currentUserId);
      resolve(countReqReceived);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreRequestContactsReceived = (currentUserId , skipNumber) => {
  return new Promise( async (resolve , reject) => {
    try {
      let getContactContents = await contactModel.readMoreRequestContactsReceived(currentUserId , skipNumber , LIMIT_NUMBER);
      let getUsersInfor = getContactContents.map(async contact => {
        return userModel.findUsersNormalById(contact.userId);
      })

      resolve(await Promise.all(getUsersInfor));
    } catch (error) {
      reject(error);
    }
  })
};

let removeRequestContactsReceived = (currentUserId , targetId ) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      let removeContactReceived = await contactModel.removeRequestContactsReceived(currentUserId , targetId) ;
      if(removeContactReceived.result.n == 0 ){
        return reject(false);
      }
      await notificationModel.model.removeRequestNotificationContact(targetId , currentUserId)
      resolve(true);
    } catch (error) {
      reject(error) ;
    }
  })
};

let approveRequestContactReceived = (currentUserId , targetId ) => {
  return new Promise( async (resolve , reject) => {
    try {
      let approveStatus = await contactModel.approveRequestContactReceived(currentUserId , targetId );
      if(approveStatus.nModified == 0){
        return reject(false);
      }
      let notificationItem = {
        senderId : currentUserId , 
        receiverId : targetId , 
        type : notificationModel.types.ACCEPT_CONTACT
      }
      await notificationModel.model.createNewNotification(notificationItem) ;
      //let markAsRead = await notificationModel.model.markAsRead(currentUserId , targetId , notificationModel.types.ADD_CONTACT) ;
      let contactInfor = await userModel.findUsersNormalById(targetId);
      resolve({
        success : true ,
        contactInfor : contactInfor
      });
    } catch (error) {
      reject(error);
    }
  })
};

let getUsersContact = (currentUserId) => {
  return new Promise( async (resolve , reject) => {
    let getContents = await contactModel.getUsersContact(currentUserId , LIMIT_NUMBER);
    let usersContact = getContents.map( async contact => {
      if(contact.userId == currentUserId){
        return await userModel.findUsersNormalById(contact.contactId);
      }else{
        return await userModel.findUsersNormalById(contact.userId);
      }
    })
    resolve(await Promise.all(usersContact));
  })
};

let countUsersContact = (currentUserId) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      let countUsersContact =  await contactModel.countUsersContact(currentUserId) ;
      resolve(countUsersContact);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreContacts = (currentUserId , skipNumber) => {
  return new Promise( async(resolve , reject) => {
    try {
      let getContents = await contactModel.readMoreContacts(currentUserId , skipNumber , LIMIT_NUMBER);
      let usersContact = getContents.map(async contact => {
        if(contact.userId == currentUserId){
          return await userModel.findUsersNormalById(contact.contactId) ;
        }
        return await userModel.findUsersNormalById(contact.userId);
      })
      resolve( await Promise.all(usersContact));
      
    } catch (error) {
      reject(error);
    }
  })
};

let removeContacts = (currentUserId , contactId) => {
  return new Promise( async(resolve , reject ) => {
    try {
      let removeStatus = await contactModel.removeContacts(currentUserId , contactId); 
      if(removeStatus.result.n == 0 ){
        return reject(false);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

let getConversationFromNavbarSearch = (currentUserId , inputVal ) =>{
  return new Promise( async (resolve , reject) => {
    try {
     
      //step01 : get id of users except currentUserId 
      let resultFromServer = await userModel.findUserByInputValue( currentUserId , inputVal );
      resultFromServer = _.map(resultFromServer , item => item._id);
      
      //step02 : check contact
      let usersContactListPromise = resultFromServer.map(async contactId => {
        let checkContact = await contactModel.checkContactStatusTrue(currentUserId , contactId) ;
        if(checkContact.length){
          let user = await userModel.findUsersNormalById(contactId) ; 
          return user ; 
        }
        return null ;
      })

      let usersContactList = await Promise.all(usersContactListPromise);
      usersContactList = _.filter(usersContactList , item => item != null);
      resolve(usersContactList);
    } catch (error) {
      reject(error);
    }
  })
};

let addNewContactFromGroupChat = (currentUserId , targetId ) => {
  return new Promise( async (resolve, reject) => {
    try {
      let checkContact = await contactModel.checkContactExists(currentUserId , targetId);
      if(checkContact){
        return reject(false) ; 
      }
      let newContactItem = {
        userId : currentUserId , 
        contactId : targetId
      }
      let createContact = await contactModel.createNew(newContactItem) ;
      let contactInfor = await userModel.findUsersNormalById(targetId);

      //create notification to contactId
      let notificationItem = {
        senderId : currentUserId , 
        receiverId : targetId , 
        type : notificationModel.types.ADD_CONTACT
      }
      let newNotification = await notificationModel.model.createNewNotification(notificationItem) ;
      resolve({ 
        createContact : createContact ,
        contactInfor : contactInfor ,
        newNotification : newNotification 
      });
    } catch (error) {
      reject(error) ;
    }
  }) 
};


let memberCancelRequestContactSent = (currentUserId , targetId ) => {
  return new Promise ( async (resolve , reject) => {
    try {
      let removeContact = await contactModel.removeRequestContact(currentUserId  , targetId) ;
      
      if(removeContact.n == 0){
        return reject(error) ; 
      }
      resolve(true);
    } catch (error) {
     reject(error)  ;
    }
  })
};

let approveRequestContactFromMemberInGroup = (currentUserId , targetId) => {
  return new Promise(async (resolve , reject ) => {
    try {
      let changeStatus = await contactModel.approveRequestContactReceived(currentUserId , targetId )  ;
      if(changeStatus.nModified == 0 ){
        return reject(false);
      }

      let newNotificationItem = {
        senderId : currentUserId , 
        receiverId : targetId ,
        type : notificationModel.types.ACCEPT_CONTACT
      }
      let newNotification = await notificationModel.model.createNewNotification(newNotificationItem);
      let contactInfor = await userModel.findUsersNormalById(targetId);

      resolve({
        success : true , 
        contactInfor : contactInfor 
      });
    } catch (error) {
      reject(error) ; 
    }
  })
};

let checkExistedContact = (currentUserId , targetId) => {
  return new Promise(async  (resolve,  reject) => {
    try {
      let contactStatus = await contactModel.checkContact(currentUserId, targetId) ; 
      if(contactStatus.length){
        return reject(false);
      }
      resolve(true);
    } catch (error) {
      reject(error) ; 
    }
  })
}
module.exports = {
  findUsersConctact : findUsersConctact,
  addNewContact : addNewContact,
  removeRequestContact : removeRequestContact,
  getContactSent : getContactSent,
  countReqContactsSent : countReqContactsSent,
  readMoreRequestContactsSent : readMoreRequestContactsSent,
  getContactsReceived : getContactsReceived,
  countReqContactsReceived : countReqContactsReceived,
  readMoreRequestContactsReceived : readMoreRequestContactsReceived,
  removeRequestContactsReceived : removeRequestContactsReceived,
  approveRequestContactReceived : approveRequestContactReceived,
  getUsersContact : getUsersContact,
  countUsersContact : countUsersContact,
  readMoreContacts : readMoreContacts,
  removeContacts : removeContacts ,
  getConversationFromNavbarSearch: getConversationFromNavbarSearch , 
  addNewContactFromGroupChat : addNewContactFromGroupChat,
  memberCancelRequestContactSent : memberCancelRequestContactSent ,
  approveRequestContactFromMemberInGroup : approveRequestContactFromMemberInGroup,
  checkExistedContact : checkExistedContact
}