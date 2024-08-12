import React, { useState } from 'react'
import './forgotpassword.css'
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../../api/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';


function PasswordReset({handleOpenPasswordResetbtn}) {
    
    const dispatch = useDispatch();
    const Navigate = useNavigate()
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [confirm_password, setConfirm_Password] = useState("")

    const [resetPassword] = useResetPasswordMutation()

    const handleSubmit = (e)=> {
        e.preventDefault();
        if(!email || !password || !confirm_password) return toast.error("Require all field", {
            position: toast.POSITION.TOP_CENTER
        })

        if(confirm_password !== password) return toast.error("Do not match confirm_password with password", {
            position: toast.POSITION.TOP_CENTER
        })

        if(password.length < 4) return toast.error("Password length not less than 4 charactors", {
            position: toast.POSITION.TOP_CENTER
        })

        resetPassword({email,password,confirm_password})
        .unwrap()
        .then(response=> {
            
            Navigate('/login')
            toast.success("Your password has been changed. Login with new password", {
                position: toast.POSITION.TOP_RIGHT
            })
            
            
        })
        .catch(err=> {
            switch (err.status) {
                case 400:
                    toast.error(err.data, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    break;
                case 500:
                    toast.error("Something went wrong please try again later", {
                        position: toast.POSITION.TOP_RIGHT
                    })
                default:
                    break;
            }
        })
    }
  return (
    <div id='forgotpasswordiv' className='border-2 p-4 '>
        <div>
            <div className='text-end'><button onClick={()=> handleOpenPasswordResetbtn()}><IoCloseSharp/></button></div>
            <form onSubmit={handleSubmit}>
            <input type='email' name='email' value={email} 
        onChange={(e)=> setEmail(e.target.value)} placeholder='Enter Your Email' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
            <input type='password' name='new_password' value={password} 
        onChange={(e)=> setPassword(e.target.value)} placeholder='Password' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
        <input type='password' name='confirm_new_password' value={confirm_password} 
        onChange={(e)=> setConfirm_Password(e.target.value)} placeholder='Confirm Password' 
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full mt-4 rounded'/>
             <button type='submit' 
        className='border-2 px-4 w-full text-white mt-2 py-2 hover:bg-blue-600 bg-blue-700 text-xl block '>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default PasswordReset