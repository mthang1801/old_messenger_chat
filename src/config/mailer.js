import  nodemailer from "nodemailer";

let adminEmail = process.env.EMAIL_USER;
let adminPassword = process.env.EMAIL_PASSWORD ; 
let emailHost = process.env.EMAIL_HOST; 
let emailPort = process.env.EMAIL_PORT ; 

let sendEmail = (to_email , subject ,  contentHTML) => {
  let transporter = nodemailer.createTransport({
    host : emailHost , 
    port : emailPort , 
    secure : false ,
    auth : {
      user : adminEmail , 
      pass : adminPassword 
    }
  })

  let options = {
    from : adminEmail , 
    to : to_email , 
    subject : subject , 
    html : contentHTML 
  }

  return transporter.sendMail(options) ; 
}

module.exports = sendEmail ;