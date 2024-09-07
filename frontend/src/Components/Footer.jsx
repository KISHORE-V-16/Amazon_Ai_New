import React, { useRef,useState,useEffect } from 'react'

import styled from 'styled-components'
import img from '../store/images/amazon-logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Foooter = () => {


    const myRef = useRef();
  const [visibilitystyles,setvisibilitystyles]  = useState(false);

useEffect(()=>{
 
  const observer = new IntersectionObserver((entries)=>{
    const entry = entries[0];
    setvisibilitystyles(entry.isIntersecting);
  });
observer.observe(myRef.current);
},[]);


  return (
    <>
    <StylesFooter>
        
    <div ref={myRef} style={{opacity:`${visibilitystyles ? 1:0}`}} className='footer-body'>
        <div className="footer-container">
            <div className="info-box-common">
                <h3>Get to Know Us</h3>
                <a href="#" className='info-common'>About Us</a>
                <a href="#" className='info-common'>Careers</a>
                <a href="#"className='info-common'>Press Releases</a>
                <a href="#"className='info-common'>Amazon Science</a>
            </div>
            <div className="info-box-common">
                <h3>Connect With Us</h3>
                <a href="#" className='info-common'>FaceBook</a>
                <a href="#" className='info-common'>Twitter</a>
                <a href="#"className='info-common'>Instagram</a>
            </div>
            <div className="info-box-common">
                <h3>Make Money With Us</h3>
                <a href="#" className='info-common'>Sell On Amazon</a>
                <a href="#" className='info-common'>Sell Under Amazon Accelerator</a>
                <a href="#"className='info-common'>Become An affiliate</a>
                <a href="#"className='info-common'>Advertise Your Products</a>
            </div>
            <div className="info-box-common">
                <h3>Let Us Help You</h3>
                <a href="#" className='info-common'>Your Account</a>
                <a href="#" className='info-common'>Returns Center</a>
                <a href="#"className='info-common'>Amazon App Download</a>
                <a href="#"className='info-common'>Help</a>
            </div >
        </div>
        <Link to='/Home'>
            <img src={img} width={"140px"} height={"40px"} alt="amazon-logo" />
            </Link>
    </div>

   </StylesFooter>
   </>
  )
}

const StylesFooter = styled.div`
    
.footer-body{
    transition:1.5s ease;
    padding-left:50px;
    padding-right: 50px;
    padding-top: 10px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background-color: #11171E;
    color: whitesmoke;
    display:flex;
    flex-flow: column;
    
    .footer-container{
        display: flex;
        flex-flow: row;
        gap: 10rem;
        width: 100%;
        height: 300px;

        .info-box-common{
            width: 200px;
            height: 250px;
            display: flex;
            flex-flow:column;
            gap:1rem;
            
            a{
                text-decoration: none;
                color: #a09b9b;
            }

            a:hover{
                text-decoration:underline;
                color:white;
            }
        }
    }

    img{
        padding: 0px;
        padding-bottom: 2rem;
        margin-left: 30rem;
    }

}
`

export default Foooter