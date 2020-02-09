import userModel from "./../models/userModel" ;
import messageModel from "./../models/messageModel" ;
import chatGroupModel from "./../models/chatGroupModel"; 
import contactModel from "./../models/contactModel" ; 
import fsExtra, { unwatchFile } from "fs-extra";
import _ from "lodash";

let findFriends = (currentUserId , inputVal ) =>{
  return new Promise( async (resolve , reject) => {
    try {
     currentUserId = currentUserId.toString();
      //step01 : get id of users except currentUserId 
      let resultFromServer = await userModel.findUserByInputValue( currentUserId , inputVal );
      resultFromServer = _.map(resultFromServer , item => item._id.toString());
      
      
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

let createNewGroupChat = (currentUserId , members , groupName) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      currentUserId = currentUserId.toString();
      members.unshift({userId : currentUserId});

      let newGroupItem = {
        name : groupName ,
        userAmount : members.length ,
        userId : currentUserId , 
        administrators : [ {userId : currentUserId }] ,
        members : members 
      }
      let newGroup = await chatGroupModel.createNew(newGroupItem);

      let membersId = newGroup.members.map (member => {
        return member.userId;
      });
      
      let membersInforInGroup = await userModel.findMembersByIdList(membersId);

      membersInforInGroup.forEach( (memberInfor , index ) => {
        if(index != 0 && memberInfor._id == currentUserId){
          membersInforInGroup.splice(index , 1 ); 
          membersInforInGroup.unshift(memberInfor) ;
        }
      });

      let membersInforWithCheckContactPromise=  membersInforInGroup.map(async member =>{
        member = member.toObject() ; 
        let checkContactTrue = await contactModel.checkContactStatusTrue(currentUserId , member._id) ; 
        let isFriend = 0; 
        if(checkContactTrue.length){
          isFriend = 1 ;
        }
        let checkContactFalse = await contactModel.checkContactStatusFalse(currentUserId , member._id) ;
        if(checkContactFalse.length){
          isFriend = -1 ;
        }
        member.isFriend = isFriend ; 
        let isSender = false ; 
        let checkSender = await contactModel.checkIsSenderContact(currentUserId , member._id );
        if(checkSender.length){
          isSender = true ; 
        }
        member.isSender = isSender ;

        member._id = member._id.toString();
        return member ; 
      })
      
      let  membersInforWithCheckContact = await Promise.all(membersInforWithCheckContactPromise);

      resolve({
        newGroupChat : newGroup , 
        membersInGroupChat : membersInforWithCheckContact 
      });
    } catch (error) {
      reject(error) ;
    }
  })
};

let getAllMembersInGroup = (currentUserId) => {
  return new Promise( async  (resolve,  reject) => {
    try {
      currentUserId = currentUserId.toString();
      let groupsChatList = await chatGroupModel.findAllInforGroupsChatByUserId(currentUserId) ;
      let membersInforPromise = groupsChatList.map( async groupChat => {
        groupChat = groupChat.toObject();

        let membersId = groupChat.members.map (member => {
          return member.userId;
        })
        
        let membersInforInGroup = await userModel.findMembersByIdList(membersId);
        //đưa thông tin bản thân lên trên đầu tiên
       
        membersInforInGroup.forEach( (memberInfor , index ) => {
          if(index != 0 && memberInfor._id == currentUserId){
            membersInforInGroup.splice(index , 1 ); 
            membersInforInGroup.unshift(memberInfor) ;
          }
        })
        
        let membersInforWithCheckContactPromise=  membersInforInGroup.map(async member =>{
          member = member.toObject() ; 
          let checkContactTrue = await contactModel.checkContactStatusTrue(currentUserId , member._id) ; 
          let isFriend = 0; 
          if(checkContactTrue.length){
            isFriend = 1 ;
          }
          let checkContactFalse = await contactModel.checkContactStatusFalse(currentUserId , member._id) ;
          if(checkContactFalse.length){
            isFriend = -1 ;
          }
          

          member.isFriend = isFriend ; 
          let isSender = false ; 
          let checkSender = await contactModel.checkIsSenderContact(currentUserId , member._id );
          if(checkSender.length){
            isSender = true ; 
          }
          member.isSender = isSender ;

          member._id = member._id.toString();
          let checkAdmin = await chatGroupModel.checkIsAdmin(member._id , groupChat._id ) ;
          let isAdmin = false  ;
          if(checkAdmin.length){
            isAdmin = true ; 
          }
          
          member.isAdmin = isAdmin  ;
          
          let checkHost = await chatGroupModel.checkIsHost(member._id , groupChat._id );
          let isHost = false; 
          if(checkHost.length){
            isHost = true; 
          }
          member.isHost = isHost ;
          return member ; 
        }) 
        let  membersInforWithCheckContact = await Promise.all(membersInforWithCheckContactPromise);
        
        groupChat.membersInfor = membersInforWithCheckContact ;
        
        return groupChat;
      })
      
      resolve(await Promise.all(membersInforPromise) )

    } catch (error) {
      reject(error) ; 
    }
  })
};

