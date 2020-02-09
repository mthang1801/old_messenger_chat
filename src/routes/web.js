import express from "express" ;
import passport from "passport";
import {home,auth,user, contact,notification , message , groupChat} from "./../controllers/index" ;
import {authValid , userValid , groupValid} from "./../validation/index" ;
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/fb"
import initGooglePassport from "./../controllers/passportController/google";

initPassportLocal();
initPassportFacebook() ;
initGooglePassport();

let router = express.Router() ;

let initialRoutes = (app) =>{
  
  router.get("/login-register" , auth.checkLoggedOut , auth.getLoginRegister);
  
  router.post("/register" , auth.checkLoggedOut , authValid.register , auth.postRegister)
  router.get("/verify/:token" , auth.checkLoggedOut , auth.verifyAccount);
  
  router.post("/login" , auth.checkLoggedOut,  passport.authenticate("local" , {
    successRedirect : "/" , 
    failureRedirect : "/login-register" , 
    successFlash : true ,
    failureFlash : true 
  }))

  router.get("/auth/facebook", auth.checkLoggedOut , passport.authenticate("facebook" , { scope : ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut , passport.authenticate("facebook" , {
    successRedirect : "/" ,
    failureRedirect : "/login-register" 
  }))

  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google" , { scope : ["email"]}));
  router.get("/auth/google/callback",auth.checkLoggedOut,  passport.authenticate("google" , {
    successRedirect : "/" ,
    failureRedirect : "/login-register" 
  }))

  router.post("/forget" , auth.checkLoggedOut ,authValid.forget  , auth.postForgetPassword )
  router.get("/forget/:token" , auth.checkLoggedOut , auth.verifyPassword )

  router.put("/forget/get-password" , auth.checkLoggedOut, authValid.newPassword, auth.getPassword)

  router.get("/" , auth.checkLoggedIn ,  home.getHome);
  router.get("/logout" ,  auth.checkLoggedIn , auth.LogoutAccount) ;

  //resolve Contact fields
  router.get("/contact/find-user-contact/:keyword" , auth.checkLoggedIn , userValid.userContact , contact.findUsersConctact);
  router.post("/contact/add-new-contact" , auth.checkLoggedIn , contact.addNewContact);
  router.delete("/contact/delete-request-contact" , auth.checkLoggedIn , contact.removeRequestContact );
  router.get("/contact/read-more-request-contact-sent" , auth.checkLoggedIn , contact.readMoreRequestContactsSent);
  router.get("/contact/read-more-request-contact-received" , auth.checkLoggedIn , contact.readMoreRequestContactsReceived);
  router.delete("/contact/remove-request-contact-received" , auth.checkLoggedIn , contact.removeRequestContactsReceived);
  router.put("/contact/approve-request-contact-received" , auth.checkLoggedIn , contact.approveRequestContactReceived); 
  router.put("/contact/remove-contact" , auth.checkLoggedIn , contact.removeContacts)
  router.get("/contact/read-more-contacts" , auth.checkLoggedIn , contact.readMoreContacts);
  router.get("/contact/chat-with-user-from-contact-list" , auth.checkLoggedIn , contact.chatWithUserFromContactList) ; 
  router.get("/contact/get-conversation-from-navbar-search" , auth.checkLoggedIn , contact.getConversationFromNavbarSearch)
  router.post("/contact/add-new-contact-from-group-chat" , auth.checkLoggedIn , contact.addNewContactFromGroupChat) ; 
  router.delete("/contact/member-cancel-request-contact-sent" ,  auth.checkLoggedIn , contact.memberCancelRequestContactSent) ;
  router.put("/contact/approve-request-contact-from-member-in-group" , auth.checkLoggedIn , contact.approveRequestContactFromMemberInGroup) ;
  router.get("/contact/check-existed-contact" , auth.checkLoggedIn ,  contact.checkExistedContact);
  //resolve Notifications
  router.get("/contact/read-more-notification" , auth.checkLoggedIn , notification.readMoreNotification);
  router.put("/notification/mark-notification-as-read" , auth.checkLoggedIn , notification.markNotificationAsRead);
  router.put("/notification/read-status" , auth.checkLoggedIn , notification.readStatus );
  router.delete("/notification/remove-notification-read" , auth.checkLoggedIn , notification.removeNotificationsRead)

  router.put("/user/update-avatar" , auth.checkLoggedIn , user.updateAvatar);
  router.put("/user/update-info" , auth.checkLoggedIn , userValid.updateUserInfo , user.updateInfo) ;
  router.put("/user/update-password" , auth.checkLoggedIn , user.updatePassword );

  router.post("/message/add-new-text-emoji" , auth.checkLoggedIn , message.AddNewTextAndEmojiChat);
  router.post("/message/add-new-image-chat" , auth.checkLoggedIn , message.addNewImageChat );
  router.post("/message/add-new-attachment-chat" , auth.checkLoggedIn , message.addNewAttachmentChat) ; 
  router.get("/message/read-more-all-conversations" , auth.checkLoggedIn , message.readMoreAllConversations);
  router.get("/message/read-more-user-conversations" , auth.checkLoggedIn , message.readMoreUserConversations);
  router.get("/message/read-more-group-conversations" , auth.checkLoggedIn , message.readMoreGroupConversations);
  router.get("/message/read-more-messages" , auth.checkLoggedIn , message.readMoreMessages) ;
  router.get("/message/find-conversation-from-read-more-and-take-to-the-first-row" , auth.checkLoggedIn ,message.findConversationFromReadMoreAndTakeToTheFirstRow)

  router.get("/group-chat/find-friends" , auth.checkLoggedIn , groupChat.findFriends );
  router.post("/group-chat/create-new-group-chat" , auth.checkLoggedIn , groupValid.groupChatValidation , groupChat.createNewGroupChat );;
  router.get("/group-chat/find-more-friends-to-add-existed-group" , auth.checkLoggedIn , groupChat.findMoreFriendsToAddExistedGroup)
  router.put("/group-chat/add-more-members-into-group" ,auth.checkLoggedIn , groupChat.addMoreMembersIntoGroup );
  router.get("/group-chat/new-member-get-old-members-in-group" , auth.checkLoggedIn , groupChat.newMembergetAllMembersInGroup ); ;
  router.get("/group-chat/check-relationship-between-new-member-and-old-members" , auth.checkLoggedIn ,groupChat.checkRelationshipBetweenNewAndOldMembers);
  router.put("/group-chat/authorize-member-as-admin" , auth.checkLoggedIn , groupChat.authorizeMemberAsAdmin ) ;
  router.delete("/group-chat/remove-member-out-of-group" , auth.checkLoggedIn , groupChat.removeMemberOutOfGroup) ;
  router.delete("/group-chat/leave-group" , auth.checkLoggedIn , groupChat.leaveGroup );
  router.put("/group-chat/remove-admin-authorization" , auth.checkLoggedIn ,  groupChat.removeAdminAuthorization  );
  router.put("/group-chat/update-avatar-group" ,auth.checkLoggedIn , groupChat.updateAvatarGroup) ;
  router.put("/group-chat/update-name-group" , auth.checkLoggedIn , groupChat.updateNameGroup ) ; 
  router.get("/group-chat/check-last-update-group-profie" , auth.checkLoggedIn , groupChat.checkLastUpdateGroupProfile );;
  router.get("/group-chat/get-members-in-group-chat-modal" , auth.checkLoggedIn , groupChat.getMembersInGroupChatModal );
  return app.use("/" , router);
}

module.exports = initialRoutes;