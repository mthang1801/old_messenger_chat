import userModel from "./../models/userModel" ;
import messageModel from "./../models/messageModel" ;
import chatGroupModel from "./../models/chatGroupModel"; 
import contactModel from "./../models/contactModel" ; 
import fsExtra from "fs-extra";
import _ from "lodash";


let LIMIT_MESSAGES = 30 ; 
let LIMIT_CONVERSATIONS = 5 ; 
let getAllConversationWithMessages = (currentUserId )=> {
  return new Promise( async(resolve , reject ) => {
    try {
      let getContacts = await contactModel.getUsersContact(currentUserId , LIMIT_CONVERSATIONS) ; 
      let getPrivateConversationPromise  = getContacts.map( async contact => {
        if(contact.userId == currentUserId ){
          let user = await userModel.findUsersNormalById(contact.contactId) ; 
          user.updatedAt = contact.updatedAt ; 
          return user ; 
        }
        let user = await userModel.findUsersNormalById(contact.userId) ; 
          user.updatedAt = contact.updatedAt ; 
          return user ; 
      })
      let privateConversations = await Promise.all(getPrivateConversationPromise) ; 

      let groupsConversations = await chatGroupModel.getGroupsConversation(currentUserId , LIMIT_CONVERSATIONS);
      
      let allConversations = privateConversations.concat(groupsConversations);
     
      
      let allConversationsWithMessagesPromise = await allConversations.map( async conversation => {
        conversation = conversation.toObject() ; 
        if(conversation.members){
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages);
          return conversation ; 
        }
        let getMessages = await messageModel.model.getMessagesInPrivate(currentUserId , conversation._id , LIMIT_MESSAGES);
        conversation.messages = _.reverse(getMessages) ; 
        return conversation ; 
      })
      let allConversationsWithMessages = await Promise.all( allConversationsWithMessagesPromise) ; 
      allConversationsWithMessages = _.sortBy( allConversationsWithMessages , (item) => -item.updatedAt );
     
      resolve(allConversationsWithMessages) ;
    } catch (error) {
      reject(error) ; 
    }
  })
};

let AddNewTextAndEmojiChat = (sender , targetId , messageVal , isGroup) => {
  return new Promise ( async (resolve , reject) => {
    try {
      if(isGroup == true ){
        let groupInfor = await chatGroupModel.getGroupInfor(targetId);

        let receiver = {
          id : groupInfor._id , 
          name : groupInfor.name , 
          avatar : groupInfor.avatar 
        }
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.CONVERSATION_TYPES.GROUP , 
          messageType : messageModel.TYPES.TEXT , 
          sender : sender,
          receiver : receiver,
          text : messageVal 
        }
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update time 
        await chatGroupModel.updateTimeWhenHasNewMessage(receiver.id , groupInfor.messageAmount + 1 );
        return resolve(newMessage);
      }
      let userInfor = await userModel.findUsersNormalById(targetId) ; 
      let receiver = {
        id : userInfor._id , 
        name : userInfor.username , 
        avatar : userInfor.avatar 
      }
      let newMessageItem = {
        senderId : sender.id , 
        receiverId : receiver.id ,
        conversationType : messageModel.CONVERSATION_TYPES.PRIVATE , 
        messageType : messageModel.TYPES.TEXT , 
        sender : sender,
        receiver : receiver,
        text : messageVal 
      }
      let newMessage = await messageModel.model.createNew(newMessageItem);
      //update time contact
      await contactModel.updateTimeWhenHasNewMessage(sender.id , receiver.id)
      
      resolve(newMessage);
    } catch (error) {
      reject(error);
    }
  })
};

let addNewImageChat = (sender , receiverId , messageVal , isChatGroup) => {
  return new Promise ( async (resolve , reject) => {
    try {
      if(isChatGroup){
        let groupInfor = await chatGroupModel.getGroupInfor(receiverId) ;
        let receiver = {
          id : groupInfor._id , 
          name : groupInfor.name , 
          avatar : groupInfor.avatar 
        }

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageType = messageVal.mimetype ; 
        let imageFileName = messageVal.originalname ;

       let newMessageItem = {
        senderId : sender.id  , 
        receiverId : receiver.id ,
        conversationType : messageModel.CONVERSATION_TYPES.GROUP , 
        messageType : messageModel.TYPES.IMAGE , 
        sender : sender ,
        receiver : receiver,
        file : {data : imageBuffer , contentType : imageType , fileName : imageFileName } ,
       
       }
       let newMessage = await messageModel.model.createNew(newMessageItem);
       await chatGroupModel.updateTimeWhenHasNewMessage(receiver.id , groupInfor.messageAmount + 1 );
       return resolve(newMessage);
      }
      let userInfor = await userModel.findUsersNormalById(receiverId) ; 
      let receiver = {
        id : userInfor._id , 
        name : userInfor.username ,
        avatar : userInfor.avatar 
      }
      let imageBuffer = await fsExtra.readFile(messageVal.path) ; 
      let imageContentType = messageVal.mimetype ; 
      let imageFileName = messageVal.originalname ; 
      let newMessageItem = {
        senderId : sender.id  , 
        receiverId : receiver.id ,
        conversationType : messageModel.CONVERSATION_TYPES.PRIVATE , 
        messageType : messageModel.TYPES.IMAGE , 
        sender : sender ,
        receiver : receiver,
        file : {data : imageBuffer , contentType : imageContentType , fileName : imageFileName } ,
       }
       let newMessage = await messageModel.model.createNew(newMessageItem) ; 
       await contactModel.updateTimeWhenHasNewMessage(sender.id , receiver.id) ; 
       resolve(newMessage);
    } catch (error) {
      reject(error); 
    }
  })
};