let findMoreFriendsToAddExistedGroup = (currentUserId , inputVal , groupId) => {
  return new Promise(async (resolve , reject ) => {
    try {
      let getMembersFromGroup = await chatGroupModel.getMembersId(groupId);
      let membersListFromGroup = getMembersFromGroup[0].members.map( member => {
        return member.userId;
      })
      let resultFromServer = await userModel.findFriendsExceptMembersListAndKeyWord(membersListFromGroup , inputVal); 
      
      resultFromServer = _.map(resultFromServer, item => item._id.toString());
      
      let usersContactListPromise = resultFromServer.map( async contactId => {
        let checkContact = await contactModel.checkContactStatusTrue(currentUserId , contactId ); 
        if(checkContact.length){
          let user = await userModel.findUsersNormalById(contactId) ;
          return user ; 
        }
        return null ;
      })
      let usersContactList = await  Promise.all(usersContactListPromise);
      usersContactList = _.filter( usersContactList , item => item != null )
      resolve(usersContactList);
    } catch (error) {
      reject(error);
    }
  })
};

let addMoreMembersIntoGroup = (targetId , groupId ) => {
  return new Promise( async (resolve , reject) => {
    try {
      let pushToGroup = await chatGroupModel.pushNewUserIntoGroup(targetId , groupId);
      if(pushToGroup.nModified == 0){
        return reject(false);
      }
      let newMemberInfor = await userModel.findUsersNormalById(targetId); 
      let groupInfor = await chatGroupModel.getGroupInfor(groupId);

     
      resolve({
        newMemberInfor : newMemberInfor ,
        groupInfor : groupInfor
      }) ;
    } catch (error) {
      reject(error) ; 
    }
  })
};

let newMembergetAllMembersInGroup = (memberId , groupId )=> {
  return new Promise( async(resolve , reject) => {
    try {
      let getIdMembersFromServer = await chatGroupModel.getMembersId(groupId);
      let getIdAdminsFromServer = await chatGroupModel.getAdminsId(groupId);
      let getIdHostFromServer = await chatGroupModel.getHostId(groupId);
      
      let hostId = getIdHostFromServer[0].userId.toString();
      let deprecated = _.map(getIdAdminsFromServer.administrators , item => item.userId.toString() );
      let adminsId = _.filter(getIdAdminsFromServer.administrators , item => item.userId.toString() != hostId );  
      adminsId = _.map( adminsId , item => item.userId) ; 
      let membersId = _.map( getIdMembersFromServer[0].members , item => item.userId.toString()) ;
      membersId = _.filter( membersId , item => {
        if(deprecated.indexOf(item) == -1 && memberId != item){
          return item;
        }
      
      }) ; 
      // step01: get host infor and related with him/her
      //get host infor
      let hostInfor = await userModel.findUsersNormalById(hostId) ;
      hostInfor = hostInfor.toObject();
      hostInfor.groupId = groupId;
      //check contact 
      let contactWithHost = await contactModel.checkContactStatusTrue(memberId , hostId) ;
      hostInfor.isFriend = 0; 
      if(contactWithHost.length){
        hostInfor.isFriend = 1 ;
      }
      let checkContactFalse = await contactModel.checkContactStatusFalse(memberId , hostId) ;
      if(checkContactFalse.length){
        hostInfor.isFriend = -1 ;
      }

      let isSender = false ; 
      let checkSender = await contactModel.checkIsSenderContact(memberId , hostId );
      if(checkSender.length){
        isSender = true ; 
      }
      hostInfor.isSender = isSender ;

      //step02: get admins infor and related with them
      //get infor admins
     let adminsInfor = await userModel.findMembersByIdList(adminsId);
      //get related with admins
     let adminsInforWithContactPromise = adminsInfor.map( async admin =>{
       admin = admin.toObject() ; 
       admin.isFriend = 0 ;
       let checkContact = await contactModel.checkContactStatusTrue(memberId , admin._id ) ; 
       if(checkContact.length){
         admin.isFriend = 1 ; 
       }
      let checkContactFalse = await contactModel.checkContactStatusFalse(memberId , admin._id) ;
      if(checkContactFalse.length){
        admin.isFriend = -1 ;
      }

      let isSender = false ; 
      let checkSender = await contactModel.checkIsSenderContact(memberId , admin._id  );
      if(checkSender.length){
        isSender = true ; 
      }
      admin.isSender = isSender ;
       admin.groupId = groupId ; 
       return admin ; 
     })

      let adminsInforWithContact = await Promise.all(adminsInforWithContactPromise) ;
     
      //step03: get normal members and related with them
      //get members infor
      let membersInfor = await userModel.findMembersByIdList(membersId) ;
      //get related with members
      let membersInforWithContactPromise= membersInfor.map( async member => {
        member = member.toObject() ; 
        let checkContact = await contactModel.checkContactStatusTrue(memberId , member._id ) ;
        member.isFriend = 0 ; 
        if(checkContact.length){
          member.isFriend = 1 ; 
        }
        let checkContactFalse = await contactModel.checkContactStatusFalse(memberId , member._id) ;
        if(checkContactFalse.length){
          member.isFriend = -1 ;
        }

        let isSender = false ; 
        let checkSender = await contactModel.checkIsSenderContact(memberId , member._id );
        if(checkSender.length){
          isSender = true ; 
        }
        member.isSender = isSender ;
        member.groupId = groupId ;
        return member; 
      })

      let membersInforWithContact = await  Promise.all(membersInforWithContactPromise);
      
      //step04 : get member-self 
      let memberSelfInfor = await  userModel.findUsersNormalById(memberId) ;
      memberSelfInfor = memberSelfInfor.toObject();
      memberSelfInfor.groupId = groupId;
      resolve({
        hostInfor : hostInfor , 
        adminsInforWithContact : adminsInforWithContact , 
        membersInforWithContact : membersInforWithContact, 
        memberSelfInfor : memberSelfInfor ,
      })

    } catch (error) {
      reject(error);
    }
  })
};

