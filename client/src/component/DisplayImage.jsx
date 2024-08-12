import React from 'react'
import { AWS_S3_DOMAIN_NAME } from '../config'

function DisplayImage({image, style}) {
    if(image) {
         return (
    <div style={style}>
        <img src={`${AWS_S3_DOMAIN_NAME}/${image}`}  
                alt='Profile pic' style={{width: '150px', height:'150px', borderRadius:'50%',objectFit:"cover"}}/>
             
    </div>
  )
    }
 
}

export default DisplayImage