let addNewAttachmentChat = (sender , receiverId , messageVal , isChatGroup) => {
  return new Promise ( async (resolve , reject) => {
    try {
      if(isChatGroup){
        let groupInfor = await chatGroupModel.getGroupInfor(receiverId) ;
        let receiver = {
          id : groupInfor._id , 
          name : groupInfor.name , 
          avatar : groupInfor.avatar 
        }

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentType = messageVal.mimetype ; 
        let attachmentFileName = messageVal.originalname ;

       let newMessageItem = {
        senderId : sender.id  , 
        receiverId : receiver.id ,
        conversationType : messageModel.CONVERSATION_TYPES.GROUP , 
        messageType : messageModel.TYPES.FILE , 
        sender : sender ,
        receiver : receiver,
        file : {data : attachmentBuffer , contentType : attachmentType , fileName : attachmentFileName } ,
       
       }
       let newMessage = await messageModel.model.createNew(newMessageItem);
       await chatGroupModel.updateTimeWhenHasNewMessage(receiver.id , groupInfor.messageAmount + 1 );
       return resolve(newMessage);
      }
      let userInfor = await userModel.findUsersNormalById(receiverId) ; 
      let receiver = {
        id : userInfor._id , 
        name : userInfor.username ,
        avatar : userInfor.avatar 
      }
      let attachmentBuffer = await fsExtra.readFile(messageVal.path) ; 
      let attachmentContentType = messageVal.mimetype ; 
      let attachmentFileName = messageVal.originalname ; 
      let newMessageItem = {
        senderId : sender.id  , 
        receiverId : receiver.id ,
        conversationType : messageModel.CONVERSATION_TYPES.PRIVATE , 
        messageType : messageModel.TYPES.FILE , 
        sender : sender ,
        receiver : receiver,
        file : {data : attachmentBuffer , contentType : attachmentContentType , fileName : attachmentFileName } ,
       }
       let newMessage = await messageModel.model.createNew(newMessageItem) ; 
       await contactModel.updateTimeWhenHasNewMessage(sender.id , receiver.id) ; 
       resolve(newMessage);
    } catch (error) {
      reject(error); 
    }
  })
};

let readMoreAllConversations = (currentUserId , skipGroup , skipPersonal ) => {
  return new Promise (async (resolve , reject ) => {
    try {
      let contacts = await contactModel.getMoreContactsPersonal( currentUserId , skipPersonal , LIMIT_CONVERSATIONS) ;
      let usersConversationPromise = contacts.map( async contact => {
        if(contact.userId == currentUserId) {
          let user =  await userModel.findUsersNormalById(contact.contactId) ; 
          user.updatedAt = contact.updatedAt ; 
          return user ; 
        }
        let user =  await  userModel.findUsersNormalById(contact.userId) ; 
        user.updatedAt = contact.updatedAt ; 
        return user; 
      })
      let usersConversation =  await Promise.all(usersConversationPromise);
      let groupsConversation = await chatGroupModel.getMoreGroups(currentUserId , skipGroup , LIMIT_CONVERSATIONS ) ;
      let getMoreConversations = usersConversation.concat(groupsConversation);
      let allConversationsWithMessagesPromise = getMoreConversations.map( async conversation => {
        conversation = conversation.toObject() ; 
        if(conversation.members){
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages);
          return conversation ; 
        }
          let getMessages = await messageModel.model.getMessagesInPrivate(currentUserId, conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages) ; 
          return conversation;
      })
      
      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
      allConversationsWithMessages = _.sortBy( allConversationsWithMessages , item => -item.updatedAt);
      resolve(allConversationsWithMessages);
    } catch (error) {
      reject(error) ;
    }
  })
};

