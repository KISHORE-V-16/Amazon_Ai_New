import React, { useEffect, useRef, useState } from 'react';

import img from '../store/images/amazon-logo.png';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaMicrophone ,FaCamera} from 'react-icons/fa';
import { Link, useActionData, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {AiOutlineLogout} from 'react-icons/ai';
import { fireAuth } from '../utils/firebase';
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux';
import { getdata,checksearchdata } from '../utils/redux-store-management';
import {deleteDoc,doc,onSnapshot,collection,addDoc,updateDoc} from 'firebase/firestore';
import { firestore1 } from '../utils/firebase';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { imgdata } from '../utils/imageimport';

const Header = ({pagename,cartcount}) => {

const cartcount1 = useSelector((state) =>state.cart.cartcount);
const totalmoney = useSelector((state) => state.cart.totalamount);
const offercash  = useSelector((state) => state.cart.offeramount);
       
       

        window.SpeechRecognition = window.webkitSpeechRecognition;
        const recognition =new SpeechRecognition();
        recognition.interimResults=true;
        

        recognition.addEventListener('result',(e)=>{
            const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result=> result.transcript)
            setsearchdata(transcript);
            localStorage.setItem('searchdata',searchdata);
        })

        const [focus,setfocus] = useState(true);

    const dispatch = useDispatch();
    const emaildata  = localStorage.getItem('emialids');
    const username = localStorage.getItem('username');

    const [checksearch,setchecksearch] = useState(false);
    const [searchdata,setsearchdata] = useState('');
    const [searchedhistory,setsearchedhistory] = useState([]);
    const [ImgsSrc,setImgSrc] = useState('');
    const [showupload,setshowupload] = useState(false);

    const SERVER_IP = 'http://localhost:5005';

    const toaststyles =  {
        position: "top-center",
        autoClose: 1300, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined,
        className: "custom-toast",
      }
     

    const navigate1 = useNavigate();

    onAuthStateChanged(fireAuth,(currentuser)=>{

        if (!currentuser) 
        {
             setTimeout(() => {
            navigate1('/SignIn');  
        }, 2500);  
    }
      });

   

      const cartsdata = collection(firestore1,'cashcollections');

      const [cartcollectiondata,setcartcollectiondata] = useState([]);


useEffect(()=>{

    const unsubscribe =  onSnapshot(cartsdata,(snapshot)=> {
      const searchcollectiondata = snapshot.docs.map(doc =>({
           email:doc.data().emailid,
           totalmoney:doc.data().money,
           offermoney:doc.data().offermoney,
           cartcount:doc.data().cartcount,
           id:doc.id,
           u_name:doc.data().name,
    }));

    setcartcollectiondata(searchcollectiondata.filter((data)=>data.u_name == username));

    })
    return ()=>{
      unsubscribe();
    }
      
  },[]);

      const addcart_datas = () =>{
       console.log(username,"new updated");

        if(!cartcollectiondata[0]){
           
            console.log("done");
            addDoc(cartsdata,{"name":username,"emailid":emaildata,"offermoney":offercash,"money":totalmoney,"cartcount":cartcount1})
        .then(res => console.log(res))
        .catch(error => console.log(error.message));
        
    }
        else{
            console.log("upadate success");
            const docref = doc(firestore1,'cashcollections',cartcollectiondata[0].id);
            const updatedata = {"offermoney":offercash,"money":totalmoney,"cartcount":cartcount1 }
            updateDoc(docref,updatedata).then(() => console.log("successfully done")).catch((error) => console.log("udwbvu",error));  

        }

      };

      const logout = () =>{
        toast.success('Successfully Signed Out And Shop Next Time',toaststyles);
      }

      const search_history = collection(firestore1,'searcheditems');

      useEffect(()=>{

        const unsubscribe =  onSnapshot(search_history,(snapshot)=> {
          const searchcollectiondata = snapshot.docs.map(doc =>( {
                searchhistory:doc.data().searchdata,
                id:doc.id,
        }));
        setsearchedhistory(searchcollectiondata);
    
        })
        return ()=>{
          unsubscribe();
        }
          
      },[]);

const data=searchdata;
      const searchsubmit = () =>{
        const getdata = collection(firestore1,'searcheditems');

        if(searchdata){

            if(searchedhistory.length<5){
                const checkduplicatedata = searchedhistory.filter((res)=>res.searchhistory == searchdata);
                if(!checkduplicatedata[0]){
                addDoc(getdata,{"searchdata":searchdata})
                .then(res => console.log(res))
                .catch(error => console.log(error.message));
                }
            }else{
               const deleteid = searchedhistory[searchedhistory.length-1].id;
                const rmep = doc(firestore1,'searcheditems',deleteid);
                 deleteDoc(rmep);
            }
          
            dispatch(checksearchdata(true));

        localStorage.setItem('searchdata',data);
        localStorage.setItem('psd',searchdata);
        localStorage.setItem('pageaddress',pagename);

        setTimeout(()=>{
            dispatch(checksearchdata(false));
        },1000);
        navigate1(`/Searchpage`);
      }
    }

      useEffect(()=>{
        
        setsearchdata(localStorage.getItem('searchdata'));
      

},[]);

const Imgref = useRef();

 const  habdlechanges =async (event) =>{

    const reader= new FileReader();

    reader.onload = function(onLoadEvent){
        setImgSrc(onLoadEvent.target.result);
        console.log(onLoadEvent.target.result);
    }

    const url = URL.createObjectURL(event.target.files[0]);
    console.log(url);
}

const imagedetector =async () =>{

    await fetch(SERVER_IP+'/api/image_extract_data',{
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({"imgsrc":`${ImgsSrc}`})
        }).then(response => {
        if(response.ok === true)
        {
        console.log("done succesfully");
        }
      })
}

const image_detect =async () =>{
    try {
      const model = await mobilenet.load();
      console.log("done with it",model.classify(Imgref.current)); 
    } catch (error) {
        console.log(error.message,"bhghygyg");
    }
}

  return (
    <>
    <div className="all">

    <All>
    <div className='header'>
        <div className="header-logo">
            <Link to='/Home'>
            <img src={img} width={"140px"} height={"40px"} alt="amazon-logo" />
            </Link>
           
        
        </div>
        <div className="all-head-search">
        <div className="header-search">
           
            <input type="text" value={searchdata} onChange={(e)=>{setsearchdata(e.target.value);setchecksearch(e.target.value ? false:true);!e.target.value && setTimeout(() => {
            !e.target.value &&  navigate1(`/${localStorage.getItem('pageaddress')}`);localStorage.setItem('searchdata','');
        }, 5000);e.target.value && dispatch(getdata(e.target.value))  }} onFocus={()=>{setfocus(false);}} onBlur={()=>{setTimeout(()=>{setfocus(true);},1000)}}/>
       
          {
           !focus &&(
        <div className='searched-container'>
            {
                searchedhistory.map((res,index)=>{
                    return (<button  key={index} className="search-data" onClick={()=>setsearchdata(res.searchhistory)}>
                       <FaSearch/> {res.searchhistory}
                    </button>)
                })
            }

        </div>)
          }
          {
            showupload && (
            
                <div className="upload-container">
                    
        <input type='file' name="file" onChange={habdlechanges}/>
        
        <button onClick={image_detect()}>upload</button> 
                    </div>

            )
          }
        {
            ImgsSrc &&(
                <img width={"50px"} height={"50px"} src={ImgsSrc} alt="good" crossOrigin='anonymous' ref={Imgref}/>
            )
        }
            </div>
        <div className="search-btn">

<button className="icons " onClick={()=>searchsubmit()}><div className="b1"><FaSearch/></div></button> 
<button className='icons ' onClick={()=>setshowupload(true)}><div className="b3"><FaCamera/></div></button>
<button  className="icons" onClick={()=>{recognition.start();setTimeout(() => {
    recognition.stop();
}, 4000);}}><div className="b2"><FaMicrophone/></div></button>

</div>
            
        </div>

        <div className="header-nav">
            
           <Link to='/signIn'>
           <div className="header_option">
           <span className='head-options-one'>
               Hi,{username}
            </span>
            <span className='head-options-two'>
                Sign In
            </span>
            </div>
           </Link>
           

            <div className="header_option">
            <span className='head-options-one'>
                Returns
            </span>
            <span className='head-options-two'>
               & Order
            </span>
            </div>
            <div className="header_option">
            <span className='head-options-one'>
                Amazon Prime
            </span>
            <span className='head-options-two'>
                Yours
            </span>
           
            </div>
            <div className="basket">
           {
            cartcount!=0 &&(
            <div className="cart-count">{cartcount}</div>
            )
           } 
                <Link to='/checkout'>

                <FaShoppingCart/>
               
                </Link>
                <div className="cart">cart</div>
            </div>
            <div>
          <button  className='btn-signout' onClick={()=>{signOut(fireAuth);logout();addcart_datas();}}> <AiOutlineLogout/></button> 
            </div>
         
        </div>
    </div>

    </All>

    </div>
    </>
   
  )
}

