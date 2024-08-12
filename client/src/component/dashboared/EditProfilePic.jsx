import React, { useEffect, useState } from 'react';
import {CgProfile} from 'react-icons/cg';
import handleUiMessges from '../../utils/handleUiMessges';
import { useDeleteProfilePicMutation, useGetUserQuery, useUploadProfilePicMutation } from '../../api/user';
import { logout } from '../../api/slices/usersSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ErrorPage from '../../pages/ErrorPage';
import DisplayImage from '../DisplayImage';
import Loading from '../Loading'
import {toast} from 'react-toastify'



function EditProfilePic({image}) {
  

  const {userid} = useParams();

  const fetchUser = useGetUserQuery(userid)


  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [file, setFile] = useState(null);
  

 const [uploadProfilePic, {isLoading}] = useUploadProfilePicMutation();
  let content;
  const [deleteProfilePic, {isLoading: isDeleteLoading}] = useDeleteProfilePicMutation();
  const style = {width: '150px', height:'150px', borderRadius:'50%' , margin:'auto'}

  

  const handleSubmit = async(e)=> {
    e.preventDefault();
    if(!file) {
      toast.error("Please select a file",{
        position: toast.POSITION.TOP_RIGHT
      })
    }else if(file.type !== 'image/webp' && file.type !== 'image/jpeg'){
      toast.error("Select an image file only" , {
        position: toast.POSITION.TOP_RIGHT
      })
    }else {

      try{
        
        const formData = new FormData();
        formData.append('profile_pic', file);
        
        await uploadProfilePic({formData,userid}).unwrap();
        fetchUser.refetch()
        toast.success("Uploaded successfull", {
          position: toast.POSITION.TOP_RIGHT
        });
        setFile(null);

      }catch(err) {
        if(err.status === 403) {
          dispatch(logout());
          Navigate('/login');
        }else if(err.status === 500) {
          content = <ErrorPage/>
        }
      }
    }
  
  }

  const handleDelete = async(e)=> {
    e.preventDefault();
    try{
      await deleteProfilePic(userid).unwrap();
      fetchUser.refetch()
      toast.success("Profile picture removed",{
        position: toast.POSITION.TOP_RIGHT
      });
    }catch(err) {
      
      if(err.status === 500) {
        content = <ErrorPage/>
      }else if(err.status === 403) {
        dispatch(logout());
        Navigate('/login')
      }
    }
    

  }
  return (
    <div className='w-96 mx-auto text-center flex flex-col justify-center items-center'>
       
       {content ? content : <div className='my-4 mx-auto'>
       {image ? <div className='flex flex-row'>
        <DisplayImage image={image} style={style}/>
        <div><button onClick={handleDelete}
        className='border-2 px-4 py-2 rounded mt-12 hover:bg-red-500'>Delete</button></div>
        </div> : <div style={{width: '100px'}} className='my-4 mx-auto'><CgProfile size={100}/></div>}
        <form onSubmit={handleSubmit} className='relative'>

          <label className='block mb-2 mt-2'>Change Or Upload new picture</label>
            
            {isLoading && <Loading/>}
            <input type='file' name='profie_pic' onChange={(e)=> setFile(e.target.files[0])}
            className='mb-2 border-2 rounded px-4 py-2 w-full'/>
            <button type='submit' 
            className='border-2 px-4 py-2 rounded hover:bg-emerald-400 mb-2 block'>Upload</button>
        </form>
        
        </div>}
       
    </div>

  )
}

export default EditProfilePic