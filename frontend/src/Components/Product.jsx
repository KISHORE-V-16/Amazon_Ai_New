import React, { useEffect, useRef,useState } from 'react'

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import CustomToast from './CustomToast.jsx'
import {collection,addDoc,updateDoc, doc,onSnapshot} from 'firebase/firestore'
import {firestore1} from '../utils/firebase.jsx'
import {addition,insubtotal, offermoney} from '../utils/redux-store-management.jsx';
import { useDispatch } from 'react-redux';
import ProDetailPage from '../pages/ProDetailPage.jsx';
import { useNavigate } from 'react-router-dom';


const Product = ({imgsrc,proinfo,price,rating,id,prodescription,key}) => {

    const myRef = useRef([]);

    const emaildata  = localStorage.getItem('emialids');

    const [visibilitystyles,setvisibilitystyles]  = useState(false);

    const [cartshow,setcartshow] = useState(true);

    const dispatch = useDispatch();
    const navigate= useNavigate();
    
    const notify = (proinfo) => toast.success(<CustomToast imageSrc={imgsrc} title={proinfo}/>, {
        position: 'top-right',
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });

      const[purchasedata , setpurchasedata] = useState([]);

      const purchasecollections = collection(firestore1,'purchaseitems');
      useEffect(()=>{

        const unsubscribe =  onSnapshot(purchasecollections,(snapshot)=> {
          const data = snapshot.docs.map(doc =>( {
            email:doc.data().emailid,
            count:doc.data().count,
            id:doc.id,
            imgsrc:doc.data().imgsrc,
            price:doc.data().price,
            rating:doc.data().rating,
            title:doc.data().title,
           
        }));
        setpurchasedata(data.filter((data)=> data.email == emaildata));
    
        })
        return ()=>{
          unsubscribe();
        }
          
      },[]);


    const prodetails = (imgsrc,proinfo,prodesc,price,rate) =>{

        navigate('/Prodetails',{state:{data:[{id:1,imgsrc,proinfo,prodesc,price,rate}]}});

    }

      const addpurchasedata = () =>{
         const findmatchdata = purchasedata.filter((data)=>data.imgsrc == imgsrc);
   
         if(!findmatchdata[0]){
            dispatch(addition());
        const getdata = collection(firestore1,'purchaseitems');
        addDoc(getdata,{"emailid":emaildata,"id":id,"title":proinfo,"price":price,"imgsrc":imgsrc,"rating":rating,"count":1})
        .then(res => console.log(res))
        .catch(error => console.log(error.message));
    }else{
        console.log(findmatchdata[0],"jubdw");
        const docref = doc(firestore1,'purchaseitems',findmatchdata[0].id);
        const adder = Number(findmatchdata[0].count);
        const updatedata = {"count":adder+1 }
        updateDoc(docref,updatedata).then(() => console.log("successfully done")).catch((error) => console.log("udwbvu",error));  
        }
}


  return (
    <>
    <Productstyles>
    <div   style={{opacity:`${visibilitystyles ? 0:1}`}} className="product">
        <div className="product-details">
       <p> {proinfo}</p>
        </div>
        <div className="pro-money">
          <strong>₹ {price}</strong>
        </div>
        <div className="product-ratings">
       <FaStar/>
       <FaStar/>
       <FaStar/>
       <FaStar/>
       <FaStar/>
        <div className="rating">
         <div className="rate">Rate: </div> {rating}
        </div>
        </div>
       <div className="img-btn">
       <img className='pro-images' src={`${imgsrc}`} onClick={()=>prodetails(imgsrc,proinfo,prodescription,price,rating)}  alt="" height={"190px"}/>
        <button className='btn' onClick={()=>{addpurchasedata();setcartshow(()=>{
           setcartshow(false);
           setTimeout(() => {
                setcartshow(true);
            }, 2000);
        });notify(proinfo);;dispatch(insubtotal(price));dispatch(offermoney(price));}} >{cartshow ? 'Add To Cart': (<div className='btn-cart-animation'><FaShoppingCart/>Added</div>)} </button>
       
       </div>
       
    </div>
    </Productstyles>
    </>
  )
}

const Productstyles = styled.div`
    .product{
        display: flex;
        flex-direction: column;
        width:90%;
        max-height: 420px;
        min-width:120px;
        padding: 10px;
        filter:brightness(99%);
        z-index: 13;
        background-color: #ffffff;
        transition:1s ease-in-out;
        .product-details{
            width:260px;
            height:80px;
            padding-left:0px;
            padding: 5px 5px;
            font-size: 16px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 400;
        }
        .pro-money{
            padding-left: 25px;
        padding-bottom: 5px;
        }
        .product-ratings{
            padding-left: 25px;
            padding-bottom: 5px;
                color: #ebeb12;
                
                .rating{
                    display: flex;
                    gap:1.2rem;
                    padding-bottom: 5px;
                    color:#cd9400;
                    .rate{
                        font-size: 15px;
                        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                        font-weight: 600;
                        color: #d5580fde;
                    }
                }

                a{
                    text-decoration: none;
                }
        }
        .pro-images{
            width: 200px;
        }
        .pro-images:hover{
            scale: 1.09;
            transition: all .5s ease-in-out;
        }
        .btn{
            width: 8rem;
            margin-top: 0px;
            background-color: #cd9400;
            border: none;
            padding: 10px;
            font-size: 15px;
            color:black;
            border-radius: 10px;
            cursor:pointer;
            transition:.3s ease-in-out;
        }
        .btn:hover{
            background-color : #ffb702;
            box-shadow: 2px 2px 15px lightyellow;
            color: white;

        }
        .btn:active{
            transform: scale(.9);
        }
        .img-btn{
            display: flex;
            flex-flow: column;
            align-items: center;
            gap:0.8rem;
            
        }

        .btn-cart-animation{
            padding-left: 20px;
        display: flex;
        gap: 0.5rem;
        color: whitesmoke;
        svg{
            font-size: 20px;
            color: whitesmoke;
        }
        animation:cart_animate  2s 0s 1  ease-in-out;
        }
    }
    .product:hover{
        transform:scale(1.075);
        transition: .5s ease-in-out;
    
    }

    @keyframes cart_animation {
     0%{
        transform: translateX(5px);
     }   
     50%{
        transform: translateX(10px);
     }
     100%{
        transform: translateX(15px);
     }
    }

`

export default Product