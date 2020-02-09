import {validationResult} from "express-validator/check";
import {contact , message } from "./../services/index"
import ejs from "ejs" ;
import {promisify} from "util";
import {bufferToBase64 , convertTimeOfLastMessage , lastItemOfArray , popupMessageTime} from "./../helpers/clientHelper"
import { rejects } from "assert";
const renderFile = promisify(ejs.renderFile).bind(ejs);

let findUsersConctact = async (req , res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    errors.forEach( error => {
      errorArr.push(error.msg);
    })
    console.log(errorArr);
    return res.status(500).send(errorArr);
  }
  
  try {
    let currentUserId = req.user._id ; 
    let keyword = req.params.keyword ; 
    let users = await contact.findUsersConctact(currentUserId , keyword);
    return res.render("main/contact/sessions/_findUsersContact" , {users: users});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNewContact = async (req , res) =>{
  try {
    let currentUserId = req.user._id ;
    let contactId = req.body.uid ;
   
     let newContact = await contact.addNewContact(currentUserId , contactId) ;
     return res.status(200).send({success : !!newContact , newNotification : newContact.newNotification});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContact = async (req , res) => {
  try {
    let currentUserId = req.user._id ; 
    let contactId = req.body.uid  ;
    let removeContact = await contact.removeRequestContact(currentUserId , contactId);
    return res.status(200).send({success : !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreRequestContactsSent = async (req, res)=>{
  try {
    let skipNumber = +req.query.skipNumber;
    let currentUserId = req.user._id ; 
    let users = await contact.readMoreRequestContactsSent(currentUserId , skipNumber);
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreRequestContactsReceived = async (req , res) => {
  try {
    let skipNumber = +req.query.skipNumber;
    let currentUserId = req.user._id ;

    let users = await contact.readMoreRequestContactsReceived(currentUserId , skipNumber);
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactsReceived = async ( req , res ) => {
  try {
    let targetId = req.body.uid ; 
    let currentUserId = req.user._id ;

    let removeContactReceived  = await contact.removeRequestContactsReceived(currentUserId , targetId) ; 
   
    return res.status(200).send({success : !!removeContactReceived});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req ,  res) =>{
  try {
    let currentUserId = req.user._id ; 
    let targetId = req.body.uid ; 
    let approveSuccess = await contact.approveRequestContactReceived(currentUserId , targetId );
    return res.status(200).send({success : !!approveSuccess , contactInfor : approveSuccess.contactInfor});
  } catch (error) {
    return res.status(500).send(error);
  }
};



let readMoreContacts = async (req , res) => {
  try {
    let skipNumber = +req.query.skipNumber ; 
    let usersContact = await contact.readMoreContacts(req.user._id , skipNumber);
    return res.status(200).send(usersContact);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContacts = async ( req , res ) =>{
  try {
    let removeSuccess = await contact.removeContacts(req.user._id , req.body.uid);
    return res.status(200).send({success : !!removeSuccess});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let chatWithUserFromContactList = async (req , res) => {
  try {
    let targetId = req.query.targetId ; 
    let newMessages = await message.chatWithUserFromContactList(req.user._id , targetId );
   
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
    return res.status(500).send(error);
  }
};

let getConversationFromNavbarSearch = async(req , res) => {
  try {
    let inputVal = req.query.inputVal;
    let usersContactList = await contact.getConversationFromNavbarSearch(req.user._id , inputVal);
    let findUserContactAtNavbar = await renderFile("src/views/main/navbar/_findUsersContactAtNavbar.ejs" ,{ usersContactList : usersContactList }) ;
    
    return res.status(200).send({ findUserContactAtNavbar : findUserContactAtNavbar}) ;
  } catch (error) {
    return res.status(500).send(error);
  }
};


let addNewContactFromGroupChat = async (req , res ) => {
  try {
    let targetId = req.body.targetId ; 
    let newContact = await contact.addNewContactFromGroupChat(req.user._id , targetId) ;
    return res.status(200).send({
      success : !!newContact.createContact , 
      contactInfor : newContact.contactInfor ,
      newNotification : newContact.newNotification
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let memberCancelRequestContactSent = async (req , res) => {
  try {
    let targetId = req.body.targetId ; 
    let removeContact = await contact.memberCancelRequestContactSent(req.user._id , targetId) ;
    return res.status(200).send({success : !!removeContact});
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let approveRequestContactFromMemberInGroup = async (req , res) => {
  try {
    let targetId= req.body.targetId ; 
    let approveSuccess = await contact.approveRequestContactFromMemberInGroup(req.user._id , targetId ) ;
    return res.status(200).send({success : !!approveSuccess , contactInfor : approveSuccess.contactInfor});
  } catch (error) {
    return res.status(500).send(error); 
  }
};

let checkExistedContact =async (req, res ) => {
  try {
    let contactStatus = await contact.checkExistedContact( req.user._id , req.query.targetId);
    return res.status(200).send({success : !!contactStatus})
  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  findUsersConctact : findUsersConctact,
  addNewContact : addNewContact,
  removeRequestContact : removeRequestContact,
  readMoreRequestContactsSent : readMoreRequestContactsSent,
  readMoreRequestContactsReceived : readMoreRequestContactsReceived,
  removeRequestContactsReceived : removeRequestContactsReceived,
  approveRequestContactReceived : approveRequestContactReceived,
  readMoreContacts : readMoreContacts,
  removeContacts : removeContacts,
  chatWithUserFromContactList : chatWithUserFromContactList ,
  getConversationFromNavbarSearch : getConversationFromNavbarSearch,
  addNewContactFromGroupChat : addNewContactFromGroupChat ,
  memberCancelRequestContactSent : memberCancelRequestContactSent, 
  approveRequestContactFromMemberInGroup : approveRequestContactFromMemberInGroup,
  checkExistedContact : checkExistedContact
}