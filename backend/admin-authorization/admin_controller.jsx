
const admin = require('./firebase-admin.jsx');

const  decodeToken = async (req,res)=>{
    token = req.headers.authorization.split(' ')[1];
    try{
       const decodeValue = admin.auth().verifyIdToken(token);
       console.log(decodeValue);
       if(decodeValue){
           return  res.json({message:"verified"});
       }
     
    }
    catch(error){
       console.log(error.message);
     return  res.json({message:"unverified"});
    }
}

module.exports = {
    decodeToken
}