import React, { useState } from 'react'
import EditPasswordForm from './EditPasswordForm';
import { useDispatch } from 'react-redux';
import { useEditPasswordMutation, useGetUserQuery } from '../../api/user';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { logout } from '../../api/slices/usersSlice';
import { toast } from 'react-toastify';


function Account() {
    const {userid} = useParams();
    const dispatch = useDispatch();

    const [formvalue, setFormValue] = useState(
        {current_password:'',new_password:'',
        confirm_new_password: ''}
    );
    const [showform, setShwoForm] = useState(false);
    const [errmsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [editPassword,{isLoading:editLoading}] = useEditPasswordMutation();
    const {data, error: userError, isLoading:userLoading, isSuccess: userSuccess} = useGetUserQuery(userid)

    

    let content;
    if(userLoading) {
        content = <Loading/>
    }else if(userError) {
        if(userError?.status === 500) {
            content = <userErrorPage/>
        }else if(userError?.status === 403) {
            dispatch(logout());
        }
    }else if(userSuccess) {
        content = data
    }
    
    const handleChange = (e)=> {
        const {name, value} = e.target;
        setFormValue({...formvalue, [name]:value});
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        
        const {current_password, new_password, confirm_new_password} = formvalue;
        if(current_password === "" || new_password === "" || confirm_new_password === "") {
            toast.error("Require All field", {
                position: toast.POSITION.TOP_RIGHT
            });
        }else if(confirm_new_password !== new_password) {
            toast.error("Confirm new password do not match to the new_password", {
                position: toast.POSITION.TOP_RIGHT
            });
        }else {
           
            try{
                const info = {
                    passwordInfo : {
                        current_password,
                        new_password
                    },
                    userid
                }
             
                await editPassword(info).unwrap();
                
                
                toast.success("Password changed successfully", {
                    position: toast.POSITION.TOP_RIGHT
                });
                setFormValue({current_password: "", new_password: "",confirm_new_password: ""});
                    
            }catch(err) {
                
                if(err) {
                    if(err?.status === 403) {
                        dispatch(logout());
                    }else if(err?.status === 500) {
                        content = <ErrorPage/>
                    }else if(err?.status === 400) {
                        
                        toast.error(err?.data, {
                            position: toast.POSITION.TOP_RIGHT
                        })
                    }
                }
            }
            
        }
    }
    
    
    return (
    <div className='md:mx-28 w-full mt-4' style={{minWidth:'450px'}}>
       { (userLoading || userError) ? content : <div className='w-96 sm:mx-auto'>
        <h5>Email</h5>
        <input type='email' value={data.email} disabled  
            className='px-2 py-2 border-2 border-gray-400 text-xl sm:w-4/5 md:w-4/5 mt-4 rounded'/>
        <div className='mt-4 md:w-4/5  sm:w-4/5'>
            <h5 className='mb-4'>Password</h5>
           <input disabled value={'*********'} className='border-2 w-10/12 inline-block px-4 py-2 rounded-l-lg'/>
           <button className='inline-block w-2/12 border-2 hover:bg-gray-300 py-2 ps-2 rounded-r-lg'
           onClick={()=> setShwoForm(!showform)}>Edit</button>
        </div>
        {showform && <div className='md:absolute top-80 left-96 relative'>
            {editLoading && <Loading/>}
            <EditPasswordForm error={errmsg} success={successMsg} showform={(e)=> {
                e.preventDefault()
                setShwoForm(false)}} 
                form={formvalue} 
                handlechange={handleChange} 
                handlesubmit={handleSubmit}/>
            </div>}
        </div>}
            
    </div>
  )
    
  
}

export default Account