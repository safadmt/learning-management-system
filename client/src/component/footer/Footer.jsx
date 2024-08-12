import React from 'react'
import './footer.css'
import { useNavigate } from 'react-router-dom'

function Footer() {
    const Navigate = useNavigate();
  return (
    <div id='footersection'>
        <div className='footercontent'>
            <div>
            <ul>
                <li>CodeFreak Business</li>
                <li>Teach on CodeFreak</li>
                <li>About us</li>
                <li>Contact us</li>
            </ul>
        </div>
        <div>
            <ul>
                <li>Careers</li>
                <li>Blog</li>
                <li>help</li>
                <li>Support</li>
            </ul>
        </div>
        <div>
            <ul>
                <li>Terms</li>
                <li>Privacy policy</li>
                <li>Cookie settings</li>
            </ul>
        </div>
        </div>
        <div ><span onClick={()=> Navigate('/')} className='font-medium text-2xl text-left '>CodeFreak</span></div>
    </div>
  )
}

export default Footer