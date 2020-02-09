import passportSocketIO from "passport.socketio";

let configSocketIO = (io , cookieParser , sessionStore ) => {
  io.use(passportSocketIO.authorize({
    cookieParser : cookieParser ,
    key : process.env.SESSION_KEY ,
    secret : process.env.SESSION_SECRET , 
    store : sessionStore, 
    success : (data , accept) => {
      if(!data.user.logged_in){
        return accept("Invalid user" , false ) ;
      }
      return accept(null , true);
    },
    fail : (data, message ,error , accept) => {
      if(error){
        console.log(message);
        return accept(new Error(message) , false);
      }
    }
  }))
}

module.exports = configSocketIO; 