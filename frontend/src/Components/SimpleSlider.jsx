import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { imgdata } from '../utils/imageimport';
import styled from 'styled-components';
import './SimpleSlidercss.css'
import { motion } from 'framer-motion';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
const SimpleSlider = () => {
    const settings = {
      dots:true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true, 
    autoplaySpeed: 5000,
    
    };


    return (
      < Simpleslider>
      <div>
      <motion.div initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale:1 }}
             transition={{ type:'spring',duration: 1.5,stiffness:450,damping:50 }}> 
       <div className="all-images">
        <Slider {...settings} className="my-slider">
          <div>
          <img className='home-images' src={imgdata[1]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
          <div>
          <img  className='home-images' src={imgdata[0]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
          <div>
          <img  className='home-images' src={imgdata[2]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
         <div>
          <img  className='home-images' src={imgdata[3]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
          <div>
          <img  className='home-images' src={imgdata[4]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
          <div>
          <img  className='home-images' src={imgdata[5]} alt="images11" width={"100%"} height={"400px"}/>
          </div>
        </Slider>
      </div>
      </motion.div>
      </div>
      </Simpleslider>
    );
  };

  const Simpleslider = styled.div`
    .all-images{
      display: flex;
      flex-flow: column;

      .home-images{
               
               z-index: 0;
               margin-top: 60px;
               margin-bottom:0px;
               mask-image: none;
               -webkit-mask-image: linear-gradient(to top, transparent 3%, white 50%);
           }

           .slick-dots {
  position: absolute;
  bottom: 100px;
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.slick-dots li {
  margin: 0px 5px; /* Adjust the spacing between dots */
}

.slick-dots li button {
  li{
    width: 10px;
  }
 background-color: whitesmoke;
  border-radius: 50%;
  border: 2px solid whitesmoke;
  cursor: pointer;

}

.slick-dots li.slick-active button {
  background:#494949; /* Adjust the color of the active dot */
border: none;
}

    }
  
    
  `
  
  export default SimpleSlider;