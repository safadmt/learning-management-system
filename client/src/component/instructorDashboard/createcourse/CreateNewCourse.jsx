import React, { useState } from 'react'
import AddCourse from './AddCourse'
import { useCreateCourseMutation } from '../../../api/course';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../api/slices/usersSlice';
import ErrorPage from '../../../pages/ErrorPage';
import InputCheckbox from '../../InputCheckbox';
import {toast} from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'

function CreateNewCourse() {
    let content;
    const {userid} = useParams();

    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const [isFetching, setIsFetching] = useState(false)
    const [imageErr, setImageErr] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fee_status: '',
        course_fee: '',
        category: '',
        ispublish: false,
        course_image: null,
    });

    const [createCourse, {isLoading}] = useCreateCourseMutation();
    
    // const addLesson = (e)=> {
    //     e.preventDefault()
        
    //     setFormData({
    //         ...formData,
    //         lessons: [...formData.lessons, {
    //             description: '',
    //             learning_video:''
    //         }]
    //     })
    // }


    const handleFileChange = (e) => {
        setFormData({...formData, course_image: e.target.files[0]})
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value})
    }


    // const lessonInputChange = (e,index) => {
    //     const {name,value} = e.target;
    //     const lessonCopy = [...formData.lessons];
    //     lessonCopy[index][name] = value;
    //     setFormData({
    //     ...formData,
    //     lessons: lessonCopy
    // });
    // }
    
    // const lessonFileChange = (e,index) => {
    //     const lessonCopy = [...formData.lessons];
    //     lessonCopy[index].learning_video = e.target.files[0];
    //     setFormData({
    //     ...formData,
    //     lessons: lessonCopy
    //     })
        
    // }
    
    const handleSubmit = (e)=> {
        e.preventDefault();
        console.log(formData)

        
        const {title,description,course_fee,category,course_image,fee_status,ispublish} = formData;
         if(title === "" || description === "" || fee_status === "" ||
        category === "" || course_image === null){
            toast.error("Required all field",{position:toast.POSITION.TOP_RIGHT});
        }else if((fee_status === "Paid" && course_fee === "")) {
            toast.error("Please fill the course fee",{position:toast.POSITION.TOP_RIGHT});
        }else if(course_image?.type !== "image/webp" && course_image?.type !== "image/jpeg"
        && course_image?.type !== "image/png") {
            toast.error("Select only image files", {position:toast.POSITION.TOP_RIGHT})
        }else {
            const form_Data = new FormData();
            form_Data.append('title', title);
            form_Data.append('description', description);
            form_Data.append("fee_status",fee_status)
            form_Data.append('category', category);
            form_Data.append('course_image', course_image);
            form_Data.append('ispublish', ispublish);
            if(fee_status === "Paid") {
                form_Data.append('course_fee', course_fee);
            }
            
            setIsFetching(true)
            createCourse({form_Data,userid}).unwrap().then(success=> {
                setIsFetching(false)
                if(success) {
                    toast.success("Uploaded successfully",{
                        position: toast.POSITION.TOP_RIGHT
                    })
                    setFormData({
                        title: '',
                        description: '',
                        course_fee: null,
                        course_image: null,
                        category : '',
                        ispublish: false,
                        fee_status: '',
                    })
                }
            }).catch(err=> {
                if(err?.status === 403) {
                    dispatch(logout);
                    Navigate('/login')
                }else if(err.status === 400) {
                    toast.error(err?.message || "Please fill all the form field", 
                    {position:toast.POSITION.TOP_RIGHT});
                }else if(err.status === 500) {
                    content = <ErrorPage/>
                }
            })
        }
    }
    return (
        <div>
            {content ? content : <div>
          
                <div className='w-10/12 mx-auto py-4 relative'>
                    <form onSubmit={handleSubmit}>
                        
                        <AddCourse 
                        course_details={formData} 
                        fileErr={imageErr} 
                        inputChange={handleChange} 
                        fileChange={handleFileChange} />
                
                        <InputCheckbox 
                        handleChange={()=> setFormData({...formData,ispublish:!formData.ispublish})} 
                        ischecked={formData.ispublish}/>
                        
                    </form>
                    {isFetching && <HashLoader color='#36d7b7' size={30} className='absolute top-2/4 left-2/4 z-0'/>}
                </div>
            </div>}
        </div>
    )
}

export default CreateNewCourse