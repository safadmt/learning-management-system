import React, { useState } from 'react'
import { useAddUserInfoMutation } from '../../api/user'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../api/slices/usersSlice';
import { toast } from 'react-toastify';
import Loading from '../Loading';

function Form({info}) {
    const {userid} = useParams();
    const dispatch = useDispatch();
    const {first_name, last_name, occupation, facebook, instagram} = info

    const [form, setForm] = useState({
      first_name: first_name ? first_name : '', 
      last_name: last_name ? last_name : '',
      occupation: occupation ? occupation : '',
      facebook:facebook ? facebook : '',
      instagram: instagram ? instagram : '' }
    )
    
    const [editUserInfo, {isLoading}] = useAddUserInfoMutation();
    

    const handleChange = (e)=> {
        const {name,value} = e.target;
        setForm({...form, [name]:value})
    }
  const handleSubmit = async(e)=> {
    e.preventDefault();
    console.log(form)
    const {first_name , last_name, occupation, facebook, instagram} = form
    if(!first_name || !last_name || !occupation || !facebook || !instagram) {
      
      return toast.error("Required all field", {
        position: toast.POSITION.TOP_RIGHT
      });
    }else {
      try{
        const info = {
          userInfo : form,
          userid
        }
        await editUserInfo(info).unwrap();
        toast.success("Profile Updated successfully", {
          position: toast.POSITION.TOP_RIGHT
        })
      }catch(err) {
        if(err?.status === 500) {
          console.log(err)
        }else if(err?.status === 403) {
          dispatch(logout());
        }else if(err?.status === 401) {
          toast.error(err?.data || "Require all field", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
    }
    
  }

  return (
    <div className=''>
        <div className='w-6/12 mx-auto'>
        <form className='mt-4 relative' onSubmit={handleSubmit}>
            {isLoading && <Loading/>}
           
            <input type='text' name='first_name' value={form.first_name} onChange={handleChange} placeholder='Type First name' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
            <input type='text' name='last_name' value={form.last_name} onChange={handleChange} placeholder='Type Last name' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/> 
            
            <input type='text' name='occupation' value={form.occupation}
            onChange={handleChange} placeholder='About You, like "Web Developer or Student"' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
            <input type='text' name='facebook' value={form.facebook} onChange={handleChange} placeholder='Facebook link' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/> 
            <input type='text' name='instagram' value={form.instagram} onChange={handleChange} placeholder='Instagarm link' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>     
           <button type='submit' className='border-2 px-4 mt-2 py-2 bg-[#234391] text-white text-xl block w-full'>Submit</button>
        </form>
        </div>
    </div>
  )
}

export default Form