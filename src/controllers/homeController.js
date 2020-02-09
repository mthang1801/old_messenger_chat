import {notification, contact , groupChat , message} from "./../services/index";
import {bufferToBase64 , lastItemOfArray , convertTimeOfLastMessage , popupMessageTime} from "./../helpers/clientHelper";
import request from "request";
import { rejects } from "assert";
let getICETurnServer = () => {
  return new Promise ( async (resolve , reject ) => {
  //   let o = {
  //     format: "urls"
  //   };
  
  //   let bodyString = JSON.stringify(o);
    
  //   let options = {
  //       url : "https://global.xirsys.net/_turn/messenger" ,
  //       method: "PUT",
  //       headers: {
  //           "Authorization": "Basic " + Buffer.from("t6cantho2:b9e25e00-c0d1-11e9-b0a1-0242ac110003").toString("base64"),
  //           "Content-Type": "application/json",
  //           "Content-Length": bodyString.length
  //       }
  //   };
  //   request(options ,(error , response ,body) => {
  //     if(error){
  //       console.log("Error from ICE list: " + error) ; 
  //       return rejects(error)
  //     }
  //     let JSONbody = JSON.parse(body) ; 
  //     resolve (JSONbody.v.iceServers) ; 
  //   })
  // })
  resolve([]);
  })
}
let getHome = async (req , res) => {
  
  let notifications = await notification.getNotification(req.user._id);
 
  let countReqContactUnread = await notification.countNotificationRequestContactUnread(req.user._id);

  let contactsSent = await contact.getContactSent(req.user._id);
  let countRequestContactSent = await contact.countReqContactsSent(req.user._id);

  let contactsReceived = await contact.getContactsReceived(req.user._id);
  let countRequestContactReceived = await contact.countReqContactsReceived(req.user._id);

  let usersContact = await contact.getUsersContact(req.user._id);
  let countUsersContact = await contact.countUsersContact(req.user._id);

  let allConversationsWithMessages = await message.getAllConversationWithMessages(req.user._id ) ; 

  let allMembersInGroup = await groupChat.getAllMembersInGroup(req.user._id) ;

  let iceServerList = await getICETurnServer();
 
  res.render("main/home/home" , {
    errors : req.flash("errors"),
    success : req.flash("success") ,
    user : req.user ,
    notifications : notifications , 
    countReqContactUnread : countReqContactUnread,
    contactsSent : contactsSent,
    countRequestContactSent : countRequestContactSent,
    contactsReceived : contactsReceived,
    countRequestContactReceived : countRequestContactReceived,
    usersContact : usersContact,
    countUsersContact : countUsersContact ,
    allConversationsWithMessages : allConversationsWithMessages ,
    bufferToBase64 : bufferToBase64 , 
    convertTimeOfLastMessage : convertTimeOfLastMessage , 
    lastItemOfArray : lastItemOfArray,
    popupMessageTime : popupMessageTime,
    allMembersInGroup : allMembersInGroup, 
    iceServerList : JSON.stringify(iceServerList) 
  });
  
}

module.exports = {
  getHome : getHome 
}