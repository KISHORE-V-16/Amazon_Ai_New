import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fireAuth, provider ,providergithub} from '../utils/firebase.jsx';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import {  toast } from 'react-toastify';
import { ToastContainer} from 'react-toastify';
import {collection,addDoc,updateDoc, doc,onSnapshot} from 'firebase/firestore';
import { firestore1 } from '../utils/firebase.jsx';
import { useDispatch, useSelector } from 'react-redux';

import img2 from '../store/images/amazon-logo-sighin.png';
import styled from 'styled-components';
import Googleicon from '../store/images/Google.png';
import Github from '../store/images/Github.png';
import img_pages_sigin from '../store/images/amazon-sigin-images.png';
import { initialState } from '../utils/redux-store-management.jsx';
import { reset } from '../utils/redux-store-management.jsx';

const SignIn = () => { 

    const toaststyles =  {
        position: "bottom-right",
        autoClose: 1300, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: false, 
        draggable: true, 
        progress: undefined,
        className: "custom-toast",
      }

      localStorage.setItem('alan-voice',1);

      const [userdata,setuserdata] = useState([]);
    const [showemail,setshowemail] = useState(true);
    const [useremail,setuseremail] = useState('');
    const [userpassword,setuserpassword] = useState('');
    const [valid,setvalid] = useState(null);
    const navigate1 = useNavigate();

const userscollections = collection(firestore1,'userscollections');
const cartsdata = collection(firestore1,'cashcollections');

useEffect(()=>{

    const usercollection__data =  onSnapshot(userscollections,(snapshot)=> {
      const data = snapshot.docs.map(doc =>( {
        email__id:doc.data().emailid,
        name1:doc.data().name,
       
    }));
    setuserdata(data);

    })
    return ()=>{
    usercollection__data();
    }
      
  },[]);

const addusersdata = (name,email) =>{
        
    const chech_email = userdata.filter((data)=>data.email__id === email && data.name1 === name);
    if(!chech_email[0]){
    const getdata = collection(firestore1,'userscollections');
    addDoc(getdata,{"name":name,"emailid":email})
    .then(res => console.log(res.data))
    .catch(error => console.log(error.message));
    
    }
}


const SERVER_IP = 'http://localhost:5005';

const AdminAuthorizer =async (token) =>{

        await fetch(`${SERVER_IP}/admin/verifier`,{
            headers:{
                Authorization:'bearer ' + token ,
            }
        }).then(res => res.json())
        .then(result =>{
            console.log(result.message);
            if(result.message === "verified"){
                setTimeout(() => {
                    navigate1('/Home');
                }, 2000);
            }
        }).catch((error)=>{
            setTimeout(() => {
                navigate1('/SignIn');
            }, 1000);
            console.log(error);
        });

}



const [cartcollectiondata,setcartcollectiondata] = useState([]);
const emaildata  = localStorage.getItem('emialids');


  const dispatch = useDispatch();

  const cart_update = (email) =>{

    console.log(email,"new op");
    const cartdata = cartcollectiondata.filter((data)=>data.email === email).length > 0 ? cartcollectiondata.filter((data)=>data.email === email)[0].cartcount : 0;
    const offercash = cartcollectiondata.filter((data)=>data.email === email).length > 0 ? cartcollectiondata.filter((data)=>data.email === email)[0].offermoney : 0;
    const totalcash = cartcollectiondata.filter((data)=>data.email === email).length > 0 ? cartcollectiondata.filter((data)=>data.email === email)[0].totalmoney : 0;

    console.log(cartdata,offercash,totalcash);
    console.log("nkenvkenv",emaildata);
    console.log('data spred',cartcollectiondata.filter((data)=>data.email === email));

    dispatch(reset({cartdata,offercash,totalcash}));
    console.log("reset successfully done");

  }

   const googlesigin =() =>{

    signInWithPopup(fireAuth,provider)
    .then((results)=>{localStorage.setItem('username',results.user.displayName);
    localStorage.setItem('emialids',results.user.email);
    toast.success('Successfully LogIn Happy Shopping', toaststyles);
    addusersdata(results.user.displayName,results.user.email);
    const token = results.user.accessToken;
    AdminAuthorizer(token);
    cart_update(results.user.email);
    })
    .catch((error)=>{console.log(error);
    toast.error('Try Again Or their May No Internet Connection', toaststyles);
    })
}

useEffect(()=>{

    const unsubscribe =  onSnapshot(cartsdata,(snapshot)=> {
      const searchcollectiondata = snapshot.docs.map(doc =>({
           email:doc.data().emailid,
           totalmoney:doc.data().money,
           offermoney:doc.data().offermoney,
           cartcount:doc.data().cartcount,

    }));
    setcartcollectiondata(searchcollectiondata);
    })
    return ()=>{
      unsubscribe();
    }
      
  },[]);

/* const GitHubsigin = () =>{
   
    signInWithPopup(fireAuth,providergithub)
    .then((results)=>{console.log(results);
    toast.success('Successfully LogIn Happy Shopping', toaststyles);
    setTimeout(() => {
        navigate1('/');
    }, 2000);
    })
    .catch((error)=>{console.log(error);
         toast.error('Try Again Or their May No Internet Connection', toaststyles);
        })
} */



    const checkemailaddress = () =>{
        setshowemail(false);
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        localStorage.setItem('emialids',useremail);
        if(!emailRegex.test(useremail)){
            toast.error(`enter a valid Email Address`, toaststyles);
              setTimeout(() => {
                window.location.reload();           
              }, 1500);
                 
        }
    }

const handlesubmit = async () =>{
  let flag=0;  
    try {
        await signInWithEmailAndPassword(fireAuth,useremail,userpassword);
        onAuthStateChanged(fireAuth,(currentuser)=>{
            const get_email = userdata.filter((data)=>data.email__id === currentuser.email);
            
            localStorage.setItem('username',String(get_email[0].name1));
            if(flag==0){
                addusersdata(currentuser.displayName,currentuser.email);
                toast.success('Successfully LogIn Happy Shopping', toaststyles);
                cart_update(currentuser.email);
                flag=1;
            }setTimeout(()=>{
                navigate1('/Home');
            },2000)
        
          });
    
    } catch (error) {
        if(error.message  = `FirebaseError: Firebase: Error (auth/invalid-login-credentials).`){
            
             toast.error('Enter a valid Password or Email Id', toaststyles);
        }
        else if(error.message = 'FirebaseError: Firebase: Error (auth/invalid-email).'){
        
        toast.error('Enter a valid Email Id', toaststyles);
        }
       setTimeout(() => {
        window.location.reload();
       }, 2000);
        console.log(error);
    }
    }

  return (
    <Sighinstyles>
    <>
    <div className="head">
    <img src={img_pages_sigin} width={"100%"} height={"600rem"} style={{filter:blur("30px")}} alt="amazon" />
    </div>
    <div className="body">
    <div className="sign-in-container">
        <h3 className='sigin-head'>Sign In</h3>
      {
        showemail ? (<> <label htmlFor="email">Email</label>
        <input type="email" name="email" id="password" value={useremail}
        onChange={(e)=>setuseremail(e.target.value)}  /></>):(<><label htmlFor="email">Password</label>
        <input type="password" name="password" id="password"  value={userpassword}
         onChange={(e)=>setuserpassword(e.target.value)} /></>)
      }  
       {
        showemail ? (<><button className='btn-sigin' onClick={()=>checkemailaddress()}>Continue</button></>) :(<><button className='btn-sigin' onClick={()=>handlesubmit() }>Log In</button></>)
       } 
        <p className='sigin-info'>By continuing, you agree to <a href="/"> Amazon's Conditions</a> of Use and <a href="/">Privacy Notice.</a> </p>
        <div className="phone-sigin"> 
     
     <p>------------ or -------------</p>
     
     <div className="sigin-btn-other">
     <button className='btn1' onClick={()=>googlesigin()}><div className="styles-google" style={{display:"flex",gap:"2.0rem",marginLeft:"38px",padding:"0px"}}><img src={Googleicon} alt="Google-icon" width={"20px"} height={"20px"} style={{borderRadius:"10px",marginLeft:"-30px"}}></img>  <div className="Google"> Sign In With Google</div></div></button>
     </div>
    
       </div> 
     
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
    </Sighinstyles>
  )
};

