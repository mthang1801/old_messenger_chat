import {groupChat} from "./../services/index";
import ejs from "ejs" ; 
import {promisify} from "util";
import {validationResult} from "express-validator/check";
import {bufferToBase64 , convertTimeOfLastMessage , lastItemOfArray , popupMessageTime} from "./../helpers/clientHelper" ;
import multer from "multer";
import {app} from "./../config/common"
import { transErrors } from "../../lang/vi";
import { rejects } from "assert";

const renderFile = promisify(ejs.renderFile).bind(ejs);
let findFriends = async (req , res )=> {
  try {
    let inputVal = req.query.inputVal ;

    let friendsList = await groupChat.findFriends(req.user._id , inputVal ) ;
    
    let usersList = await renderFile("src/views/main/groupChat/_addFriendsToGroupChat.ejs" , {usersList : friendsList})
    // console.log(usersList);
    return res.status(200).send({usersList : usersList });
  } catch (error) {
    return res.status(500).send(error) ;
  }
};

let createNewGroupChat = async (req , res) => {
  let errorsArr = [] ; 
  let validationErrors = validationResult(req); 
  if(!validationErrors.isEmpty()){
    console.log(validationErrors.mapped());
    let errors = Object.values(validationErrors.mapped()); 
    errors.forEach( error => {
      errorsArr.push(error.msg) ; 
    })
    return res.status(500).send(errorsArr);
  }
  try {
    let members = req.body.members ; 
    let groupName = req.body.groupName  ;
    let newGroup = await groupChat.createNewGroupChat(req.user._id , members , groupName );
    let dataToRender = {
      newGroup : newGroup.newGroupChat ,
      popupMessageTime : popupMessageTime ,
      membersInGroupChat : newGroup.membersInGroupChat,
      user : req.user
    }
    let avatarGroupModal = await renderFile("src/views/main/groupChat/avatar_group/avatarGroupModalAfterCreatingNewGroup.ejs",dataToRender);
    let membersInGroupModal = await renderFile("src/views/main/groupChat/membersInGroupModalAfterCreatingNewGroup/membersInGroupModalAfterCreatingNewGroup_From_Creator.ejs" , dataToRender);
    
    return res.status(200).send({
      newGroup : newGroup.newGroupChat ,
      avatarGroupModal : avatarGroupModal ,
      membersInGroupChat : newGroup.membersInGroupChat,
      membersInGroupModal : membersInGroupModal
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let findMoreFriendsToAddExistedGroup = async (req , res) => {
  try {
    let inputVal = req.query.inputVal;
    let groupId = req.query.groupId ;
    let friendsList = await groupChat.findMoreFriendsToAddExistedGroup(req.user._id , inputVal , groupId) ; 
    let usersList = await  renderFile("src/views/main/groupChat/_addFriendsToGroupChat.ejs" , {usersList : friendsList});
    return res.status(200).send({usersList : usersList});
  } catch (error) {
    return res.status(500).send(error) ;
  }
};

let addMoreMembersIntoGroup = async (req , res) => {
  try {
    let targetId = req.query.targetId ; 
    let groupId = req.query.groupId ;
    let newMemberInGroup = await groupChat.addMoreMembersIntoGroup(targetId , groupId) ;
    return res.status(200).send({
      success : !!newMemberInGroup ,
      memberInfor : newMemberInGroup.newMemberInfor ,
      groupInfor : newMemberInGroup.groupInfor
    });
    
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let newMembergetAllMembersInGroup = async (req, res) => {
  try {
    let memberId = req.query.memberId ; 
    let groupId = req.query.groupId ;

    let membersInGroup = await  groupChat.newMembergetAllMembersInGroup(memberId , groupId) ;
    let hostInfor = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/appendHostInforIntoGroupModal.ejs", { host : membersInGroup.hostInfor});
    let adminsInfor = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/appendAdminsInforIntoGroupModal.ejs" , {admins : membersInGroup.adminsInforWithContact});
    let membersInfor = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/appendMembersIntoGroupModal.ejs" , {members : membersInGroup.membersInforWithContact});
    let memberSelfInfor = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/appendMemberSelfIntoGroupModal.ejs" , {member : membersInGroup.memberSelfInfor});
    
    return res.status(200).send({
      hostInfor : hostInfor ,
      adminsInfor : adminsInfor, 
      membersInfor : membersInfor, 
      memberSelfInfor : memberSelfInfor
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let checkRelationshipBetweenNewAndOldMembers = async (req , res) => {
  try {
    let newMemberId = req.query.newMemberId ;
    let oldMemberId = req.query.oldMemberId ;
    let groupId = req.query.groupId ;
    
    let newMemberInfor = await groupChat.checkRelationshipBetweenNewAndOldMembers(newMemberId, oldMemberId , groupId);
    let dataToRender = {
      member : newMemberInfor.member , 
      user : newMemberInfor.user 
    }
    let memberInfor = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/appendNewMemberToOthersMember.ejs" , dataToRender );
    
    return res.status(200).send({newMember : memberInfor});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let authorizeMemberAsAdmin = async (req , res) => {
  try {
    let memberId = req.query.memberId ; 
    let groupId = req.query.groupId ; 
    
    let memberAfterAuthorizing = await groupChat.authorizeMemberAsAdmin(req.user._id , memberId , groupId) ;
    
    let newAdminRendering = await renderFile("src/views/main/groupChat/addMoreMemberIntoGroup/authorizeMemberAsAdmin.ejs" , {member : memberAfterAuthorizing.newAdmin});
    return res.status(200).send({
      newAdminRendering : newAdminRendering ,
      groupInfor : memberAfterAuthorizing.groupInfor,
      newAdmin : memberAfterAuthorizing.newAdmin
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeMemberOutOfGroup = async (req, res) => {
  try {
    let memberId = req.query.memberId ; 
    let groupId = req.query.groupId ;
    let afterRemoveMember = await groupChat.removeMemberOutOfGroup(req.user._id , memberId , groupId) ;
    return res.status(200).send({
      position : afterRemoveMember.position , 
      group : afterRemoveMember.groupInfor 
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let leaveGroup = async (req, res)=> {
  try {
     
    let groupId = req.query.groupId ;
    
    let memberAfterLeavingGroup = await groupChat.leaveGroup(req.user._id , groupId) ;
    return res.status(200).send({
      success : memberAfterLeavingGroup.success , 
      group : memberAfterLeavingGroup.group ,
      position : memberAfterLeavingGroup.position
    })
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let removeAdminAuthorization =async (req , res ) => {
  try {
    let memberId = req.query.memberId  ;
    let groupId = req.query.groupId ; 
    let memberAfterRemovingAdminAuthorization = await groupChat.removeAdminAuthorization(req.user._id , memberId , groupId) ;
    return res.status(200).send({
      success : memberAfterRemovingAdminAuthorization.success , 
      group : memberAfterRemovingAdminAuthorization.group 
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let avatarGroupStorage = multer.diskStorage({
  destination : (req, file , callback) => {
    callback(null, app.avatar_group_directory  );
  },
  filename : (req , file , callback) => {
    let fileMatch = app.avatar_group_type ;
    if(fileMatch.indexOf(file.mimetype) == -1 ){
      return callback(transErrors.avatar_type) ;
    }
    let avatarGroupName = `${Date.now()}-${file.originalname}`;
    callback(null , avatarGroupName) ;
  }
});

let uploadAvatarGroup = multer({
  storage : avatarGroupStorage , 
  limits : {fileSize : app.avatar_group_limit_size }
}).single("avatar-group") ;


let updateAvatarGroup = async (req , res) => {
  uploadAvatarGroup(req , res , async error => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(error) ;
    }
    try {
      let fileName = req.file.filename  ;
      let groupId = req.query.groupId ; 
      let updateGroup = await groupChat.updateAvatarGroup(req.user._id , fileName , groupId );
      return res.status(200).send({
        success : updateGroup.success , 
        group : updateGroup.group 
      })
    } catch (error) {
      return res.status(500).send(error);
    }
  })
};

let updateNameGroup = async (req , res) => {
  try {
    let groupName = req.body.name  ;
    let groupId = req.query.groupId ;
    let afterUpdatingNameGroup = await groupChat.updateNameGroup(req.user._id , groupName , groupId );
    return res.status(200).send({
      success : afterUpdatingNameGroup.success , 
      group : afterUpdatingNameGroup.group
    })
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};

let checkLastUpdateGroupProfile = async (req , res) => {
  try {
    let groupId = req.query.groupId ; 
    let result = await groupChat.checkLastUpdateGroupProfile(req.user._id , groupId) ;
    return res.status(200).send({group : result}) ;
  } catch (error) {
    return res.status(500).send(error);
  }
};

let getMembersInGroupChatModal = async ( req , res) => {
  try {
    let memberId = req.query.memberId ; 
    let groupId = req.query.groupId ;
    let getMembersInfor = await groupChat.getMembersInGroupChatModal(memberId , groupId );

    let dataToRender = {
      group : getMembersInfor.group ,
      host : getMembersInfor.hostInfor , 
      members : getMembersInfor.membersInforWithContact , 
      memberSelf : getMembersInfor.memberSelfInfor
    }
    let membersGroupChatModal = await renderFile("src/views/main/groupChat/membersInGroupModalAfterCreatingNewGroup/memberInGroupModalAfterCreatingNewGroup_From_members.ejs" , dataToRender);
    return res.status(200).send({
      membersGroupChatModal : membersGroupChatModal 
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findFriends : findFriends ,
  createNewGroupChat : createNewGroupChat , 
  findMoreFriendsToAddExistedGroup : findMoreFriendsToAddExistedGroup,
  addMoreMembersIntoGroup : addMoreMembersIntoGroup,
  newMembergetAllMembersInGroup : newMembergetAllMembersInGroup ,
  checkRelationshipBetweenNewAndOldMembers : checkRelationshipBetweenNewAndOldMembers ,
  authorizeMemberAsAdmin : authorizeMemberAsAdmin,
  removeMemberOutOfGroup : removeMemberOutOfGroup,
  leaveGroup : leaveGroup,
  removeAdminAuthorization : removeAdminAuthorization,
  updateAvatarGroup : updateAvatarGroup,
  updateNameGroup : updateNameGroup,
  checkLastUpdateGroupProfile : checkLastUpdateGroupProfile,
  getMembersInGroupChatModal : getMembersInGroupChatModal , 
}