let checkRelationshipBetweenNewAndOldMembers = (newMemberId , oldMemberId , groupId ) => {
  return new Promise (async (resolve,  reject ) => {
    try {
      let member = await userModel.findUsersNormalById(newMemberId) ;
      member = member.toObject();
      member.groupId = groupId;
      //check contact 
      let contactWithNewMember = await contactModel.checkContactStatusTrue(oldMemberId , newMemberId) ;
      member.isFriend = 0; 
      if(contactWithNewMember.length){
        member.isFriend = 1 ;
      }
      let checkContactFalse = await contactModel.checkContactStatusFalse(oldMemberId , newMemberId) ;
      if(checkContactFalse.length){
        member.isFriend = -1 ;
      }

      let isSender = false ; 
      let checkSender = await contactModel.checkIsSenderContact(oldMemberId , newMemberId );
      if(checkSender.length){
        isSender = true ; 
      }
      member.isSender = isSender ;
      member.contactId = oldMemberId;

      //find old member position in group
      let checkAdmin = await chatGroupModel.checkIsAdmin(oldMemberId , groupId);
      let isAdmin = false  ;
      if(checkAdmin.length){
        isAdmin = true ; 
      }
      let oldMember = {} ; 
      oldMember._id = oldMemberId ; 
      oldMember.isAdmin = isAdmin ;
      
      let checkHost = await chatGroupModel.checkIsHost( oldMemberId , groupId );
      let isHost = false; 
      if(checkHost.length){
        isHost = true; 
      }
      oldMember.isHost = isHost ;
      resolve({
        member : member , 
        user : oldMember
      });
    } catch (error) {
      reject(error)
    }
  })
};

let authorizeMemberAsAdmin = (userId , memberId , groupId ) => {
  return new Promise( async (resolve,  reject ) => {
    try {
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId) ;
      if(checkUserIsHost.length){
        let updateAdmin = await chatGroupModel.updateMemberAsAdmin(memberId , groupId) ;
        if(updateAdmin.nModified == 0){
          return reject(false);
        }
        let newAdmin= await userModel.findUsersNormalById(memberId) ; 
        newAdmin =  newAdmin.toObject();

        let checkContact = await contactModel.checkContactStatusTrue(userId , memberId) ; 
        if(checkContact.length){
          newAdmin.isFriend = 1 ; 
        }
        let checkContactFalse = await contactModel.checkContactStatusFalse(userId , memberId) ;
        if(checkContactFalse.length){
          newAdmin.isFriend = -1 ;
        }
        let isSender = false ; 
        let checkSender = await contactModel.checkIsSenderContact(userId , memberId );
        if(checkSender.length){
          isSender = true ; 
        }
        newAdmin.isSender = isSender ;
        newAdmin.groupId = groupId ;

        let groupInfor = await chatGroupModel.getGroupInfor(groupId);
        resolve({
          newAdmin : newAdmin , 
          groupInfor : groupInfor
        });
      } 
    } catch (error) {
      reject(error);
    }
  })
};