const Sighinstyles = styled.div`


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
    top:80px;
    width: 100%;
    display: flex;
    height: 22rem;
    justify-content: center;
    color:whitesmoke;
    .sign-in-container{
        display: flex;
        flex-flow:column;
        gap: 0.5rem;
        width: 20rem;
        height: 20rem;
        background-color: aqua;
        font-size: 18px;
        padding: 10px 10px;
        border-radius: 10px;
        border: 1.5px solid whitesmoke;
        background-color:transparent;
        backdrop-filter: blur(20px);
        box-shadow: 0px 0px 20px whitesmoke;
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

            .btn-phoneNo{
                padding:7px;
                display: flex;
                gap:0.5rem;
                border: none;
                border-radius: 50px;
                color: whitesmoke;
                background-color:#76c813de;
                svg{
                    font-size: 20px;
                    color: green;
                    filter:brightness(120%);
                    border-radius: 10px;
                    box-shadow: 2px 0px 10px whitesmoke;
                }
            }

        }
        
        .sigin-head{
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

        input{
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
        .sigin-btn-other{
            display: flex;
            flex-flow: row;
            gap: 2rem;
         
           
            .btn1{
                width: 15rem;
                height: 2.5rem;
                border-radius: 5px;
                padding: 5px;
                border: none;
                background-color: #2d5dab;

            }
            .btn1:hover{
                background-color:#1e61cc;
                box-shadow: 2px 2px 10px #597da9;
            }
            .btn2{
                width: 8rem;
                height: 2rem;
                border-radius: 20px;
                border: none;
                background-color:#181717;
            }
            .btn2:hover{
                background-color:#000000;
               
                box-shadow: 2px 2px 10px #abb1b9;
            }
            .Google{
                margin-left:-5px;
                margin-top: 3px;
                font-size: 16px;
                color: #e2e0e0;
            }
               img{
                border:2px solid white ;
                box-shadow: 2px 2px 19px whitesmoke;
               }
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
    position: absolute;
    top:450px;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: whitesmoke;
    font-weight: 600;
    flex-flow: column;
    margin-top: -30px;

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
        background-color:whitesmoke;
        border-radius: 10px;
        box-shadow: 2px 2px 5px gray;
    }

    .btn-create-account:hover{
        color: black;
        box-shadow: 2px 2px 10px gray;
        background-color: #d5d2d2;
    }

}

`

export default SignIn