import React, { useEffect } from 'react';
import { fireAuth } from '../utils/firebase.jsx';
import { createUserWithEmailAndPassword, validatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {collection,addDoc,onSnapshot} from 'firebase/firestore';
import { firestore1 } from '../utils/firebase.jsx';
import {  toast } from 'react-toastify';
import { ToastContainer} from 'react-toastify';
import styled from 'styled-components';
import img2 from '../store/images/amazon-logo-sighin.png';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { FaCheckCircle,FaTimesCircle,FaEye, FaEyeSlash } from 'react-icons/fa';
import img_pages_sigin from '../store/images/amazon-sigin-images.png';

const CreateAccount = () => {

    const [formdata,setformdata] = useState({email:"",password:"",code:""});
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userdata,setuserdata] = useState([]);
    const [username,setusername] = useState('');
    const [otpshow,setotpshow] = useState(false);
    const [emailotpshow,setemailotpshow] = useState(false);
    const [verification,setverification] = useState('');
   const [emailverification,setemailverification] = useState('');
    const [check_username,setcheck_username] = useState(false); 
   const [check_pwd,setcheck_pwd] = useState(false);
    const [pwdshow,setpwdshow] = useState(false);

    const toastsyles = {
        position: "bottom-right",
        autoClose: 1300, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: false, 
        draggable: true, 
        progress: undefined,
        className: "custom-toast",
      };
    const SERVER_IP = 'http://localhost:5005';

    const handlePhoneNumberChange = (value) => {
      setPhoneNumber(value);
    };

    const navigate1 = useNavigate();

    const userscollections = collection(firestore1,'userscollections');

    useEffect(()=>{

        const usercollection__data =  onSnapshot(userscollections,(snapshot)=> {
          const data = snapshot.docs.map(doc =>( {
            email__id:doc.data().emailid,
            name1:doc.data().name,
            phone__no:doc.data().phoneno,
           
        }));
        setuserdata(data);
   
        })
        return ()=>{
        usercollection__data();
        }
          
      },[]);

    const addpurchasedata = (name,phoneno,email) =>{
        
        const getdata = collection(firestore1,'userscollections');
        addDoc(getdata,{"name":name,"emailid":email,"phoneno":phoneno})
        .then(res => console.log(res.data))
        .catch(error => console.log(error.message));
        
        }

   
     
        
        const validateusername = () => {
            
          const check_user= userdata.filter((c)=> c.name1 === username);
         
          if(check_user[0]){
            toast.warning('Username is Already in Use',toastsyles);
            setcheck_username(false);
          }
          else{
        if(username.length < 5 ){
            toast.error('Enter a Min 10 Characters In Username',toastsyles);
            setcheck_username(false);
        }else{
            setcheck_username(true);
        }
    }
        
    }

          const checkemailaddress = () =>{
        const {email} = formdata;
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            const check_email= userdata.filter((c)=> c.email__id === formdata.email);
            if(check_email[0]){
                toast.warn('Email Id is Already In Use',toastsyles);
            }else{
            if (!emailRegex.test(email)) {
                toast.error(`enter a valid Email Address`,toastsyles);
            } }
        }

        const checkphoneno = () =>{
            const validph = phoneNumber.length;
            if(validph < 10){
                toast.error('Enter a Proper Phone No',toastsyles);
            }
        }

        const checkpassword = () =>{
            const validpwd = formdata.password;
            if(validpwd.length <= 6){
                toast.error('Password should be at least 6 characters',toastsyles);
                setcheck_pwd(false);
            }else{
                setcheck_pwd(true);
            }
        }

  const handlesubmit = async() =>{

    validateusername();
    checkemailaddress();
    checkphoneno();
    checkpassword();

    if(verification && emailverification && check_username && check_pwd){
   
try {
  const {email,password} = formdata;
  console.log(email,password);
    await createUserWithEmailAndPassword(fireAuth,email,password);
    toast.success('Successfully Created an  Amazon Account',toastsyles);
setTimeout(() => {
    addpurchasedata(username,phoneNumber,email);
    navigate1('/signIn'); 
}, 2000);
    
   
} catch (error) {
    console.log(error);
}
  }
else{
    if(!verification && emailverification){
        toast.error('Your Not verified Phone Number',toastsyles);
    }
    else if(verification && !emailverification){
        toast.error('Your Not verified Email id',toastsyles);
    }
    else if(!verification && !emailverification){
        toast.error('Your Not verified Phone NO && Email Id',toastsyles);
    }
   
}
}


async function sendCode(phoneNumber){

    const check_ph = userdata.filter((c)=>c.phone__no === phoneNumber)
    if(check_ph[0]){
        setotpshow(false);
        toast.warn('Phone  No is already In Use',toastsyles);
    }else{
    if(!phoneNumber){
        setotpshow(false);
        toast.warning('enter a valid Number',toastsyles);
    }else{
        setotpshow(true);
    await fetch(SERVER_IP+'/api/send-code',{
    method: 'POST',
    headers: {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body: JSON.stringify({phone_number:`${phoneNumber}`})
    }).then(response => {
    if(response.ok === true)
    {

      toast.success("Verification code sent successfully",toastsyles);
    }
    else{
    toast.error("Oh no we have an error",toastsyles);
}
  })
  }}
}

  async function verifyCode(code){
    if(!code){
        toast.warn('enter proper Valid Otp',toastsyles);
    }
    else{
    await fetch(SERVER_IP+'/api/verify-code',{
      method: 'POST',
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ "code":code})
      })
      .then(response => {

      if(response.ok === true) {

        setverification(true);
        setotpshow(false);
        

       toast.success('Verifed SuccessFully',toastsyles);
      }
      else{

        setverification(false);
        setotpshow(true);
       

     toast.error('Enter a Valid Otp',toastsyles);
    }})
    }
}

