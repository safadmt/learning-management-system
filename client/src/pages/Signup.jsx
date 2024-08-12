import React, { useState } from 'react';
import localforage from 'localforage';
import SignupCom from '../component/SignupCom';
import { useCreateUserMutation } from '../api/user';
import { useNavigate } from 'react-router-dom';
import { setCredential } from '../api/slices/usersSlice';
import { useDispatch } from 'react-redux';
import { toast} from 'react-toastify';
function Signup() {

    const Navigate = useNavigate(); 
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null);
    const [userInfo, setUserInfo] = useState({first_name: "", email: "" , password: ""});

    const [createUser, {isLoading}] = useCreateUserMutation()

    const displayMessage = (data, setState)=> {
        setState(data)
        setTimeout(() => {
            setState(null)
        }, 4000);
    }

    const handleChange = (e)=> {
     
      const {name, value} = e.target;
      setUserInfo({...userInfo, [name]:value})
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()
       
          const {first_name, email, password} = userInfo;
        if(first_name === "" || email === "" || password === "")
        return displayMessage("Required all field", setErrors)

        if(password.length < 4) return displayMessage("Password must be 4 or more charactors long",setErrors)

          createUser({first_name,email,password}).unwrap()
          .then(response=> {
                console.log("created")
                  dispatch(setCredential(response))
                  Navigate('/')
                  toast.success("Signup successfull",{
                    position: toast.POSITION.TOP_RIGHT
                } )
                  
          })
          .catch(err=>  {
           switch(err.status) {
            case 401:
              toast.error(err.data,{
                position: toast.POSITION.TOP_RIGHT
            } )
            break;
            case 400: 
            toast.error(err.data,{
              position: toast.POSITION.TOP_RIGHT
          } )
            break;
            default:
              console.log(err.data)
              break;
           }
            
          
        })
          
          
          
        
        
    }
  return (
    <div>
      <SignupCom error={errors} success={success} handlechange={handleChange} 
      handlesubmit={handleSubmit} info={userInfo}/>
    </div>
  )
}

export default Signup;