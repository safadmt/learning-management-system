import React from 'react'


function AddLesson({lessoninfo, inputChange}) {
 
  const handleChange = (e)=> {
    inputChange(e)
  }
  
  return (
    <div>
        <label className='font-medium text-lg'>Description</label>
        <input type='text' name='description'
        value={lessoninfo.description}
        onChange={handleChange}
        className='px-2 py-2 border-2 text-black border-gray-400 text-xl w-full my-2 rounded'/>
        
    </div>
  )
}

export default AddLesson;