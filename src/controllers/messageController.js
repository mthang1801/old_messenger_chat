import {message} from "./../services/index"
import multer from "multer"; 
import {app} from "./../config/common";
import {transErrors} from "./../../lang/vi";
import fsExtra from "fs-extra";
import ejs from "ejs" ;
import {promisify} from "util";
import {bufferToBase64 , lastItemOfArray , convertTimeOfLastMessage , popupMessageTime} from "./../helpers/clientHelper"
const renderFile = promisify(ejs.renderFile).bind(ejs);
let AddNewTextAndEmojiChat = async (req , res)=> {
  try {
    let sender = {
      id: req.user._id , 
      name : req.user.username , 
      avatar : req.user.avatar
    }
    let targetId = req.query.targetId  ;
    let messageVal = req.query.messageVal ; 
    let isGroup = (req.query.isGroup== "true" ) ? true : false ;
    let newMessage = await message.AddNewTextAndEmojiChat(sender , targetId , messageVal , isGroup) ;
    //sau khi lưu vào mongodb thì xóa file 
   
    return res.status(200).send({message :newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};
//=================================================================================

let imageChatStorage = multer.diskStorage({
  destination : (req , file , callback) => {
    callback(null , app.image_chat_directory) ;
  },
  filename : (req , file , callback) => {
    let match = app.image_chat_type ; 
    if(match.indexOf(file.mimetype) == -1 ){
      return callback(transErrors.image_type) ; 
    }
    let imageName = `${Date.now()}-${file.originalname}` ;
    callback(null , imageName);
  }
});

let imageChatUploadFile = multer({
  storage : imageChatStorage , 
  limits : {fileSize : app.image_chat_limit_size} 
}).single("my-image-chat");


let addNewImageChat = ( req , res ) => {
  imageChatUploadFile( req , res , async error => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.image_size) ;
      }
      return res.status(500).send(error) ; 
    }
    try {
      let sender = {
        id : req.user._id , 
        name : req.user.username, 
        avatar : req.user.avatar
      }
      let messageVal = req.file ; 
      let isChatGroup = req.body.isChatGroup ;
      let receiverId = req.body.targetId ;
      let newImageMessage = await message.addNewImageChat(sender , receiverId , messageVal , isChatGroup );
      await fsExtra.remove(messageVal.path) ;
     
      return res.status(200).send({message : newImageMessage}) ; 
    } catch (error) {
      return res.status(500).send(error);
    }
  })
};
//============================================================================================
let attachmentStorage = multer.diskStorage({
  destination : (req , file , cb) => {
    cb(null , app.attachment_chat_directory) ;
  },
  filename : (req , file,  cb) => {
    let match = app.attachment_chat_not_type ; 
    if(match.indexOf(file.mimetype) != -1 ){
      return cb(transErrors.attachment_not_type , null );
    }
    let attachmentName = `${Date.now()}-${file.originalname}` ;
    cb(null , attachmentName) ;
  }
});

let attachmentUploadFile = multer({
  storage : attachmentStorage , 
  limits : { fileSize : app.attachment_chat_limit_size} 
}).single("my-attach-chat") ; 

let addNewAttachmentChat = (req , res) => {
  attachmentUploadFile( req , res ,async error => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.attachment_override_limit_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id : req.user._id , 
        name : req.user.username , 
        avatar : req.user.avatar  
      }

      let receiverId = req.body.targetId ;
      let messageVal = req.file ; 
      let isChatGroup = req.body.isChatGroup ; 
      let newAttachmentMessage = await message.addNewAttachmentChat(sender , receiverId , messageVal , isChatGroup ) ;

      await fsExtra.remove(messageVal.path) ; 
      return res.status(200).send({message : newAttachmentMessage}) ;
    } catch (error) {
      return res.status(500).send(error) ; 
    }
  })
};

