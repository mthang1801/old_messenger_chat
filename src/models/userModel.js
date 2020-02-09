import mongoose from "mongoose" ;
import bcrypt from "bcrypt"; 
let Schema = mongoose.Schema ;

let userSchema = new Schema({
  username : String , 
  gender : {type : String ,  default : "Male"} , 
  phone : {type : String , default : null } ,
  address : {type : String ,  default : null } ,
  avatar : {type : String , default : "avatar-default.jpg"},
  local: {
    email : String ,
    password : String ,
    isActive : {type : Boolean , default : false } ,
    verifyToken : String 
  },
  facebook : {
    uid : String , 
    token : String ,
    email : String 
  },
  google : {
    uid : String , 
    token : String ,
    email : String 
  },
  createdAt : {type : Number , default : Date.now} ,
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null } 
})

userSchema.statics = {
  createNewUser(user){
    return this.create(user);
  },
  findUserByEmail(email){
    return this.findOne({"local.email" : email}).exec();
  },
  removeById(id){
    return this.findByIdAndRemove(id).exec();
  },
  verify(token){
    return this.findOneAndUpdate(
      {"local.verifyToken" : token} ,
      {"local.verifyToken" : null , "local.isActive" : true }
      ).exec();
  },
  findByToken(token){
    return this.findOne({"local.verifyToken" : token}).exec();
  },
  findUserById(id){
    return this.findById(id).exec() ;
  }, 
  findUserByUid(uid){
    return this.findOne({"facebook.uid" : uid}).exec();
  },
  findUserByGoogleUid(uid){
    return this.findOne({"google.uid" : uid}).exec() ;
  },
  updateUserAvatar(id , item){
    return this.findByIdAndUpdate(id , item).exec();
  },
  updateUserPassword(id , hashedPassword){
    return this.findByIdAndUpdate(id , {"local.password" : hashedPassword}).exec();
  },
  updatePassword( email , verifyToken){
    return this.findOneAndUpdate(
      {"local.email" : email} , 
      {"local.password" : verifyToken}).exec();
  },
  findUserByPasswordToken(token){
    return this.findOne({"local.password" : token}).exec();
  }, 
  updateTokenPasswordToNewPassword(token , newHashedPassword){
    return this.findOneAndUpdate(
      {"local.password" : token},
      {"local.password" : newHashedPassword}
    ).exec();
  },
  findUsersContact(deprecatedUsers , keyword){
    return this.find({
      $and : [
        {"_id" : {$nin : deprecatedUsers }} ,
        {"local.isActive" : true} ,
        {$or : [
          {"username" : {"$regex" : new RegExp (keyword , "i")}} , 
          {"local.email" : {"$regex" : new RegExp( keyword , "i")}} , 
          {"facebook.email" : {"$regex" : new RegExp( keyword , "i")}} , 
          {"google.email" : {"$regex" : new RegExp (keyword , "i")}} 
        ]}
      ]
    }, {username : 1 , avatar : 1 , address : 1 , _id : 1}).exec();
  },
  findUsersNormalById(id){
    return this.findById(id , { _id : 1 , username : 1 , avatar : 1 , gender: 1 , phone : 1 , address : 1 }).exec();
  },
  findUsersList(listArray){
    return this.find({
      $and : [
        {"_id" : {$in : listArray}} ,
        {"local.isActive" : true } 
      ]
    }, { _id : 1 , username : 1 , avatar : 1 , phone : 1 , address : 1 , gender : 1 }).exec();
  },
  findUserByInputValue(userId , inputValue){
    return this.find({
      $and : [
        {"_id" : {$ne : userId}} ,
        {"local.isActive" : true } ,
        {$or : [
          {"username" : {"$regex" : new RegExp( inputValue , "i")}} ,
          {"local.email" : {"$regex" : new RegExp( inputValue , "i")}} ,
          {"google.email" : {"$regex" : new RegExp (inputValue , "i")}} , 
          {"facebook.email" : {"$regex" : new RegExp( inputValue , "i")}}
        ]}
      ]
    }, {_id : 1 }).exec();
  },
  findMembersByIdList(listId){
    return this.find({
      "_id" : { $in :  listId}
    } ,{username : 1 , address : 1 , avatar : 1 , phone :1  , gender : 1 }).exec();
  },
  findFriendsExceptMembersListAndKeyWord(membersList , inputValue){
    return this.find({
     $and : [
      {"_id" : {$nin : membersList}} ,
      {"local.isActive" : true} ,
      {$or :[
        {"username" : {"$regex" : new RegExp (inputValue , "i")}} ,
        {"local.email" : {"$regex" : new RegExp( inputValue , "i")}} ,
        {"google.email" : {"$regex" : new RegExp (inputValue , "i")}} , 
        {"facebook.email" : {"$regex" : new RegExp( inputValue , "i")}}
      ]}
     ]
    }, { _id: 1}).exec();
  }
}

userSchema.methods = {
  comparePassword(password){
    return bcrypt.compareSync(password , this.local.password);
  }
}
module.exports = mongoose.model("user" , userSchema)
