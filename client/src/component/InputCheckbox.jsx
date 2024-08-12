import React from 'react'

function InputCheckbox({handleChange,ischecked}) {
  return (
    <div>
        <input type='checkbox' checked={ischecked} className='px-4 py-2 border-2 border-gray-400 text-xl my-2 rounded' 
        placeholder='Select for Publish course or publish later'
        onChange={handleChange}/>
        <lable className='ms-4'>Click here to publish your course , or publish later</lable>
    </div>
  )
}

export default InputCheckbox