async function sendemailcode(emailids){
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const check_email= userdata.filter((c)=> c.email__id === formdata.email);
    if(check_email[0]){
        toast.warn('Email Id is Already In Use',toastsyles);
        setvalid_email(true);
        setemailotpshow(false);
    }else{
        setemailotpshow(true);

    if(emailRegex.test(emailids)){
        await fetch(SERVER_IP+'/api/send-email-code',{
            method: 'POST',
            headers: {
              'Accept':'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({ "Emailid":emailids})
            })
            .then(response => {
      
            if(response.ok === true) {
      
              toast.success("Verification code sent successfully",toastsyles);
            }
            else{   
      
                toast.error("Oh no we have an error",toastsyles);
          }})
    }else{
        toast.error('Enter a Valid Email Address',toastsyles);
    }
}
   
}

async function verifyemailcode(emailcode){
    await fetch(SERVER_IP+'/api/verify-email-code',{
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ "emailcode":emailcode})
        })
        .then(response => {
  
        if(response.ok === true) {
            setemailverification(true);
            setemailotpshow(false);
         toast.success('Verifed SuccessFully',toastsyles);
        }
        else{   
            setemailverification(true);
            setemailotpshow(false);
       toast.error('Enter a Valid Otp',toastsyles);
      }})
}

  return (
    <SighOutstyles>
    <>
    <div className="head">
        <img src={img_pages_sigin} width={"100%"} height={otpshow || emailotpshow ? emailotpshow && otpshow ? '780rem': '700rem' : '650rem'} style={{filter:blur("30px")}} alt="amazon" />
    </div>
    <div className="body">
    <div className="sign-out-container" style={{height: otpshow || emailotpshow ? emailotpshow && otpshow ? '41rem': '39rem' : '33rem'}}>
        <h3 className='sigout-head'>Create An Account</h3>
        <label htmlFor="phone">Your Name</label>
        <input type="text" placeholder='Enter Your UserName' name="username" className='input-common'  value={username}  onChange={(e)=>{setusername(e.target.value)}} />
        <label htmlFor="phone">Phone No</label>
      <div className="phone-style-otp" >
      <PhoneInput
      style={{width:  verification ||otpshow ? "16rem" : '10rem'}}
      name="phone"
        defaultCountry='IN'
        disabled={verification ? true:false}
        
      placeholder="Enter a phone number"
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
    />

{
    verification || !otpshow && (<><button className='btn-sigin1' onClick={()=>{sendCode(phoneNumber);}}>Send OTP</button></>)
}
       
      </div>
      {
        verification ? (<><div style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",paddingLeft:"40px",color:"green"}}><FaCheckCircle/> Verified</div></>):(<> <div style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",paddingLeft:"40px",color:"red"}}><FaTimesCircle/> Not Verified</div></>)
      }
      
     
      {
     otpshow &&(
            <>
            <label htmlFor="number">Otp password </label>
      <div className="phone-style-verify">
      <input placeholder='enter your otp Password' className='input-common' type="number" name="code"  value={formdata.code}  onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})}/>
      <button className='btn-sigin2' onClick={()=>{verifyCode(formdata.code);setformdata({...formdata,code:''});}}>Verify OTP</button>
      <button className='btn-sigin2' onClick={()=>{sendCode(phoneNumber);setotpshow(true);setformdata({...formdata,code:''});}}>Resend OTP</button>
      </div>
            </>
        )
      }
      
      
     
         <label htmlFor="email"  >Email </label>
         <div className="email-styles-otp">
         <input  className='input-common' placeholder="Enter Your Email " type="email" name="email"  value={formdata.email}
 onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})}  disabled={emailverification ? true:false}/>
{
    emailverification || !emailotpshow && (<><button className='btn-sigin1' onClick={()=>{sendemailcode(formdata.email);}}>Send OTP</button></>)
}
         </div>

         {
        emailverification ? (<><div style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",paddingLeft:"40px",color:"green"}}><FaCheckCircle/> Verified</div></>):(<> <div style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",paddingLeft:"40px",color:"red"}}><FaTimesCircle/> Not Verified</div></>)
      }
     
         {
        emailotpshow &&(
            <>
            <label htmlFor="number">Otp password </label>
      <div className="phone-style-verify">
      <input placeholder='enter your otp Password' className='input-common' type="number" name="code"   value={formdata.code}  onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})}/>
      <button className='btn-sigin2' onClick={()=>{verifyemailcode(formdata.code);setformdata({...formdata,code:''});}}>Verify OTP</button>
      <button className='btn-sigin2' onClick={()=>{sendemailcode(formdata.email);setemailotpshow(true);setformdata({...formdata,code:''});}}>Resend OTP</button>
      </div>
            </>
        )
      }

        <label htmlFor="email">Password</label>
        <div className="password-box">
        <input  className='input-common-pwd' placeholder='Enter Your New Password' type={pwdshow ? 'text':'password'} name="password"  value={formdata.password}
            onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})} />
           {
            pwdshow ? (<button className="eye-icon" onClick={()=>setpwdshow(false)}><FaEye/></button>):(<button className="eye-icon" onClick={()=>setpwdshow(true)}><FaEyeSlash/></button>)
           } 
        </div>
       
        <button className='btn-sigin' onClick={()=>handlesubmit()}>Submit</button>
        <p className='sign-out-already'>Already Have an Account - <a href="/signIn">Sign In</a></p>
        <p className='sign-out-info'>By continuing, you agree to <a href="/"> Amazon's Conditions</a> of Use and <a href="/">Privacy Notice.</a> </p>
     

    </div>
    
    </div>

    </>
    <ToastContainer/>
    </SighOutstyles>
  )
}