let removeMemberOutOfGroup = (userId , memberId , groupId) => {
  return new Promise(async (resolve ,  reject ) => {
    try {
      let groupInfor = await chatGroupModel.getGroupInfor(groupId);
      let checkUserIsHost= await chatGroupModel.checkIsHost(userId , groupId) ; 
      // userId là host
      if(checkUserIsHost.length){
        let checkMemberIsAdmin = await chatGroupModel.checkIsAdmin(memberId , groupId) ;
        //Kiểm tra member co la admin hay ko , nếu là admin thì pull cả member lẫn admin
        if(checkMemberIsAdmin.length){
          let removeAdminOutOfGroup = await chatGroupModel.removeAdminOutOfGroup( memberId , groupId);
          if(removeAdminOutOfGroup.nModified == 0){
            return reject(false);
          }
          return resolve({ position : "member-is-admin" , groupInfor : groupInfor });
        }
        let removeMember = await chatGroupModel.removeMemberOutOfGroup(memberId , groupId );
        if(removeMember.nModified == 0){
          return reject(false);
        }
        return resolve({ position : "member-is-normal" , groupInfor : groupInfor });
      }
      let checkUserIsAdmin = await chatGroupModel.checkIsAdmin(userId , groupId);
      if(!checkUserIsAdmin.length){
        return reject(false);
      }
      let removeMember = await chatGroupModel.removeMemberOutOfGroup(memberId , groupId );
      if(removeMember.nModified == 0){
        return reject(false);
      }
      resolve({ position : "member-is-normal" , groupInfor : groupInfor });
    } catch (error) {
      reject(error) ;
    }
  })
};

let leaveGroup = (userId , groupId) => {
  return new Promise ( async (resolve , reject) => {
    try {
      let groupInfor = await chatGroupModel.getGroupInfor(groupId);
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId);
      if(checkUserIsHost.length){
        return reject(false);
      }
      let position = "member-is-normal" ;
      let checkUserIsAdmin = await chatGroupModel.checkIsAdmin(userId , groupId ) ;
      if(checkUserIsAdmin.length){
        position = "member-is-admin";
      }
      let removeUser = await chatGroupModel.removeUserOutOfData(userId ,groupId) ;
      if(removeUser.nModified == 0 ){
        return reject(false);
      }
      resolve({
        success : true , 
        group : groupInfor ,
        position : position
      })
    } catch (error) {
      reject(error) ; 
    }
  })
};

let removeAdminAuthorization = (userId , memberId ,  groupId) => {
  return new Promise( async (resolve , reject ) => {
    try {

      let groupInfor = await chatGroupModel.getGroupInfor(groupId); 
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId) ; 
     
      if(!checkUserIsHost.length){
        return reject(false);
      }
      let removeAdminAuthorization = await chatGroupModel.removeAdminAuthorization(memberId , groupId );
      console.log(removeAdminAuthorization);
      if(removeAdminAuthorization.nModified == 0){
        return reject(false);
      }
      resolve({
        success : true , 
        group : groupInfor
      })
    } catch (error) {
      reject(error) ;
    }
  })
};

let updateAvatarGroup = (userId , fileName , groupId ) => {
  return new Promise( async (resolve ,reject ) => {
    try {
      //check user is host
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId ); 
      if(!checkUserIsHost.length){
        return reject(false);
      }
      let updateAvatar = await chatGroupModel.updateAvatarGroup(fileName , groupId );
      if(updateAvatarGroup.nModified == 0){
        return reject(false);
      }
      let groupInfor = await chatGroupModel.getGroupInfor(groupId);
      resolve({
        success : true ,
        group : groupInfor 
      })
    } catch (error) {
      reject(error) ; 
    }
  })
};

let updateNameGroup = (userId , groupName , groupId ) =>{
  return new Promise ( async (resolve , rejecet) => {
    try {
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId );
      if(!checkUserIsHost.length){
        return reject(false);
      }
      let updateName = await chatGroupModel.updateNameGroup(groupName , groupId );
      if(updateName.nModified == 0){
        return reject(false);
      }
      let groupInfor = await chatGroupModel.getGroupInfor(groupId);
      resolve({
        success : true , 
        group : groupInfor
      })
    } catch (error) {
      reject(error);
    }
  })
};

