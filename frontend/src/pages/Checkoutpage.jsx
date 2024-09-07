import React, { useState,useEffect } from 'react';

import Header from '../Components/Header';
import styled from 'styled-components';
import img1 from '../store/images/cart-amazon-pic.png'
import {deleteDoc,doc,onSnapshot,collection,addDoc,updateDoc} from 'firebase/firestore';
import { firestore1 } from '../utils/firebase';
import { addition, additioncartmoney, deletecartmoney, deletion, deoffermoney, desubtotal, insubtotal } from '../utils/redux-store-management';
import { useDispatch,useSelector } from 'react-redux';
import {AnimatePresence, motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Foooter from '../Components/Footer';
import { toast,ToastContainer } from 'react-toastify';

const Checkoutpage = () => {

  const emaildata  = localStorage.getItem('emialids');

  const SERVER_IP = 'http://localhost:5005';
  const purchasecollections = collection(firestore1,'purchaseitems');
  const savedcollections = collection(firestore1,'savedcollections');
 
  const [purdata,setpurdata] = useState([]);
  const [saveddata,setsaveddata] = useState([]);
  const cartcount1 = useSelector((state) =>state.cart.cartcount);
  const totalmoney = useSelector((state) => state.cart.totalamount);
  const offercash  = useSelector((state) => state.cart.offeramount);
  const dispatch = useDispatch();

  useEffect(()=>{

    const unsubscribe =  onSnapshot(purchasecollections,(snapshot)=> {
      const purchasedata = snapshot.docs.map(doc =>( {
            email:doc.data().emailid,
            count:doc.data().count,
            id:doc.id,
            imgsrc:doc.data().imgsrc,
            price:doc.data().price,
            rating:doc.data().rating,
            title:doc.data().title,
    }));
    
    setpurdata(purchasedata.filter((data)=> data.email == emaildata));
    localStorage.setItem("purchasedata",purdata);
    })
    return ()=>{
      unsubscribe();
    }
      
  },[]);

  useEffect(()=>{

    const subscribesaveitems =  onSnapshot(savedcollections,(snapshot)=> {
      const saveddata = snapshot.docs.map(doc =>( {
        email:doc.data().emailid,
        count:doc.data().count,
        image:doc.data().image,
        rating:doc.data().rating,
        title:doc.data().title,
        price:doc.data().price,
        id:doc.id
    }));
    setsaveddata(saveddata.filter((data)=> data.email == emaildata));

    })
    return ()=>{
      subscribesaveitems();
    }
      
  },[]);


  const removesavedcart = (id) =>{
    const rmep = doc(firestore1,'savedcollections',id);
    deleteDoc(rmep)
              
}

const updateaddQty = (imgsrc) =>{

  const findmatchdata = purdata.filter((data)=>data.imgsrc == imgsrc);
  const docref = doc(firestore1,'purchaseitems',findmatchdata[0].id);
  const adder = Number(findmatchdata[0].count);
  const updatedata = {"count":adder+1 }
  updateDoc(docref,updatedata).then(() => console.log("successfully done")).catch((error) => console.log("udwbvu",error));  

}

const updatesubQty = (imgsrc) =>{

  const findmatchdata = purdata.filter((data)=>data.imgsrc == imgsrc);
  const docref = doc(firestore1,'purchaseitems',findmatchdata[0].id);
  const adder = Number(findmatchdata[0].count);
  const updatedata = {"count":adder-1 }
  updateDoc(docref,updatedata).then(() => console.log("successfully done")).catch((error) => console.log("udwbvu",error));  

}


  const addpurchasedata = (id,image,title,price,rating) =>{

    const find1 = purdata.filter((data) => data.imgsrc == image);
    if(!find1[0]){
    const getdata = collection(firestore1,'purchaseitems');
    addDoc(getdata,{"emailid":emaildata,"id":id,"title":title,"price":price,"imgsrc":image,"rating":rating,"count":1})
    .then(res => console.log(res))
    .catch(error => console.log(error.message));
    dispatch(insubtotal(price));
    dispatch(addition());
    removesavedcart(id);
    }

}

  const saveditemsdata = (id,image,title,price,rating) =>{

    const find1 = saveddata.filter((data) => data.image == image );
    if(!find1[0]){
    const getdata = collection(firestore1,'savedcollections');
    addDoc(getdata,{"emailid":emaildata,"id":id,"title":title,"price":price,"image":image,"rating":rating})
    .then(res => console.log(res))
    .catch(error => console.log(error.message));}
}
 
  const remove = (id) =>{
    const rmep = doc(firestore1,'purchaseitems',id);
    deleteDoc(rmep);     
}

const [usecount,setcount] = useState(1); 

const scrollToTop = () =>{ 
  const scrollheight = document.documentElement.scrollHeight - window.scrollY;
  window.scrollTo({ 
    top: 0,  
    behavior: 'smooth'

  }); 
}; 

const checkoutitems = async () =>{
  
console.log("good");
  await fetch(SERVER_IP+'/api/checkout-sessions',{
    method: 'POST',
    headers: {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body: JSON.stringify({  purdata:purdata ,emailid:emaildata,totalmoney:totalmoney})
    })
    .then(response =>response.json())
    .then(response=>
      {
        window.location.href = response.url;     
      })
      .catch(error=>console.log(error));
}

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


  return (
    <Checkoutstyles>
    <>

    <Header cartcount={cartcount1} pagename={'checkout'} /> 
    <ToastContainer/>
    <div className="container">
          <div className="shopping-cart">
              <h4 className='head-cart1'> Shopping Cart</h4>  
              {!purdata[0] && (<div className='msg-items'>No Items have been Selected</div>)}
             <div className="cart-items">
             <AnimatePresence> 
              {purdata &&(
              purdata.map((data)=>{
                return      <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale:1 }}
                exit={{ opacity: 0, scale:0}} transition={{ type:'spring',duration: 2.5,stiffness:300,damping:50 }}> 
                
                  <div className="purchase-items">
                <div className="purchase-img">
                    <input type="checkbox" name="collection" id="1" />
                    <img src={data.imgsrc} width={"200px"} height={"210px"} alt="picture" />
                </div>
            <div className="purchase-info">
                <h5 className='title'>{data.title}</h5>
                  <div className="rate-details">
                      <div className="price">₹ {data.price}</div>
                          <div className="stock-details">In Stock
                            <div className="img-block">
                                  <img src={img1} width={"80px"} height={"20px"} alt="" />
                            </div>
                             <p className='stock-offer'>Eligible for FREE Shipping</p>
                          </div>
                  </div>
                  <div className="select-btn">
                    <div className="Quantity-count">
                    <button className='btn-count' onClick={()=>{setcount(usecount+1);updateaddQty(data.imgsrc); dispatch(additioncartmoney(data.price))} }>+</button>
                       <div className="Qty-count">{data.count}</div>
                       <button className='btn-count' onClick={()=>{usecount != 1 &&( setcount(usecount-1));usecount != 1 &&( updatesubQty(data.imgsrc));usecount !=1 && dispatch(deletecartmoney(data.price))} }>-</button>
                    </div>
                         <button className='btn-cart' onClick={()=>{remove(data.id);dispatch(deletion());dispatch(desubtotal(Number(data.count * data.price.replace(/,/g,'')).toLocaleString()));dispatch(deoffermoney(Number(data.count * data.price.replace(/,/g,'')).toLocaleString()));}}>Remove from Cart</button>
                         <button className='btn-cart' onClick={()=>{saveditemsdata(data.id,data.imgsrc,data.title,data.price,data.rating)}}>Save</button>
                  </div>
            </div>
         
          </div>
         
          </motion.div>
         
              })
           ) 
} </AnimatePresence>

            </div>
          </div>

            <div className="subtotal-cart" style={{minHeight:( totalmoney) ==0  ? '120px' : '190px'}}>
              {
                ( totalmoney)==0 ?(
                  <h4 className='head-cart3'>No Items selected   </h4>
                  
                ) :(<>
              {( totalmoney) >= 500  ? (<div className='offered-eligble'>Your Are eligible for Free Order</div>) :(<> <div className="offers-title"><FontAwesomeIcon icon={faExclamationCircle} />    Add ₹ {offercash} of eligible items to your order to qualify for FREE Delivery </div></>)}
                  
                <div className='sub-total'>Subtotal ({cartcount1} items) :</div></>)
              } 
                {
                 ( totalmoney)!=0 &&(
                    <div className="total-cash">
                     ₹ {Number(totalmoney).toLocaleString()}
                    </div>
                  )
                }
                <button className='buy-btn' onClick={()=>{purdata[0] ? checkoutitems() : toast.warning("You did Not Select Any items",toaststyles);}}>Proceed to Buy</button>
               
            </div>
          
          <div className="reactly-buyed-items" style={{top:( totalmoney)==0  ? '250px' :( totalmoney) > 0 ? '300px' : '300px',height:!saveddata[0] ? '11rem' :saveddata[1] ?  '21rem' : '14rem'}}>
              <h4 className='head-cart2'> Saved items </h4>
              {!saveddata[0] && (<div className='no-items'>THERE IS NO SAVED ITEMS</div>) }
              <div className="container-save-cart" style={{height: saveddata[1] ? '16rem':'max-content'}}>
              <AnimatePresence> 
            {
              saveddata  && (saveddata.map((data) =>{
                return (<>
                <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale:1 }}
                exit={{ opacity: 0, scale:0}} transition={{ type:'spring',duration: 2.5,stiffness:350,damping:80 }}> 
                <div className="save-cart">
                <div className="each-cart-items">
                <div className="sub-cart-items">
                <img src={data.image} width={"80px"} height={"80px"} alt="cwv" />
                <h5 className='title-saved-cart'>{data.title}</h5>
                </div>
                <div className="btn-save">
                <button className='add-to-cart' onClick={()=>{addpurchasedata(data.id,data.image,data.title,data.price,data.rating)}}>Add to cart</button>
               <button className='remove' onClick={()=>{removesavedcart(data.id)}}>Remove</button>
                </div>
                </div>
              </div>             
              </motion.div>
              </>)
              } 
              )
              )
            }  </AnimatePresence>  </div>
          </div>
