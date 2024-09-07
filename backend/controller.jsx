const twilio = require('twilio');
const nodemailer = require('nodemailer');
require('dotenv').config();
const localStorage = require('localstorage');
const cloudinary = require('cloudinary').v2;

let coderotp=0;

console.log(process.env.AUTH_SID);

//PHONE OTP SENDER

const sendVerificationCode = async(req, res) =>{
    const codegenerator = Math.floor(Math.random()*10000);
  
    coderotp=codegenerator;

    const {phone_number} = req.body;

    const client =  new twilio(process.env.AUTH_SID,process.env.AUTH_TOKEN);
    
   
  client.messages.create({body:`This is an verification of OTP & Do Not share to any one ${codegenerator} `,from:"+18563814260",to:`${phone_number}`})
  .then((res1)=>{
    if(res1.status == 'queued'){
        return res.status(200).json(client.body);
    }
    else{
        return res.status(400).json('error');
    } 
  })
  .catch((error)=>console.log(error));

}

//PHONE OTP VERIFIER 

const verifyCode = async(req, res) =>{

    const {code} = req.body;

if(code == coderotp ){
    return res.status(200).json('success');
}
else{
    return res.status(401).json('invalidcode');
}
   
    }

//MAIL OTP SENDER
let checkemailotp = 0;
const Emailpassword = "xdwf gsif zeoe lrpf";
const  SendEmailcode = async(req,res) =>{

    const {Emailid} = req.body;
  const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.net",
    port: 465,
    secure: true,
    auth: {
      user: "kishore8a03@gmail.com",
      pass:process.env.EMAILPASS,
    },
  });
  
  const EmailOtp = Math.floor(Math.random()*10000);
  checkemailotp = EmailOtp;

  const htmlcontent = `
  <html>
  <body>
  <img src="cid:myImg" style="width:400px;height:150px;border-radius:30px;"/>
  <h2>Do Not share to Any One ${EmailOtp}</h2>
  </body>
  </html>
  `
  const mailoption = {
    from:'kishore8a03@gmail.com',
    to:`${Emailid}`,
    subject:'OTP SENDER',
    html:htmlcontent,
    attachments: [{
      filename: 'amazon-logo.png',
      path: __dirname + '/amazon-logo.png',
      cid: 'myImg'
    }]
  }
  
  transporter.sendMail(mailoption,function(err,data){
  
    if(!err){
        return res.status(200).json('success');
    }
    else{
        res.status(401).json('invalidcode');
    }
  });


}

const validateEmailcode =async (req,res) =>{

    const {emailcode} = req.body;

    if(emailcode == checkemailotp){
        return res.status(200).json('success');
    }
    else{
        return res.status(401).json('invalidcode');
    }

}

module.exports={
    sendVerificationCode,
    verifyCode,
    SendEmailcode,
    validateEmailcode
}