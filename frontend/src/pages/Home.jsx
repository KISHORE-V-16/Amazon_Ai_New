import React, { useRef, useState } from 'react';
import Header from '../Components/Header';
import styled from 'styled-components';
import Product from '../Components/Product';

import { useEffect } from 'react';
import SimpleSlider from '../Components/SimpleSlider';
import data from '../utils/storedata.json';
import { ToastContainer, toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { onSnapshot,collection } from 'firebase/firestore';
import { firestore1 } from '../utils/firebase';
import { AnimatePresence,motion } from 'framer-motion';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useNavigate } from 'react-router-dom';
import { fireAuth } from '../utils/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Footer from '../Components/Footer';


const Home = () => {

  const myRef = useRef();
  
  const [visibilitystyles,setvisibilitystyles]  = useState(false);

useEffect(()=>{
 console.log("success",visibilitystyles);
  const observer = new IntersectionObserver((entries)=>{
    const entry = entries[0];
    setvisibilitystyles(entry.isIntersecting);
  });
observer.observe(myRef.current);
},[visibilitystyles]);

  const alankey = "ae13481cb56b6adb737e8fd4a03c8a082e956eca572e1d8b807a3e2338fdd0dc/stage";
  
      const cartmoneycollections = collection(firestore1,'cashcollections')
      const [data1,setdata1] = useState([]);
      const [cartamountdata,setcartamountdata] = useState([]);
      const cartcount = useSelector((state) => state.cart.cartcount);
      const [listcategory,setlistcategory] = useState([]);
      const username = localStorage.getItem('username');

    const fetchdata1 = () =>{
       setdata1(data.datas);
    }
  
    const navigator = useNavigate();

    useEffect(()=>{
        fetchdata1();
        setlistcategory(["jewelery","men's clothing","women's clothing","electronics","watch","accessories","laptop","mobile","tv"].sort(() => Math. random() - 0.5));
    },[]);


    const slicerdata1 = (category) =>{
        const lop1= data1.filter((data) => data.category == category).slice(0,4); 
       return lop1;
    }

    
   
    useEffect(()=>{

      const cartmoneystore =  onSnapshot(cartmoneycollections,(snapshot)=> {
        const cartmoney = snapshot.docs.map(doc =>( {
            id:doc.id,
            cartcount:doc.data().cartcount
      }));
      setcartamountdata(cartmoney);
    
      })
      return ()=>{
        cartmoneystore();
    }});

    const scrollToTop = () =>{ 
      const scrollheight = document.documentElement.scrollHeight - window.scrollY;
      window.scrollTo({ 
        top: 0,  
        behavior: 'smooth'

      }); 
    }; 

    const scrolltoDown = () =>{
      let scrolled = 0;
      window.scrollTo({ 
        top: scrolled+350,  
        behavior: 'smooth'
      }); 
      scrolled+=350;
    }

    onAuthStateChanged(fireAuth,(currentuser)=>{

      if (!currentuser) 
      {
      setTimeout(() => {
          navigator('/SignIn');  
      }, 2500);  
  }
    });

    const checksignout = () =>{
      signOut(fireAuth);
      toast.success("Sucessfully Loged Out I hope U had Great Shopping Come Again");
      console.log("all are good");


    }
    let count =localStorage.getItem('alan-voice');
   
 
    useEffect(() => {

      const alaninstance = alanBtn({

          key: alankey,
          onCommand: (commandData) => {
            if(commandData.command === "gotosigin"){
             console.log(commandData.source);
              navigator(`/${commandData.source}`);
            }
            else if(commandData.command === "gotocart"){
              console.log(commandData.source);
              navigator(`/${commandData.source}`);
            }else if(commandData.command === "scrollup")
           {
            scrollToTop();
           }  
           else if(commandData.command === "scrolldown"){
            scrolltoDown();
           }
           else if(commandData.command === "Home"){
            if(fireAuth.currentUser !=null){
              navigator('/Home');
            }
           }
           else if(commandData.command === "signOut"){
            checksignout();
           }
           else if(commandData.command=== "intropage"){
            alaninstance.sendText("Hello kishore I hope u enjoy the conversation with me");
           }
          },
          
      });
     
     
if(fireAuth.currentUser!=null && count==1){
  console.log("all good time");
  
  alaninstance.playText(`Hello ${username} I hope u enjoy the conversation with me`);
  count++;
  localStorage.setItem('alan-voice',0);
}
else if( fireAuth.currentUser==null){
 count =0;
}
    }, []);

  return (
  <>
  <Homestyles>
  <div className="head">
    <Header cartcount={ cartcount} pagename={'Home'} />
    </div>
   <div className="container">
   <ToastContainer/>
    
     <div className="body11">
    
        <SimpleSlider className="home-images"/>

       {
       
        listcategory.map((catedata,cindex) => {
            return   <AnimatePresence>
              <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale:1 }}
            exit={{ opacity: 0, scale:0}} transition={{ type:'spring',duration: 2.5,stiffness:300,damping:50 }}> 
             <div  className="home-product-row1" key={cindex}>   {
                slicerdata1(catedata).map((d1,index) =>{
                    if(index < 4){
                        return ( <Product imgsrc={d1.image}  id={d1.id} rating={d1.rating.rate} price={d1.price} proinfo={d1.title} prodescription = {d1.description}/>   )
                    }
                })
               }</div> </motion.div> </AnimatePresence>
        })
      
       }
      </div>
      <div className="btn-back-to-top">
       <button className="back-btn show-btn" ref={myRef} style={{opacity:`${visibilitystyles ? 1:0}`}} onClick={()=>scrollToTop()}  >Back To Top</button>
      </div>
      </div>
      <Footer/>
      </Homestyles>
      
  </>
  )
}
const Homestyles = styled.div`
   
    .container{
        position: relative;
        margin-left: auto;
        margin-right: auto;
        max-width: 1310px;
        background-color: #dedadad7;
        .body11{
         
          display: flex;
          flex-flow:column;
            justify-content: center;
           overflow-x: hidden;
              
            .home-product-row1{
                z-index: 2;
               display: flex;
               gap:1rem;
                flex-flow: row;
               margin-top: -80px;
               margin-bottom:110px ;
                margin-left: 10px;
              justify-content: space-around;
            }  
            .home-product-row2{
                z-index: 2;
               display: flex;
               gap:1rem;
                flex-flow: row;
               margin-top: -40px;
               margin-bottom:60px ;
                margin-left: 10px;
              justify-content: space-around;
            } 
        }


        .btn-back-to-top{
         
          display: flex;
          justify-content: center;
          width: 100%;
            height: 50px;
            padding-bottom: 2rem;
          
          .back-btn{
            padding: 15px;
            width: 50%;
            background-color: #11171E;
            border:none;

            font-size: 20px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            color: whitesmoke;
            border-radius: 50px;
            cursor:pointer;
            transition:.55s ease-in-out;

          }

        .back-btn:hover{
            color :whitesmoke;
            box-shadow: 2px 2px 10px black;
           background-color: #2e2e2e;

        }
        .back-btn:active{
            transform: scale(.7);
        }
        }
    }

`

export default Home