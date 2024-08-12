import React from 'react'

function ErrorMsg({message}) {
  return (
    <div className='bg-red-600 text-white font-medium text-center'>{message}</div>
  )
}

export default ErrorMsg