let checkLastUpdateGroupProfile = (userId , groupId ) => {
  return new Promise( async (resolve , reject) => {
    try {
      let checkUserIsHost = await chatGroupModel.checkIsHost(userId , groupId);
      if(!checkUserIsHost.length){
        return reject(false );
      }
      let groupInfor = await  chatGroupModel.getGroupInfor(groupId);
      resolve(groupInfor);
    } catch (error) {
      reject(error) ; 
    }
  })
};

let getMembersInGroupChatModal = (memberId , groupId) => {
  return new Promise(async  (resolve , reject ) => {
    try {
      let getMembersIdInGroup = await chatGroupModel.getMembersId(groupId);
      let hostIdInGroup = await chatGroupModel.getHostId(groupId) ;

      let hostId= hostIdInGroup[0].userId  ; 
      let membersIdInGroup = _.filter( getMembersIdInGroup[0].members , item => item.userId != hostId && item.userId != memberId );
      let membersId = _.map( membersIdInGroup , item => item.userId.toString() );
      
      //get host infor
      let hostInfor = await userModel.findUsersNormalById(hostId) ;
      hostInfor = hostInfor.toObject();
      hostInfor.groupId = groupId;
      //check contact 
      let contactWithHost = await contactModel.checkContactStatusTrue(memberId , hostId) ;
      hostInfor.isFriend = 0; 
      if(contactWithHost.length){
        hostInfor.isFriend = 1 ;
      }
      let checkContactFalse = await contactModel.checkContactStatusFalse(memberId , hostId) ;
      if(checkContactFalse.length){
        hostInfor.isFriend = -1 ;
      }

      let isSender = false ; 
      let checkSender = await contactModel.checkIsSenderContact(memberId , hostId );
      if(checkSender.length){
        isSender = true ; 
      }
      hostInfor.isSender = isSender ;

      //get members infor
      let membersInfor = await userModel.findMembersByIdList(membersId) ;
      let membersInforWithContactPromise= membersInfor.map( async member => {
        member = member.toObject() ; 
        let checkContact = await contactModel.checkContactStatusTrue(memberId , member._id ) ;
        member.isFriend = 0 ; 
        if(checkContact.length){
          member.isFriend = 1 ; 
        }
        let checkContactFalse = await contactModel.checkContactStatusFalse(memberId , member._id) ;
        if(checkContactFalse.length){
          member.isFriend = -1 ;
        }

        let isSender = false ; 
        let checkSender = await contactModel.checkIsSenderContact(memberId , member._id );
        if(checkSender.length){
          isSender = true ; 
        }
        member.isSender = isSender ;
        member.groupId = groupId ;
        return member; 
      })

      let membersInforWithContact = await  Promise.all(membersInforWithContactPromise);

      //get self infor
      let memberSelfInfor = await  userModel.findUsersNormalById(memberId) ;
      memberSelfInfor = memberSelfInfor.toObject();
      memberSelfInfor.groupId = groupId;
      
      //get group Infor 
      let groupInfor = await chatGroupModel.getGroupInfor(groupId) ;
      resolve({
        group : groupInfor ,
        hostInfor : hostInfor , 
        membersInforWithContact : membersInforWithContact, 
        memberSelfInfor : memberSelfInfor ,
      })
    } catch (error) {
      reject(error);
    }
  })  
}

module.exports = {
  findFriends : findFriends,
  createNewGroupChat : createNewGroupChat ,
  getAllMembersInGroup : getAllMembersInGroup ,
  findMoreFriendsToAddExistedGroup : findMoreFriendsToAddExistedGroup,
  addMoreMembersIntoGroup : addMoreMembersIntoGroup,
  newMembergetAllMembersInGroup : newMembergetAllMembersInGroup ,
  checkRelationshipBetweenNewAndOldMembers : checkRelationshipBetweenNewAndOldMembers,
  authorizeMemberAsAdmin : authorizeMemberAsAdmin,
  removeMemberOutOfGroup : removeMemberOutOfGroup,
  leaveGroup : leaveGroup,
  removeAdminAuthorization : removeAdminAuthorization,
  updateAvatarGroup : updateAvatarGroup,
  updateNameGroup : updateNameGroup, 
  checkLastUpdateGroupProfile : checkLastUpdateGroupProfile,
  getMembersInGroupChatModal : getMembersInGroupChatModal
}