let readMoreUserConversations = ( currentUserId ,  skipPersonal ) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      let contacts = await contactModel.getMoreContactsPersonal(currentUserId , skipPersonal , LIMIT_CONVERSATIONS );

      let userConversationsPromise = contacts.map( async contact => {
        if(contact.userId == currentUserId ){
          let user = await userModel.findUsersNormalById(contact.contactId) ;
          user.updatedAt = contact.updatedAt ; 
          return user ; 
        }
        let user = await userModel.findUsersNormalById(contact.userId) ;
        user.updatedAt = contact.updatedAt ; 
        return user ; 
      })

      let userConversations = await Promise.all(userConversationsPromise) ; 
      let userConversationsWithMessagesPromise = userConversations.map( async conversation => {
        conversation = conversation.toObject() ; 
        let getMessages = await messageModel.model.getMessagesInPrivate(currentUserId, conversation._id , LIMIT_MESSAGES);
        conversation.messages = _.reverse(getMessages) ; 
        return conversation ; 
      })
      let userConversationsWithMessages = await Promise.all(userConversationsWithMessagesPromise) ; 
      userConversationsWithMessages = _.sortBy( userConversationsWithMessages , item => -item.updatedAt) ;
      resolve(userConversationsWithMessages);
    } catch (error) {
      reject(error) ; 
    }
  })
};

let readMoreGroupConversations = (currentUserId ,  skipGroup ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let groupConversations = await chatGroupModel.getMoreGroups(currentUserId , skipGroup , LIMIT_CONVERSATIONS ); 
      let groupConversationsWithMessagesPromise = groupConversations.map( async conversation => {
        conversation = conversation.toObject() ; 
        let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES) ;
        conversation.messages = _.reverse(getMessages) ; 
        return conversation ; 
      })

      let groupConversationsWithMessages = await Promise.all(groupConversationsWithMessagesPromise) ;
      resolve(groupConversationsWithMessages);
    } catch (error) {
      reject(error) ; 
    }
  })
};

let readMoreMessages = (currentUserId , targetId , skipMessages , isChatGroup ) => {
  return new Promise ( async(resolve , reject ) => {
    try {
      if(isChatGroup){
        let groupChatInfor = await chatGroupModel.getGroupInfor(targetId);
        let getMessages = await messageModel.model.getMoreMessagesInGroup( targetId , skipMessages , LIMIT_MESSAGES);
        groupChatInfor = groupChatInfor.toObject() ; 
        groupChatInfor.messages = _.reverse(getMessages);
        
       return resolve(new Array(groupChatInfor));
      }
        let user = await userModel.findUsersNormalById(targetId) ; 
        user = user.toObject() ; 
        let getMessages = await messageModel.model.getMoreMessagesInPerson( currentUserId , targetId , skipMessages , LIMIT_MESSAGES);
        user.messages = _.reverse(getMessages) ;
        resolve(new Array(user));
    } catch (error) {
      reject(error);
    }
  })
};

let chatWithUserFromContactList = (currentUserId , targetId ) => {
  return new Promise (async (resolve, reject) => {
    try {
     
      let user = await userModel.findUsersNormalById(targetId) ; 
      user = user.toObject();
      let getMessages = await messageModel.model.getMessagesInPrivate(currentUserId , targetId , LIMIT_MESSAGES);
      user.messages = _.reverse(getMessages) ; 

      resolve(new Array(user)) ; 

    } catch (error) {
      reject(error) ; 
    }
  })
};

let findConversationFromReadMoreAndTakeToTheFirstRow = (currentUserId,  targetId , isChatGroup ) => {
  return new Promise(async (resolve,  reject) => {
    try {
      if(isChatGroup){
        let groupChatInfor = await chatGroupModel.getGroupInfor(targetId);
        let getMessages = await messageModel.model.getMessagesInGroup( targetId , LIMIT_MESSAGES);
        groupChatInfor = groupChatInfor.toObject() ; 
        groupChatInfor.messages = _.reverse(getMessages);
        return resolve(groupChatInfor);
      }
      let user = await userModel.findUsersNormalById(targetId) ;
      let getMessages = await messageModel.model.getMessagesInPrivate(currentUserId , targetId ,LIMIT_MESSAGES ) ;
      user = user.toObject() ; 
      user.messages = _.reverse(getMessages) ; 
      resolve(user);
    } catch (error) {
      reject(error);
    }
  } )
}
module.exports= {
  getAllConversationWithMessages : getAllConversationWithMessages,
  AddNewTextAndEmojiChat : AddNewTextAndEmojiChat,
  addNewImageChat : addNewImageChat ,
  addNewAttachmentChat : addNewAttachmentChat,
  readMoreAllConversations : readMoreAllConversations,
  readMoreUserConversations : readMoreUserConversations,
  readMoreGroupConversations : readMoreGroupConversations,
  readMoreMessages : readMoreMessages,
  chatWithUserFromContactList : chatWithUserFromContactList,
  findConversationFromReadMoreAndTakeToTheFirstRow : findConversationFromReadMoreAndTakeToTheFirstRow
}