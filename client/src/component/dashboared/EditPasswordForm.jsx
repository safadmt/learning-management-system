import React from 'react'
import {IoCloseSharp} from 'react-icons/io5'
function EditPasswordForm({form,handlechange,handlesubmit,showform,error, success}) {
    const handleChange = (e)=> {
        handlechange(e)
    }
    const handleSubmit = (e)=> {
        handlesubmit(e);
    }
    const showForm = (e) => {
        showform(e)
    }
  return (
    <div className='p-4 bg-[#234391] text-center w-96 mx-auto'>
        <div className='text-end'><button onClick={showForm}><IoCloseSharp color='white' size={25}/></button></div>
        <form onSubmit={handleSubmit}>
            {error && <p className='bg-red-600 text-center'>{error}</p>}
            {success && <p className='bg-emerald-500 text-center'>{success}</p>}
            <input type='password' name='current_password' form={form.current_password} 
            onChange={handleChange} placeholder='Enter your current password' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
        <input type='password' name='new_password' value={form.new_password} 
        onChange={handleChange} placeholder='Enter your new password' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
        <input type='password' name='confirm_new_password' value={form.confirm_new_password} 
        onChange={handleChange} placeholder='Confirm password' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
        <button type='submit' 
        className='border-2 px-4 w-full mt-2 py-2 text-white text-xl block '>Submit</button>
        </form>
        

    </div>
  )
}

export default EditPasswordForm;