import React, { useEffect, useState } from 'react'
import './forgotPassword.css'
import { useForgotPasswordMutation, useVerfiyOTPMutation } from '../../api/user'
import {toast} from 'react-toastify'
import SetTimer from '../../component/forgotpassword/SetTimer'
import PasswordReset from '../../component/forgotpassword/PasswordReset'

function ForgotPassword() {
    const [email,setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [showTimer, setShowTimer] = useState(false)
    const [loading,setLoading] = useState("")
    const [showPasswordResetForm, setShowPasswordResetForm] = useState(false)

    const [forgotPassword,{isLoading}] = useForgotPasswordMutation();
    const [sendVerifyOTP] = useVerfiyOTPMutation()

    //Handle timeout 

    const handleTimer = (istrue)=> {
        setShowTimer(istrue)
    }

    useEffect(()=> {
        if(isLoading) {
            setLoading("Loading...")
        }
        
    },[isLoading])

    const handleSubmitEmail = (e)=> {
        e.preventDefault()
        console.log("hello")
        if(!email) return toast.error("Empty email field", {
            position:toast.POSITION.TOP_CENTER
        })
        forgotPassword(email)
        .unwrap()
        .then(response=> {
            setLoading("")
            toast.success(response || "Email has been send to your email", {
                position:toast.POSITION.TOP_CENTER
            })
            setShowTimer(true)
        })
        .catch(err=> {
            console.log(err)
            switch (err.status) {
                case 400:
                    toast.error("Empty email field", {
                        position:toast.POSITION.TOP_CENTER
                    })
                    break;
                case 500:
                    console.log(err);
                    break;
                default:
                    break;
            }
        })
    }

    const handlVerfiyOtp = (e)=> {
        e.preventDefault()
        
        if(!otp) return toast.error("OTP field is empty", {
            position:toast.POSITION.TOP_CENTER
        })

        sendVerifyOTP(otp)
        .unwrap()
        .then(response=> {
            toast.success(response, {
                position:toast.POSITION.TOP_CENTER
            })
            setShowPasswordResetForm(true)
            
        })
        .catch(err=> {
            switch (err.status) {
                case 400:
                    toast.error("Empty email field", {
                        position:toast.POSITION.TOP_CENTER
                    })
                    break;
                case 500:
                    console.log(err);
                    break;
                default:
                    break;
            }
        })
    }

    
  return (
    <div id='forgotpasswordmaindiv'>
        <div id='forgotpasswordformdiv'>
            <form onSubmit={handleSubmitEmail} >
                <p className='text-center font-medium'>Enter your email address to send OTP</p>
                {loading !== "" && <p className='text-center text-green-600'>{loading}</p>}
                <input type='email' name='email' value={email} placeholder="Email"
              className='block px-4 py-1 w-full text-2xl border-b-4  border-slate-300 mb-4 pb-2'
              onChange={(e)=> setEmail(e.target.value)} />
               <div className='flex justify-center'>
              <button type='submit' className='float-center text-white bg-blue-700 px-4 py-1 hover:bg-blue-600'>Generate OTP</button>
               </div> 
            </form>

           {showTimer &&  <form onSubmit={handlVerfiyOtp} className='pt-6'>
                <p className='text-center font-medium'>Enter the OTP send to your email</p>
                <div className='flex gap-0.5 justify-center '>
                    <p className=''>OTP valid for </p><SetTimer handleTimer={handleTimer}/><p>seconds</p>
                    </div>
                <input type='number' name='otp' value={otp} placeholder="OTP"
              className='block px-4 py-1 w-full text-2xl border-b-4  border-slate-300 mb-4 pb-2'
              onChange={(e)=> setOtp(e.target.value)} />
              <div className='flex justify-center'>
                <button type='submit' className='text-white bg-blue-700 px-4 py-1 hover:bg-blue-600'>Verify OTP</button>
              </div>
              
            </form>}
            {showPasswordResetForm &&  <PasswordReset handleOpenPasswordResetbtn={()=> setShowPasswordResetForm(false)}/>}
        </div>
        
    </div>
  )
}

export default ForgotPassword