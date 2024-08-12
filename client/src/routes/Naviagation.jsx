import React from 'react'
import { Route, Routes} from 'react-router-dom'

import AdminHome from '../pages/admin/AdminHome'
import AdminLogin from '../pages/admin/AdminLogin'
import HomeRoute from './HomeRoute'
import Footer from '../component/footer/Footer'

function Naviagation() {
  return (
    <div>
        <div className='contentdiv'>
        <Routes>
            <Route path='/*' element={<HomeRoute/>}/>
            <Route path='/admin/*' element={<AdminHome/>}/>
            <Route path='/admin-login' element={<AdminLogin/>}/>
            
        </Routes>
        </div>
        <Footer/>
    </div>
  )
}

export default Naviagation