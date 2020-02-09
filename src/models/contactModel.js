import mongoose from "mongoose" ;


let Schema = mongoose.Schema;  

let contactSchema = new Schema({
  userId : String ,
  contactId : String , 
  status : {type : Boolean , default : false } , 
  createdAt : {type : Number , default : Date.now } ,
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null } 
})

contactSchema.statics = {
  createNew(item){
    return this.create(item) ;
  },
  findUserIdContacts(userId){
    return this.find({
      $or : [
        {"userId" : userId} , 
        {"contactId" : userId}
      ]
    }).exec();
  },
  checkContactExists(userId , contactId){
    return this.findOne({
      $or : [
        {$and : [
          {"userId" : userId} ,
          {"contactId" : contactId}
        ]},
        {$and : [
          {"userId" : contactId} , 
          {"contactId" : userId}
        ]}
      ]
    }).exec();
  },
  removeRequestContact(userId , contactId){
    return this.remove({
      $and : [
        {"userId" : userId} , 
        {"contactId" : contactId} ,
        {"status" : false}
      ]
    }).exec();
  },
  getContactSent(userId , limit){
    return this.find({"userId" : userId}).sort({"createdAt" : -1}).limit(limit).exec();
  },
  countContactSent(userId){
    return this.count({
      $and : [
        {"userId" : userId} , 
        {"status" : false } 
      ]
    }).exec();
  },
  readMoreRequestContactsSent(userId , skip, limit){
    return this.find({
      $and : [
        {"userId" : userId} , 
        {"status" : false}
      ]
    }).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
  },
  getContactsReceived(userId , limit) {
    return this.find({
      $and : [
        {"contactId" : userId} ,
        {"status" : false}
      ]
    }).sort({"createdAt" : -1}).limit(limit).exec();
  },
  countContactsReceived(userId){
    return this.count({
      $and : [
        {"contactId" : userId}  , 
        {"status" : false}
      ]
    }).exec();
  },
  readMoreRequestContactsReceived(userId , skip , limit){
    return this.find({
      $and : [
        {"contactId" : userId},
        {"status" : false }
      ]}).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
  },
  removeRequestContactsReceived(userId , contactId){
    return this.remove({
      $and : [
        {"userId" : contactId } , 
        {"contactId" : userId } , 
        {"status" : false }
      ]
    }).exec() ; 
  },
  approveRequestContactReceived(userId , contactId){
    return this.update({
      $and : [
        {"userId" : contactId } , 
        {"contactId" : userId} ,
        {"status" : false }
      ]
    }, {"status" : true , "updatedAt" : Date.now()}).exec();
  },
  getUsersContact(userId, limit){
    return this.find({
      $and : [
        {$or : [
          {"userId" : userId} ,
          {"contactId" : userId} 
        ]},
        {"status" : true}
      ]
    }).sort({"updatedAt" : -1}).limit(limit).exec();
  },
  getMoreContactsPersonal(userId , skipPersonal , limit){
    return this.find({
      $and : [
        {$or : [
          {"userId" : userId} , 
          {"contactId" : userId}
        ]} , 
        {"status" : true }
    ]
    }).sort({"updatedAt" : -1}).skip(skipPersonal).limit(limit).exec();
  },
  countUsersContact(userId){
    return this.count({
      $and : [
        {$or : [
          {"userId" : userId} ,
          {"contactId" : userId}
        ]},
        {"status" : true }
      ]
    }).exec();
  },
  readMoreContacts(userId , skip , limit){
    return this.find({
      $and : [
        {$or : [
          {"userId" : userId} ,
          {"contactId" : userId} 
        ]},
        {"status" : true }
      ]
    }).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
  },
  removeContacts(userId , contactId){
    return this.remove({
      $or : [
        {$and : [
          {"userId" : userId} ,
          {"contactId" : contactId},
          {"status" : true }
        ]},
        {$and : [
          {"userId" : contactId} ,
          {"contactId" : userId},
          {"status" : true }
        ]}
      ]
    }).exec();
  },
  checkContact(userId , contactId){
    return this.find({
      $and : [
        {"userId" : contactId} , 
        {"contactId" : userId} ,
        {"status" : true }
      ]
    }).exec();
  },
  updateTimeWhenHasNewMessage(userId , contactId){
    return this.update({
      $or : [
        {$and : [
          {"userId" : userId} , 
          {"contactId" : contactId} 
        ]},
        {$and : [
          {"userId" : contactId} , 
          {"contactId" : userId} 
        ]}
      ]
    } , {"updatedAt" : Date.now()}).exec();
  },
  checkContactStatusTrue(userId , contactId){
    return this.find({
      $or : [
        {$and : [
          {"userId" : userId} , 
          {"contactId" : contactId } ,
          {"status" : true }
        ]},
        {$and : [
          {"userId" : contactId} , 
          {"contactId" : userId } ,
          {"status" : true }
        ]}
      ]
    }).exec();
  }, 
  checkContactStatusFalse(userId , contactId ){
    return this.find({
      $or : [
        {$and : [
          {"userId" : userId} , 
          {"contactId" : contactId } ,
          {"status" : false }
        ]},
        {$and : [
          {"userId" : contactId} , 
          {"contactId" : userId } ,
          {"status" : false }
        ]}
      ]
    }).exec();
  },
  checkIsSenderContact(userId , contactId){
    return this.find({
      $and : [
        {"userId" : userId } ,
        {"contactId" : contactId}
      ]
    }).exec();
  }
}
module.exports = mongoose.model("contact" , contactSchema ) ;