const All = styled.div`

    .header{
        gap: 5rem;
        height: 60px;
        display: flex;
        width: 100%;
        flex-flow: row;
        background-color: #13171d;
        position: fixed;
        top:0px;
        z-index: 100;
    }
    .header-logo{
       width:100px;
        object-fit: contain;
        padding-top: 10px;
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        filter: brightness(100%);
    }
    .all-head-search{
      margin-top: 13px;
        width: 700px;
        height: 40px;
        top:10px;
        display: flex;
       flex-flow: row;
       justify-content: flex-start;
        .header-search{
       
       
       input{
           width: 500px;
           height: 30px;
           background-color: white;
           border: none;
           
       }
       .searched-container{
        padding: 10px;
        display: flex;
        flex-flow:column;
        gap: 0.7rem;
        background-color:whitesmoke;
        color:black;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        border-left: 2px solid #747474d4;
        border-right:2px solid #747474d4;
        border-bottom: 2px solid #747474d4;
 
        .search-data{
            width: 95%;
            height: 40px;
            display: flex;
            gap:3rem;
            padding: 5px;
            padding-left: 1rem;
            padding-top: 10px;
            border-radius: 10px;
            background-color: #bbb9b9d6;
            font-size: 17px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 600;
          cursor: pointer;
            border:none;
          .search-history-btn{
            background-color: transparent;
            border: none;
            cursor: pointer;
            svg{
                font-size: 18px;
            }
          }
        }
        .search-data:hover{
            box-shadow: 2px 2px 20px #000000;
            transform: scale(1.03);
            transition: all .3s ease-in-out;
        }
       }
   }

   .search-btn{
        
        width: 150px;      
        height: 35px;
       

        .icons{
            width: 50px;
            height: 33px;
            margin-top: 0px;

            background-color:#cd9400;
            border: none;
            border-left: 3px solid black;
            transition: all .3s;
            svg{
               color: black;
               filter: brightness(100%);
               font-size: 18px;
           }
        }
        .icons:hover{
            background-color: #ffae00;
        }
        .icons:active{
            transform: scale(.5);
        }

        
       }
    }

    .upload-container{

    }
    
    .header-nav{
        display: flex;
        flex: 1;
        justify-content: flex-end;
padding-right: 10px;
        width:300px;
        height: 60px;
        margin-left: -150px;
        color: white;
        margin-top:12px;
        
        gap:2.5rem;
        .basket{
            width: 20px;
            height: 20px;
            svg{
                color:white;
                font-size: 28px;
                font-weight: 500;
                margin:0px -10px;
            }
            .cart-count{
               margin-top: -10px;
               font-weight: 600;
                font-size: 16px;
                padding-left: 0px;
                color: #cd9400;
            }
            .cart{
                margin:-15px 20px;
                font-size: 15px;
                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            }
        }
        .btn-signout{
            width:37px;
border-radius: 18px;
      margin-top:0px;
              background-color: #ffae00;
        border: none;
        cursor: pointer;
        svg{
            
            color:black;
            width: 25px;
            height: 25px;
        }
        }
        .header_option{
            display: flex;
            flex-flow: column;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-style: normal;
            .head-options-one{
                font-size: 12px;
                color:white;
                text-decoration-line: underline;
                text-decoration-color: #10161c;
                
            }
            .head-options-two{
                font-size: 16px;
                font-weight: 700;
                color:white;
                text-decoration-line: underline;
                text-decoration-color: #10161c;
          
            }
        }

    }

  

`

export default Header;
