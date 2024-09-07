const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_KEY);
let id_data;


const  payment_email_sender = (purdata,emailid,totalmoney) =>{

  const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.net",
  port: 465,
  secure: true,
  auth: {
    user: "kishore8a03@gmail.com",
    pass:process.env.EMAILPASS,
  }
});

console.log("kishore",purdata);


const htmlcontent = purdata.map((data)=>{
  return  (
    
  ` <html>
  <div className="purchase-items" style="margin-bottom: 30px;
  margin-left: 10px;
    width: 52rem;
    height: 240px;
    background-color: #ffffff;
    display: flex;
    gap: 1rem;
    padding-left:40px;
    padding-top:30px;
    border: 1.5px solid grey;
    border-radius: 20px;">
  <div className="purchase-img">
      <img src=${data.imgsrc} style="width:200px;height:150px; margin-bottom: 30px;
        width: 15rem;
        height: 250px;
        background-color: #ffffff;
        border: 1.5px solid grey;
        border-radius: 10px;" alt="picture" />
  </div>
<div className="purchase-info">
  <h3 className='title' style=" margin-top: -25px;
  padding-left: 30px;
  font-size: 28px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: 500;">${data.title}</h3>
  <div style="font-size:30px;margin-left:30px;font-weight:600;margin-bottom:10px;">Qty: ${data.count}</div>
  <div className="rate-details">
        <div className="price" style="  color: black;
        font-size: 35px;
        font-weight: 600;
        margin-left:25px">₹ ${data.price}</div>
    </div>
</div>
</div>
</html>
`
  )});

  const info = `
  <h2 style="font-size:40px;">You Have Made Successfull Payments</h2>
  <h2 style="font-size:35px;" >Your purchased List Items</h2>
  `

  const footer = `
  <h2 style="font-size:35px">The total Amount Paid ₹ ${Number(totalmoney).toLocaleString()}.</h2>
  <h3>Come And shop Next Time...</h3>
  `

const mailoption = {
  from:'kishore8a03@gmail.com',
  to:`${emailid}`,
  subject:'Payment Message',
  html:`<img src="cid:myImg" style="width:400px;height:100px;border-radius:30px;border:2px solid #fff"/>`+ info + htmlcontent +footer ,
  attachments: [{
    filename: 'amazon-logo.png',
    path: __dirname + '/amazon-logo.png',
    cid: 'myImg'
  }],
}


transporter.sendMail(mailoption,function(err,data){

  if(!err){
      return console.log(err);
  }
  
});

}



const stripe_payment = async (req,res) =>{

  const {emailid,purdata,totalmoney} = req.body;

console.log(purdata);
    const line_items = req.body.purdata.map((data)=>{
      const bubble = data.price;
        return (
            {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:`${data.title}`,
                        images:[`${data.imgsrc}`],
                        metadata:{
                            id:data.id,
                        }
                    },
                    unit_amount:`${ bubble.replace(/,/g,'')}`,
                },
                quantity: `${data.count}`, 
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        payment_method_types: ['card'],
        phone_number_collection: {
            enabled: true,
          },
          shipping_address_collection: {
            allowed_countries: ['US'],
          },
          custom_text: {
            shipping_address: {
              message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
            },
            submit: {
              message: 'We\'ll email you instructions on how to get started.',
            },
          },
        mode: 'payment',
        success_url: `http://localhost:5173/Home`,
        cancel_url: `http://localhost:5173/checkout`,
        consent_collection: {
            terms_of_service: 'required',
          },
          custom_text: {
            terms_of_service_acceptance: {
              message: 'I agree to the [Terms of Service](https://example.com/terms)',
            }
          },
  
});
id_data = session.id;

session_status(purdata,emailid,totalmoney)
res.send({url: session.url,status:"fine"});

}

const session_status = (purdata,emailid,totalmoney) =>{

  stripe.checkout.sessions.retrieve(
    id_data,
    function(err, session) {
      if (err) {
        console.error('Error retrieving checkout session:', err);
      } else if(session.payment_status == "paid") {
        payment_email_sender(purdata,emailid,totalmoney);
      }else{
        session_status(purdata,emailid,totalmoney); 
      }
    }
  )

}

module.exports ={stripe_payment};