import React from 'react'
import './home.css'


function HomeTextContent() {
  
  return (
    <div className='text-white image-div'>
        <div className=''>
          <img src={`${window.location.origin}/image/11472.jpg`} className='landing-page-image'/>
  
            <div className='text-content'>
                <p className='font-medium text-[#234391] dynamicfont'>Learn new technologies with CodeFreak</p>
                
            </div>
       
        </div>
        
       
    </div>
  )
}

export default HomeTextContent