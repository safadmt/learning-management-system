import React from 'react'


function Addmodule({ }) {
   
    // const addLesson = (e)=> {
    //     e.preventDefault();
    //     addlesson()
    // }
    // const lessonFileChange = (e)=> {
    //   lessonfileChange(e)
    // }
    // const lessonInputChange = (e)=> {
    //   lessoninputChange(e)
    // }
    
    // const handleChange = (e)=> {
    //   modulChange(e)
    // }
  return (
    <div>
        <label className='font-medium text-lg'>Title</label>
        <input type='text' name='title' value={module.title}
        onChange={handleChange}
        className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded'/>
        <label>Description</label>
        <input type='text' name='description' value={module.description}
        onChange={handleChange}
        className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded'/>
        <h6 className='font-medium text-xl my-2'>Lessons</h6>
        
        <button onClick={addLesson} className='border-2 px-4 py-2 hover:bg-emerald-400 mb-2'>Add lesson</button>
    </div>
  )
}

export default Addmodule