</div>
<div className="btn-back-to-top">
       <button className='back-btn' onClick={()=>scrollToTop()}>Back To Top</button>
      </div>
<Foooter/>
    </>
    </Checkoutstyles>
  )
};

const Checkoutstyles=styled.div`

  .container{
    width: 100%;
    height: 37rem;
   margin-top: 70px;
    background-color: #dedadad7;

    .shopping-cart{
      position: absolute;
      top:100px;
      margin-left: 20px;
      width:56rem;
      background-color: rgb(250, 250, 250);

      .msg-items{
        font-size: 25px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        padding-left: 30px;
        padding-bottom: 20px;
      }

      .head-cart1{        
        background-color: rgb(250, 250, 250);
        width: 93%;
        height: 30px;
        margin-top: 0px;
        font-size: 30px;
        padding: 15px 30px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 400;
        border-bottom: 2px solid gray;
      }
      .cart-items{
        width: 56rem;
        max-height: 27rem;
        overflow-y: scroll;
        .purchase-items{
      margin-bottom: 30px;  
      margin-left: 10px;
        width: 52rem;
        height: max-content;
        background-color: #ffffff;
        display: flex;
        gap: 1rem;
        padding: 15px 15px;
        border: 1.5px solid grey;
        border-radius: 10px;
        .purchase-img{
          width:15rem;
          height: max-content;
          display: flex;
          gap:1rem;
          input{
            width: 20px;
            border: none; 
          }
        }
        .purchase-img:hover{
          scale: 1.06;
          transition: all .5s ease-in ;
        }
        .purchase-info{
          width: 40rem;
          height: max-content;
         
          .title{
            margin-top: 5px;
            padding-left: 30px;
            font-size: 19px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 500;
          }

          .rate-details{
            width: 20rem;
            margin-top: -10px;
            margin-left: 30px;
            gap:0.5rem;
            height: max-content;
            display: flex;
            flex-flow: column;
            .price{
              color: black;
              font-size: 20px;
              font-weight: 600;
            }
            .stock-details{
              color: green;
              font-size: 14px;
              .img-block{
                padding-top: 5px;
                padding-left: -20px;
              }
              .stock-offer{
                margin-top: 3px;
                font-size: 15px;
                font-family:sans-serif;
                color: black;
              }
            }
          }
          .select-btn{
            display: flex;
            flex-flow: row;
            gap: 5rem;
            width: 35rem;
            height: 25px;
            padding-left: 30px;
            .Quantity-count{
              
              width:100px;
             
              display: flex;
              
              .btn-count{
                font-size: 20px;
                border-radius: 30%;
                border: none;
                  width:50px;
                  cursor: pointer;
                }
                .btn-count:hover{
                  background-color: #e6e4e4;
                }
              .Qty-count{
                width: 50px;
                font-size: 15px;
                font-weight: 700;
                padding-left: 15px;
              padding-top: 3px;
                background-color: #ffffff;
              }
            }
          .btn-cart{
            margin-top: -5px;
            font-size: 18px;
            padding:5px 15px;
            background-color: #eaab0c;
            border: none;
            border-radius:20px;
          }
          .btn-cart:hover{
            background-color: #f8bd27;
          }
          }
        }
      }
      .purchase-items:hover{
      transform: scale(1.005);
      transition: all .3s ease-in ;
    }

      }
    }

    .subtotal-cart{
      width: 20rem;
      min-height: 100px;
  
      position: absolute;
      top:100px;
      right: 20px;
      background-color: rgb(250, 250, 250);
      display: flex;
      flex-flow:column;
      .offers-title{
        font-size: 16px;
        font-family: 'sans-serif';
        font-weight: 550;
        padding:20px 30px;
        svg{
          font-size: 22px;
        color: #00aefffa;
        }
      }
      .offered-eligble{
        padding: 15px 15px;
        margin-left: 10px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 25px;
      }
      .sub-total{
        font-size: 21px;
        font-family:sans-serif;
        padding:5px 20px;
        
      }
      .total-cash{
        padding-left:12.5rem ;
        margin-top: -30px;
        font-size: 24px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 700;
      }

      .buy-btn{
  
        font-size: 18px;
        position: absolute;
        bottom: 10px;
        left: 80px;
        border-radius: 10px;
        background-color: #eab30cec;
        border: none;
        padding: 8px 20px;
      }
      .buy-btn:hover{
        background-color:#eaab0c ;
        cursor: pointer;
      }

    }
    .head-cart2{ 
        width: 93%;
        height: 20px;
        margin-top: 0px;
        font-size: 28px;
        padding-top: 10px;
        padding-left: 20px;
        padding-bottom: 20px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 400;
        border-bottom: 2px solid gray;
      }
      .head-cart3{ 
        width: 93%;
        height: 20px;
        margin-top: 5px;
        margin-left: 50px;
        font-size: 24px;
        padding: 15px 10px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 400;
      }
      .reactly-buyed-items{
        width: 20rem;
        height:14rem;
        position: absolute;
        top:300px;
        right: 20px;
       
        background-color: rgb(250, 250, 250);
        .no-items{
          font-size: 20px;
          padding-left: 40px;
          padding: 20px 40px;
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-weight: 560;
        }
        .container-save-cart{
          width: 20rem;
          height: 8rem;
          overflow-y: scroll;
      overflow-x: hidden;
   
        }
      .save-cart{
      width:20rem;
         background-color: white;
      height: max-content;
      padding-left: 5px;
      .each-cart-items{
        width: 19rem;
        border: 1px solid grey;
        border-radius: 10px;
        margin-bottom: 10px;
        min-height: max-content;
        display: flex;
        flex-flow: column;
        .sub-cart-items{
          display: flex;
          img{
          padding: 5px 5px;
        }
        .title-saved-cart{
          width:15rem;
          padding-left:10px;
          font-size: 14px;
          font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-weight: 550;
        }
        }
    .btn-save{
      width: 80%;
      display: flex;
      padding-left: 3rem;
    margin-top: -10px;
    margin-left: 40px;
    margin-bottom: 10px;
      height: max-content;
      gap:2rem;

      button{
  
  font-size: 13px;
  border-radius: 5px;
  background-color: #eab30cec;
  border: none;
  padding: 5px;
  
}
button:hover{
  background-color:#c79517d9 ;
  cursor: pointer;
}
    }
      }

      }.save-cart:hover{
        transform: scale(1.009);
        transition: all .3s ease-in;
      }
      
      }
     
  }

  .btn-back-to-top{
         
         display: flex;
         justify-content: center;
         width: 100%;
           height: 50px;
           padding-bottom: 2rem;
           background-color: #dedadad7;
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
`

export default Checkoutpage;