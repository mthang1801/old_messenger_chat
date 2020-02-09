import {notification} from "./../services/index"
let readMoreNotification = async (req , res) =>{
  try {
    let skipNumber = +req.query.skipNumber  ;
    let currentUserId = req.user._id ; 
    
    let moreNorifications = await notification.readMoreNotification(currentUserId , skipNumber);
    return res.status(200).send(moreNorifications);
  } catch (error) {
    return res.status(500).send(error);
  }

}

let markNotificationAsRead =async (req , res) => {
  try {
    let targetUsers = req.body.targetUsers; 
    let markAsRead = await notification.markNotificationAsRead(req.user._id , targetUsers);
    
    return res.status(200).send({success : !!markAsRead});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readStatus = async (req , res) => {
  try {
    let getUser = await notification.readStatus(req.user._id , req.body.uid , req.body.notifUID );
    return res.status(200).send(getUser);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let removeNotificationsRead =async (req , res )=> {
  try {
    let removeSuccess = await notification.removeNotificationsRead(req.user._id ) ;
    return res.status(200).send({success: !!removeSuccess});
  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  readMoreNotification: readMoreNotification,
  markNotificationAsRead : markNotificationAsRead,
  readStatus : readStatus,
  removeNotificationsRead : removeNotificationsRead
}