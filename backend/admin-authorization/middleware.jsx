const admin = require('firebase-admin');

class Middleware{
    
    async decodeToken(req,res,next){
         token = req.headers.authorization.split(' ')[1];
         try{
            const decodeValue = admin.auth().verifyIdToken(token);
            console.log(decodeValue);
            if(decodeValue){
                return next();
            }
          return  res.json({message:"verifed"})
         }
         catch(error){
            console.Console.log(error.message);
          return  res.json({message:"unverified"});
         }
    }
    

}

module.exports = new Middleware();