import addNewContact from "./contacts/addNewContact";
import removeRequestContact from "./contacts/removeRequestContact"
import removeRequestContactsReceived from "./contacts/removeRequestContactReceived";
import approveRequestContactReceived from "./contacts/approveRequestContactReceived";
import removeContact from "./contacts/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
import chatAttachment from "./chat/chatAttachment";
import videoChat from "./chat/videoChat" ;
import newConversationFromReadMore from "./chat/newConversationFromReadMore";
import userOnlineOffline from "./status/userOnlineOffline";
import newGroupChat from "./group/newGroupChat";
import addFriendIntoGroupChat from "./group/addFriendIntoGroupChat";
import newMemberJoinGroup from "./group/newMemberJoinGroupChat";
import authorizeNewAdmin from "./group/authorizeNewAdmin";
import removeMemberOutOfGroup from "./group/removeMemberOutOfGroup" ;
import leaveGroup from "./group/leaveGroup";
import removeAdminAuthorization from "./group/removeAdminAuthorization";
import updateAvatarGroup from "./group/updateAvatarGroup";
import updateNameGroup from "./group/updateNameGroup";
let initSocketsIO = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  removeRequestContactsReceived(io);
  approveRequestContactReceived(io);
  removeContact(io);
  chatTextEmoji(io) ; 
  typingOn(io);
  typingOff(io);
  chatImage(io) ; 
  chatAttachment(io) ;
  videoChat(io) ;
  userOnlineOffline(io) ; 
  newGroupChat(io) ;
  addFriendIntoGroupChat(io);
  newMemberJoinGroup(io);
  authorizeNewAdmin(io);
  removeMemberOutOfGroup(io);
  leaveGroup(io);
  removeAdminAuthorization(io);
  updateAvatarGroup(io);
  updateNameGroup(io);
  newConversationFromReadMore(io);
}

module.exports = initSocketsIO ; 