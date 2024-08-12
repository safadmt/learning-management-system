import React, { useEffect, useState } from 'react'
import { useEditInstructorInfoMutation, useGetInstructorInfoQuery } from '../../api/user'
import { useNavigate, useParams } from 'react-router-dom'
import HashLoader from 'react-spinners/HashLoader';
import ErrorPage from '../../pages/ErrorPage';
import FormInput from '../teachoncodefreak/FormInput';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredential } from '../../api/slices/usersSlice';

function EditInstructorInfo() {
    let content;

    const dispatch = useDispatch()
    const Navigate = useNavigate();

    const {userid} = useParams()
    const [formvalue, setFormValue] = useState({
        highest_level_education: "", currently_work: "", subject_area: "", experience: "", aboutyourself: "",
        education_subject: "", university: ""
      })

    const {user} = useSelector(state=> state.userInfo)
    const {data:Info, isLoading, isError,error} = useGetInstructorInfoQuery(userid)
    const [editInstructorInfo] = useEditInstructorInfoMutation()
    useEffect(()=> {
        if(isLoading) {
            content = <HashLoader size={30} color='#36d7b7' className='flex justify-center'/>
        }else if(isError) {
            switch (error.status) {
                case 400:
                    console.log(error.data)
                    break;
                case 500:
                    content = <ErrorPage/>
                    break;
                default:
                    break;
            }
        }else if(Info) {
            setFormValue({
                highest_level_education: Info?.highest_level_education || "",
                currently_work: Info?.currently_work || "",
                subject_area: Info?.subject_area || "",
                experience: Info?.experience || "",
                aboutyourself: Info?.aboutyourself || "",
                education_subject: Info?.education_subject || "", 
                university: Info?.university || ""
              })
        }
    },[Info,isLoading,isError])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formvalue, [name]: value })
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formvalue)
        const { currently_work, subject_area, experience, aboutyourself,
          education_subject, university, highest_level_education } = formvalue;
        if (currently_work === "" || subject_area === "" || experience === "" || aboutyourself === ""
          || highest_level_education === "" || education_subject === "" || university === "") {
          toast.error("Required all field", {
            position: toast.POSITION.TOP_RIGHT
          });
        } else {
          
          const info = {
            currently_work,
            subject_area,
            experience,
            aboutyourself,
            highest_level_education,
            education_subject,
            university
          }
          editInstructorInfo({info, userid:user?._id})
          .unwrap()
          .then(response => {
            toast.success("Updated successfully", {
              position: toast.POSITION.TOP_RIGHT
            })
            
          }).catch(err => {
            switch (err.status) {
                case 400:
                    toast.error(err.data || "Please fill up all the field", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    break;
                case 500:
                    content = <ErrorPage />
                    break;
                case 403:
                    dispatch(logout());
                    Navigate('/login')
                    break;
                default:
                    break;
            }
            
          })
        }
      }
  return (
    <div className='flex justify-center sm:w-11/12 md:w-11/12'>
        {content ? content : 
        <FormInput 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
        formvalue={formvalue}/>}
        
    </div>
  )
}

export default EditInstructorInfo