const SighOutstyles = styled.div`
    
    .head{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 7rem;

    img{
     filter:brightness(50%);
    }
}
.body{
    position: absolute;
    top:40px;
    width: 100%;
    display: flex;
    height: 22rem;
    justify-content: center;
color:white;
    .error-message{
        font-size: 10px;
        width: max-content;
        color: red;
    }
    .sign-out-container{
        display: flex;
        flex-flow:column;
        gap: 0.5rem;
        width: 20rem;
        height: 35rem;
        background-color: aqua;
        font-size: 18px;
        padding: 10px 10px;
        border-radius: 10px;
        border: 1.5px solid whitesmoke;
        background-color:transparent;
        backdrop-filter: blur(20px);

        .phone-sigin{
           
            display: flex;
            flex-flow: column;
            margin-top: -45px;
            align-items: center;

            a{
                font-size: 16px;
                text-decoration: none;
                color: whitesmoke;
            }

            a:hover{
                text-decoration: underline;
                color:#1195c1cf;
            }

        }
        
        .sigout-head{
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 550;
            padding-left: 30px;
        }

        label{
            margin-left: 40px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
        }
        

        .input-common{
            width: 15rem;
            height: 2rem;
           margin-left: 40px;
            border-radius: 10px;
            border: 1px solid grey;
        }

        .password-box{
            display: flex;
            gap:0.3rem;
            .input-common-pwd{
            width: 12rem;
            height: 2rem;
           margin-left: 40px;
            border-radius: 10px;
            border: 1px solid grey;
        }

        .eye-icon{
            width: 40px;
            height: 35px;
            border: none;
            padding: 6px;
            border-radius: 10px;
            background-color: #f0ae07;
            display: flex;
            justify-content: center;

            svg{
                font-size: 20px;
            }
        }
        .eye-icon:hover{
            background-color : #ffb702;
            box-shadow: 2px 2px 15px black;
        }

        }
        .phone-style-otp{
            padding-left: 40px;
            width: 15rem;
            gap: 0.5rem;
            display: flex;

            input{
                background-color: #ffffff;
            }
            .btn-sigin1{
            width: 6.5rem;
            height: 2.2rem;
            padding: 5px 5px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 10px;
            background-color: #f0ae07;
            border: none;
        }

        .btn-sigin1:hover{
           background-color : #ffb702;
            box-shadow: 2px 2px 15px black;
        }

        input{
            width: 8rem;
            height: 2rem;
            border-radius: 10px;
            border: 1px solid grey;
        }

        }

        .email-styles-otp{
            padding-left: 0px;
            width: 17.5rem;
            gap: 0.5rem;
            display: flex;

            .btn-sigin1{
            width: 7.0rem;
            height: 2.2rem;
            padding: 5px 5px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 10px;
            background-color: #f0ae07;
            border: none;
        }

        .btn-sigin1:hover{
           background-color : #ffb702;
            box-shadow: 2px 2px 15px black;
        }
        }

        .phone-style-verify{
            padding-left: 0px;
            width: 17.5rem;
            gap: 0.5rem;
            display: flex;

            input{
                width: 6.5rem;
            }
            .btn-sigin2{
            width: 5rem;
            height: 2.2rem;
            padding: 5px 5px;
            font-size: 11px;
            font-weight: 700;
            border-radius: 10px;
            background-color: #f0ae07;
            border: none;
        }

        .btn-sigin2:hover{
           background-color : #ffb702;
            box-shadow: 2px 2px 15px black;
        }
        }
        
        .btn-sigin{
            width: 15.5rem;
            height: 2rem;
            padding: 5px 5px;
            font-size: 15px;
            margin-bottom: -10px;
            margin-top: 10px;
            margin-left: 40px;
            border-radius: 10px;
            background-color: #f0ae07;
            border: none;
            font-weight: 700;
        }

        .btn-sigin:hover{
           background-color : #ffb702;
            box-shadow: 2px 2px 15px black;
        }
        .sign-out-already{
            font-size: 14px;
            
            padding-left: 50px;
            a{
                color: #14a3d3;
                text-decoration: none;
            }

            a:hover{
                color: #00bfff;
                text-decoration: underline;
            }
        }

        .sign-out-info{
           padding-left: 30px;
            font-size: 12px;
            font-family: sans-serif;
           
            a{
                color: #14a3d3;
                text-decoration: none;
            }

            a:hover{
                color: #00bfff;
                text-decoration: underline;
            }
        }
    }
}

`

export default CreateAccount;