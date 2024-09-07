import { useState } from 'react'
import Home from './pages/Home'
import styled from 'styled-components'
import { Provider } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Checkoutpage from './pages/Checkoutpage'
import SignIn from './pages/SignIn'
import CreateAccount from './pages/SignOut'
import PhoneSigIn from './pages/PhoneSigIn'
import ProDetailPage from './pages/ProDetailPage'
import Searchenginepage from './pages/Searchenginepage'
import { Tensorflow } from './Components/Tensorflow'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <Appstyles>
      <div className="app">
      <BrowserRouter>
      <Routes>
        <Route exact path='/Home' element={<Home/>}/>
        <Route exact path='/checkout' element={<Checkoutpage/>}/>
        <Route exact path='/signIn' element={<SignIn/>}/>
        <Route exact path='/signOut' element={<CreateAccount/>}/>
        <Route exact path='/Phonesigin' element={<PhoneSigIn/>}/>
        <Route exact path='/Prodetails' element={<ProDetailPage/>}/>
        <Route exact path='/Searchpage' element={<Searchenginepage/>}/>
        <Route exact path='/T' element={<Tensorflow/>}/>
      </Routes>
      </BrowserRouter>
      </div>
      </Appstyles>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
    </>
  )
}

const Appstyles=styled.div`
.app{
  margin: -10px;
  padding: 0px;
  box-sizing: border-box;

}
`

export default App;