let readMoreAllConversations = async (req , res) => {
  try {
    let skipGroup = +req.query.skipGroup ;
    let skipPersonal = +req.query.skipPersonal ;
    let newMessages = await message.readMoreAllConversations(req.user._id , skipGroup , skipPersonal);
    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray , 
      popupMessageTime : popupMessageTime , 
      convertTimeOfLastMessage : convertTimeOfLastMessage , 
      user : req.user 
    }
   
    let allChatLeftSide = await renderFile("src/views/main/readMoreConversations/_allChatLeftSide.ejs" , dataToRender) ;
    let allChatRightSide = await renderFile("src/views/main/readMoreConversations/_allChatRightSide.ejs" , dataToRender) ;
    let allChatImage = await renderFile("src/views/main/readMoreConversations/_allChatImage.ejs" , dataToRender) ;
    let allChatAttachment = await renderFile("src/views/main/readMoreConversations/_allChatAttachment.ejs" , dataToRender);
    let groupChatAvatarModal = await  renderFile("src/views/main/readMoreConversations/_allChatReadMoreAvatarGroupModal.ejs" , dataToRender);
    return res.status(200).send({
      allChatLeftSide : allChatLeftSide , 
      allChatRightSide : allChatRightSide , 
      allChatImage : allChatImage , 
      allChatAttachment : allChatAttachment ,
      groupChatAvatarModal : groupChatAvatarModal 
    })
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let readMoreUserConversations =async (req , res) => {
  try {
    let skipPersonal = +req.query.skipPersonal ; 
    let newMessages = await message.readMoreUserConversations(req.user._id , skipPersonal );

    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray , 
      convertTimeOfLastMessage : convertTimeOfLastMessage , 
      popupMessageTime : popupMessageTime ,
      user : req.user 
    }

 
    let userChatLeftSide = await renderFile("src/views/main/readMoreConversations/_userChatLeftSide.ejs" , dataToRender) ;
    let userChatRightSide = await renderFile("src/views/main/readMoreConversations/_userChatRightSide.ejs" , dataToRender) ;
    let userChatImageModal = await renderFile("src/views/main/readMoreConversations/_userChatImageModal.ejs" , dataToRender) ;
    let userChatAttachmentModal = await renderFile("src/views/main/readMoreConversations/_userChatAttachmentModal.ejs" , dataToRender);

    return res.status(200).send({
      userChatLeftSide : userChatLeftSide , 
      userChatRightSide : userChatRightSide , 
      userChatImageModal : userChatImageModal , 
      userChatAttachmentModal : userChatAttachmentModal
    })
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let readMoreGroupConversations =async (req , res) => {
  try {
    let skipGroup = +req.query.skipGroup ; 
    let newMessages = await message.readMoreGroupConversations(req.user._id , skipGroup );

    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray , 
      convertTimeOfLastMessage : convertTimeOfLastMessage , 
      popupMessageTime : popupMessageTime ,
      user : req.user 
    }
 
 
    let groupChatLeftSide = await renderFile("src/views/main/readMoreConversations/_groupChatLeftSide.ejs" , dataToRender) ;
    let groupChatRightSide = await renderFile("src/views/main/readMoreConversations/_groupChatRightSide.ejs" , dataToRender) ;
    let groupChatImageModal = await renderFile("src/views/main/readMoreConversations/_groupChatImageModal.ejs" , dataToRender) ;
    let groupChatAttachmentModal = await renderFile("src/views/main/readMoreConversations/_groupChatAttachmentModal.ejs" , dataToRender);
    let groupChatAvatarModal = await renderFile("src/views/main/readMoreConversations/_groupChatReadMoreAvatarGroupModal.ejs" , dataToRender) ;
    
    return res.status(200).send({
      groupChatLeftSide : groupChatLeftSide , 
      groupChatRightSide : groupChatRightSide , 
      groupChatImageModal : groupChatImageModal , 
      groupChatAttachmentModal : groupChatAttachmentModal,
      groupChatAvatarModal : groupChatAvatarModal
    })
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let readMoreMessages = async (req , res) => {
  try {
    let isChatGroup = (req.query.isChatGroup == "true" ) ? true : false ;
    let targetId = req.query.targetId ; 
    let skipMessages = +req.query.skipMessages  ;
    let newMessages = await message.readMoreMessages(req.user._id , targetId , skipMessages , isChatGroup) ; 
  
   
    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      popupMessageTime : popupMessageTime ,
      user : req.user 
    }
 
    let rightSide = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs" , dataToRender);
    let imageModal = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs" , dataToRender) ; 
    let attachmentModal = await renderFile("src/views/main/readMoreMessages/_attachmentModal.ejs" , dataToRender) ;
    return res.status(200).send({
      rightSide : rightSide,
      imageModal : imageModal , 
      attachmentModal : attachmentModal 
    });
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let findConversationFromReadMoreAndTakeToTheFirstRow = async (req, res) => {
  try {
    let targetId = req.query.targetId ;
    let isGroup = (req.query.isGroup == "true" ) ? true : false;
    let currentUserId = req.user._id ; 
    let findConversation = await message.findConversationFromReadMoreAndTakeToTheFirstRow(currentUserId ,targetId , isGroup );
    let dataToRender = {
      conversation : findConversation , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray , 
      convertTimeOfLastMessage : convertTimeOfLastMessage , 
      popupMessageTime : popupMessageTime ,
      user : req.user 
    }
  
    let leftSide = await renderFile("src/views/main/groupChat/findConversationFromReadMoreAndTakeToTheFirstRow/_leftSide.ejs", dataToRender);   
    let rightSide = await renderFile("src/views/main/groupChat/findConversationFromReadMoreAndTakeToTheFirstRow/_rightSide.ejs" , dataToRender) ;
    let attachmentsModal = await renderFile("src/views/main/groupChat/findConversationFromReadMoreAndTakeToTheFirstRow/_attachmentsModal.ejs" , dataToRender ); 
    let imagesModal = await renderFile("src/views/main/groupChat/findConversationFromReadMoreAndTakeToTheFirstRow/_imagesModal.ejs" , dataToRender) ;
    return res.status(200).send({
      leftSide : leftSide , 
      rightSide : rightSide , 
      attachmentsModal : attachmentsModal, 
      imagesModal : imagesModal 
    })
    
  } catch (error) {
    return res.status(500).send(error) ;
  }
}

module.exports = {
  AddNewTextAndEmojiChat : AddNewTextAndEmojiChat,
  addNewImageChat : addNewImageChat ,
  addNewAttachmentChat : addNewAttachmentChat,
  readMoreAllConversations: readMoreAllConversations,
  readMoreUserConversations : readMoreUserConversations,
  readMoreGroupConversations : readMoreGroupConversations,
  readMoreMessages : readMoreMessages,
  findConversationFromReadMoreAndTakeToTheFirstRow : findConversationFromReadMoreAndTakeToTheFirstRow
}