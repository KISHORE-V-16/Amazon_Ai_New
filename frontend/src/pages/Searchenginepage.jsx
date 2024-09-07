import React, { useState } from 'react'
import Header from '../Components/Header';
import { useEffect } from 'react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {createGlobalStyle} from 'styled-components'
import productdata from '../utils/storedata.json';
import { AnimatePresence,motion } from 'framer-motion';
import Product from '../Components/Product';
import Foooter from '../Components/Footer';

const Searchenginepage = () => {

    const cartcount = useSelector((state) => state.cart.cartcount);
    const checksearch = useSelector((state)=>state.cart.checksearch);
    const searchdata = useSelector((state)=>state.cart.data);
    const [storedata,setstoredata] = useState([]);
    const [data1,setdata1] = useState([]);
    const [description,setdescription] = useState([]);
    
    const category = [];
    
    productdata.datas.map((res)=>{
        category.push(res.title);
    });

    const scrollToTop = () =>{ 
        const scrollheight = document.documentElement.scrollHeight - window.scrollY;
        window.scrollTo({ 
          top: 0,  
          behavior: 'smooth'
  
        }); 
      }; 

    const fetchdata1 = () =>{
        setdata1(productdata.datas);
        setdescription( data1.map((res)=>{
            return res.title;
        }))
     }
   
     useEffect(()=>{
         fetchdata1();
        
     },[]);
     const temp = [];
     const pageaddress =   localStorage.getItem('pageaddress'); 
 
     const slicerdata1 = (category) =>{
         const lop1= data1.filter((data) => data.title == category ); 

       return lop1;
    
     }

const validsearchdata=localStorage.getItem('psd');

    return (
    <>
    <Searchstyle>
        <GlobalStyle/>
    <Header cartcount={cartcount} pagename={pageaddress} />
    <div className="search_container">
<div className="data">
<div className="body11">

   {
    checksearch ? (
     category.filter((res)=>res.toLocaleLowerCase().includes(String(validsearchdata).toLocaleLowerCase())).map((catedata,index) => {
        return   <AnimatePresence><motion.div initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale:1 }}
        exit={{ opacity: 0, scale:0}} transition={{ type:'spring',duration: 2.5,stiffness:300,damping:50 }}>  <div className="home-product-row1" key={index}>   {
            
            slicerdata1(catedata).map((d1,index) =>{
                if(index < 4){
                    return <Product imgsrc={d1.image}  id={d1.id} rating={d1.rating.rate} price={d1.price} proinfo={d1.title} prodescription = {d1.description}/>     
                }
            })
           }</div>
            </motion.div> </AnimatePresence>
    })):(
        category.filter((res)=>res == String(validsearchdata).toLocaleLowerCase() || res.toLocaleLowerCase().includes(String(validsearchdata).toLocaleLowerCase())).map((catedata,index) => {
            return   <AnimatePresence><motion.div initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale:1 }}
            exit={{ opacity: 0, scale:0}} transition={{ type:'spring',duration: 2.5,stiffness:300,damping:50 }}> <div className="all-each-row"><div className="home-product-row1" key={index}>   {
                slicerdata1(catedata).map((d1,index) =>{
                        return <Product imgsrc={d1.image}  id={d1.id} rating={d1.rating.rate} price={d1.price} proinfo={d1.title} prodescription = {d1.description}/>     
                })
               }
             
                </div> 
                </div>
                </motion.div> 
              </AnimatePresence>
        })   
    )
   }

  </div>
</div>

    </div>
    <div className="btn-back-to-top">
       <button className='back-btn' onClick={()=>scrollToTop()}>Back To Top</button>
      </div>
    <Foooter/>
    </Searchstyle>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  :root{
---back-color:#dedadad7;
}
`;

const Searchstyle = styled.div`



.search_container{
    margin-top: 70px;
    display: flex;
    flex-flow: row;
    width: 100%;
    min-height:35rem;
    background-color: var(---back-color);

    .body11{
       display: grid;
       grid-template-columns: repeat(4,2fr);
     margin-left: 20px;
      grid-gap: 1rem;
      padding: 10px 10px;

           .all-each-row{
           
            display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
     

            .home-product-row1{
                z-index: 2;
               display: flex;
              justify-content: space-around;
            }  
            .home-product-row2{
                z-index: 2;
               display: flex;
               gap:1rem;
                flex-flow: row;
               margin-top: 40px;
                margin-left: 40px;
              justify-content: space-around;
            } 

           }
              
           
        }
       
}

.btn-back-to-top{
         
         display: flex;
         justify-content: center;
         width: 100%;
           height: 50px;
           padding-bottom: 2rem;
           background-color: var(---back-color);
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
           transition:.3s ease-in-out;
         }

       .back-btn:hover{
           color :whitesmoke;
           box-shadow: 2px 2px 10px black;
          background-color: #2e2e2e;

       }
       .back-btn:active{
           transform: scale(.3);
       }
       }

.common{
    display: flex;
    flex-flow: row;
    padding: 20px;
    justify-content: center;

}

`
export default Searchenginepage