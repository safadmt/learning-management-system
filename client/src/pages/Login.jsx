import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../api/user';
import LoginCom from '../component/LoginCom'
import ErrorPage from './ErrorPage';
import { useDispatch } from 'react-redux';
import { setCredential } from '../api/slices/usersSlice';
import { toast } from 'react-toastify';

function Login() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState(false)
  const [loginUser, { isLoading }] = useLoginUserMutation()

  const displayMessage = (data, setState) => {
    setState(data)
    setTimeout(() => {
      setState(null)
    }, 4000);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = userInfo;

    if (!email || !password) {
      toast.error("Please include User credentials", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      try {
        const response = await loginUser({ email, password }).unwrap();
        dispatch(setCredential(response))
        toast.success("Login success", {
          position: toast.POSITION.TOP_RIGHT
        })
        Navigate('/')
      } catch (err) {
        switch (err.status) {
          case 401:
            toast.error(err.data || "Required all field", {
              position: toast.POSITION.TOP_RIGHT
            })
            break;
          case 404:
            toast.error(err.data || 'Email not found in the databae', {
              position: toast.POSITION.TOP_RIGHT
            })
            break;
          case 500:
            setServerError(true)
          default:
            setServerError(true)
        }

      }
    }

  }
  return (
    <div>
      {serverError ? <ErrorPage /> :
        <LoginCom info={userInfo} handlechange={handleChange} handlesubmit={handleSubmit} />}

    </div>
  )
}

export default Login