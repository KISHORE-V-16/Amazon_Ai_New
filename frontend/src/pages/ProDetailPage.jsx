import React from 'react'
import Header from '../Components/Header'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactImageMagnify from 'react-image-magnify';

import { FaStar } from 'react-icons/fa';
import {BiChevronDown} from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router-dom';
import {BsArrowLeft} from 'react-icons/bs';
import Foooter from '../Components/Footer';

const ProDetailPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const{ data} = location.state;
    const cartcount = useSelector((state) => state.cart.cartcount);

  return (
    <Prostyles>
    <>
    <header>
    <Header cartcount={cartcount} pagename={'Prodetails'}/>
    </header>
   <div className="body">
    <div className="pro-detail-container">

<div className="pro-detail-box">

    <div className="img-container">
    <div
         className='arrow-styles'>
 <BsArrowLeft onClick={()=>navigate(-1)}/>
         </div>
<div className="img-src" style={{width:"200px",height:"200px"}}>
<ReactImageMagnify {...{
    smallImage: {
        alt: 'pro-info',
        isFluidWidth: true,
        className:'img-info',
        src: `${data[0].imgsrc}`
    },
    largeImage: {
        src: `${data[0].imgsrc}`,
        width: 450,
        height: 450
    },
    magnificationLevel: 3,
    
  
}} />
</div>
   
    </div>
    <div className="details-container">
        <h4 className='pro-info'>{data[0].proinfo}</h4>
        <h3 className='price-info'>₹ {data[0].price}</h3>
         <div className="product-ratings">
       <FaStar/>
       <FaStar/>
       <FaStar/>
       <FaStar/>
       
       <div className="review-container">
        <div className="rating">
         <div className="rate">Rate: </div>{data[0].rate}</div>
        <a className='review' href="/review">Review <BiChevronDown/></a>
        </div>
       </div>
       
        <div className='description-info'>
            <h4 className='head-desc'>Description ::</h4>
            <p >{data[0].prodesc}</p>
            </div>
       
        

    </div>
</div>
    </div>
   </div>
    <Foooter/>
    </>
    </Prostyles>
  )
}

const Prostyles= styled.div`
    
.body{
    width: 100%;
    height: 35rem;
    background-color: #dedadad7;
    display: flex;

    .pro-detail-container{
     display: flex;
     justify-content: center;

        margin-top: 7rem;
        width: 100%;
        height: 25rem;
      
      .img-container{
        display: flex;
        flex-flow:column;
        gap: 2rem;
      }
        .arrow-styles{
           
            width: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50px;
            height: 35px;
            background-color: #b4b4b4;
            margin-left: -12rem;
            margin-top: -7rem;
          
           svg{
            font-size: 20px;
           }
           
           }
           .arrow-styles:hover{
            background-color: #d7d7d7;
           svg{
            scale:1.1;
            transition: all .2s ease-in;
           }
           }

           .img-src{
            width: 250px;
            height: 250px;
            
           }

        .pro-detail-box{
            border-radius: 20px;
            width: 50%;
            height: 25rem;
            background-color: #bcbcbcc8;
            display: flex;
            flex-flow:row;
            .img-container{
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
            width:16rem;
            height: 25rem;
            background-color: #ffffff;
            
           
            }
            .details-container{
            .head-desc{
                color:#373737;
                padding-left: 20px;
                font-size: 20px;
            }

                width: 24rem;
                height: 25rem;
                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                .pro-info{
                    padding-left: 15px;
                    color: #373737;
                    font-size: larger;
                }

                .product-ratings{
            
            padding-left: 20px;
                color: #ebeb12;
                .review-container{
                    display: flex;
                    flex-flow: row;
                    gap: 2rem;
                   padding-top: 10px;
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
                    color: #313131;
                }
                a:hover{
                    color: #000000;
                    scale: 1.1;
                    transition: all .2s ease-in;
                }
                }
               
        }
            }

            .price-info{
                padding-left: 20px;
                color: #373737;
            }
            
            .description-info{
                width: 21rem;

                padding-top: 0px;
                p{
                    padding-left: 20px;
                    color: #3b3b3b;
                    font-size: 12px;
                    font-family: sans-serif;
                }
            }

            
        }
    }
}

`

export default ProDetailPage