import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {  RecaptchaVerifier ,signInWithPhoneNumber} from "firebase/auth";
import {ReCaptchaV3Provider} from 'firebase/app-check'

import { Link } from 'react-router-dom';
import { fireAuth } from '../utils/firebase.jsx';
import styled from 'styled-components';
import {  toast } from 'react-toastify';
import { ToastContainer} from 'react-toastify';
import img2 from '../store/images/amazon-logo-sighin.png';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';
import ReactOtpInput from "react-otp-input";
import {CgSpinner} from 'react-icons/cg'


const PhoneSigIn = () => {

    const SERVER_IP = 'http://localhost:5005';
    const [showPhoneNo,setshowPhoneNo] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
        console.log(phoneNumber);
      };

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

   

        
async function sendCode(phoneNumber){
  if(!phoneNumber){
      toast.warning('enter a valid Number',toastsyles);
  }else{
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
    setTimeout(() => {
      navigate1('/');
    }, 2000);

     toast.success('Verifed SuccessFully',toastsyles);
    }
    else{
      setOtp('');

   toast.error('Enter a Valid Otp',toastsyles);
  }})
  }
}

      
      const navigate1 = useNavigate();

  return (
    <PhoneSighinstyles>
    <>
    <div className="head">
        <img src={img2} alt="amazon" />
    </div>
    <div className="body">
    <div className="sign-in-container">
        <h3 className='sigin-head'>Sign In</h3>
      {
        showPhoneNo ? (<> <div className="phone-style">
           
        <PhoneInput
        name="phone"
        defaultCountry={'IN'}
        placeholder="Enter phone number"
      
        value={phoneNumber}
        onChange={handlePhoneNumberChange}/>
        </div> </>):(<> <div className="otp-input-container"><input type="number" placeholder='Enter Your Otp' value={otp} onChange={(e)=>setOtp(e.target.value)}/></div></>)
      }  
       {
        showPhoneNo ? (<><button className='btn-sigin' onClick={()=>{sendCode(phoneNumber);setshowPhoneNo(false)}}>Send OTP</button></>) :(<><button className='btn-sigin' onClick={()=>verifyCode(otp)} >Log In</button></>)
       } 
        <p className='sigin-info'>By continuing, you agree to <a href="/"> Amazon's Conditions</a> of Use and <a href="/">Privacy Notice.</a> </p>
     
    </div>
    
    </div>
    <div className="footer">
       <div className="info-newuser">
       <p>------------------------</p>
       <p className='footer-info'> New to Amazon? </p>
       <p>------------------------</p>

       </div>
      <Link to='/signOut'>
      <button className='btn-create-account' >Create  your Amazon  Account</button>
      </Link>
    </div>
    </>
    <ToastContainer/>
    </PhoneSighinstyles>
  )
}

const PhoneSighinstyles = styled.div`
    
    .head{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 7rem;
}
.body{
    width: 100%;
    display: flex;
    height: 22rem;
    justify-content: center;

    .sign-in-container{
        display: flex;
        flex-flow:column;
        gap: 0.5rem;
        width: 20rem;
        height: 14rem;
        background-color: aqua;
        font-size: 18px;
        padding: 10px 10px;
        border-radius: 10px;
        border: 1px solid gray;
        background-color: #ffffff;

        input{
            width: 15rem;
            height: 2rem;
            display: flex;
            flex-flow: row;
            gap: 1rem;
            
            border: 1px solid grey;
        }

        .phone-style{
            padding-left: 40px;
            width: 15rem;
        
        }

        .otp-input-container {
  display: flex;
  justify-content: space-evenly;
  


}


        
        .sigin-head{
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 550;
            padding-left: 30px;
        }

    /*     .custom-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid #978a23;
  border-top: 2px solid #dae90b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
} */

        label{
            margin-left: 40px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
        }

        .input-common{
            width: 15rem;
            height: 2rem;
            margin-left:40px;
            border-radius: 10px;
            border: 1px solid grey;
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
        }

        .btn-sigin:hover{
           background-color : #ffb702;
            box-shadow: 2px 2px 5px grey;
        }

        .sigin-info{
            padding: 10px 10px;
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

.footer{
    width: 100%;
    height: 8rem;

    display: flex;
    align-items: center;
    font-size: 18px;
    color: gray;
    font-weight: 600;
    flex-flow: column;
    margin-top: -90px;

   .info-newuser{
    display: flex;
    width: 30rem;
    margin-left: 4rem;
    height: 1rem;
   }
    
    .btn-create-account{
        width: 18rem;
        margin-top: 50px;
        border: none;
        height: 2rem;
        font-size: 16px;
      
        color: #222222;
        font-family: 'sans-serif';
        background-color:lightgrey;
        border-radius: 10px;
        box-shadow: 2px 2px 5px gray;
    }

    .btn-create-account:hover{
        color: black;
        box-shadow: 2px 2px 10px gray;
        background-color: #d5d2d2;
    }

}

.otp-input {
  width: 40px;
  height: 40px;
  font-size: 18px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.otp-input:focus {
  border-color: #007bff;
  outline: none;
}

`

export default PhoneSigIn;