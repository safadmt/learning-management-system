import React from 'react'

function InputSelect({categories, handleChange,currentvalue}) {
  
  return (
    <div><select className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded'
    name='category' onChange={handleChange}>
       <option value={currentvalue?._id ? currentvalue._id : ""}>
        {currentvalue?.category_name ? currentvalue.category_name : "Select category"}</option>
       {categories.map((category,index)=> {
           return <option key={index} value={category?._id}>{category?.category_name}</option>
       })}
       
   </select></div>
  )
}

export default InputSelect