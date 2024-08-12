import React from 'react'

import HashLoader from 'react-spinners/HashLoader'
function Loading() {
  return (
    <div style={{position:"absolute",top:'30%', left: "30%"}}>
       <HashLoader size={40} color='#36d7b7' />

      </div>
  )
}

export default Loading;