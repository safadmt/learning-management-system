import React from 'react'

function SubmitButton({btnname}) {
  return <button type='submit' className='hover:border-2 text-white py-2 w-full px-4 bg-[#234391]'>{btnname}</button>
  
}

export default SubmitButton