import React, { useState } from 'react'
import handleUiMessges from '../../utils/handleUiMessges';
import { useAddInstructorInfoMutation } from '../../api/user';
import ErrorPage from '../ErrorPage';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredential } from '../../api/slices/usersSlice';
import FormInput from '../../component/teachoncodefreak/FormInput';
import { toast } from 'react-toastify';


function TeacherHome() {
  let content;

  const { user } = useSelector(state => state.userInfo);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState(null);
  const [formvalue, setFormValue] = useState({
    highest_level_education: "", currently_work: "", subject_area: "", experience: "", aboutyourself: "",
    education_subject: "", university: ""
  })

  const [formerr, setFormErr] = useState({
    education: "", currently_work: "", subject_area: "", experience: "", aboutyourself: ""
  });

  const [addInstructorInfo, { }] = useAddInstructorInfoMutation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formvalue, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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
      addInstructorInfo({info, userid:user._id}).unwrap().then(response => {
        console.log(response)
        dispatch(setCredential(response))
        Navigate(`/instructor/${user._id}`)
      }).catch(err => {
        if (err.status === 400) {
          toast.error(err.data || "Please fill up all the field", {
            position: toast.POSITION.TOP_RIGHT
          });
        } else if (err.status === 500) {
          content = <ErrorPage />
        } else if (err.status === 403) {
          dispatch(logout());
          Navigate('/login')
        }
      })


    }
  }

  return (
    <div>
    {content ? content : <div>
      <div className='bg-red-300 h-56 text-center flex flex-col justify-center items-center'>
        <div>
          <h1 className='font-medium text-4xl'>Come teach with us</h1>
          <p>Become an instructor and change lives</p>
        </div>
        

      </div>
      <FormInput formvalue={formvalue} handleChange={handleChange} handleSubmit={handleSubmit}/>
    </div>}
    </div>
  )
}

export default TeacherHome;