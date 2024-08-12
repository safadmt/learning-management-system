import React from 'react'

function FileInputForm({fileChange}) {
    const handleFileChange = (e)=> {
        fileChange(e)
    }
  return <input type='file' name='learning_video' onChange={handleFileChange}
  className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded'/>
  
}

export default FileInputForm