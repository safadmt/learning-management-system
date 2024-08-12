import { useDispatch, useSelector } from "react-redux"
import '../instructor.css'
import './addandviewcourse.css'
import { useAddNewLessonMutation,useGetAllCourseQuery, useGetCourseQuery, useIsPublishCourseMutation } from "../../../api/course"
import Loading from "../../Loading"
import ListLesson from "../../watchcourse/ListLesson"
import { logout } from "../../../api/slices/usersSlice";
import ErrorPage from "../../../pages/ErrorPage";
import { AWS_S3_DOMAIN_NAME } from "../../../config";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { useEffect, useState } from "react";
import AddLesson from "./AddLesson";
import { MdClose } from "react-icons/md";
import ErrorMsg from "../../ErrorMsg";
import SuccessMsg from "../../SuccessMsg";
import handleUiMessges from "../../../utils/handleUiMessges";
import { AiFillEdit } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { setCourseId } from "../../../api/slices/courseSlice";
import FileInputForm from "../../FileInputForm";
import { MdPublish } from "react-icons/md";
import { toast } from "react-toastify";
import GridLoader from 'react-spinners/GridLoader'

function AddandViewCourse({courseId}) {

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {user} = useSelector(state=> state.userInfo)
  const [showLessonform, setShowLessonForm] = useState(false)
  const [lessonErr,setLessonErr] = useState("");
  const [isLessonLoading,setIsLessonLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [ispublish, setIsPublish] = useState(false)
  
  const [publishtext, setPublishText] = useState("")
  const [editText, setEditText] = useState("Edit course");
  const [userEnrolledText,setUserEnrolledText] = useState("0 Enrolled")

  const [lessonInfo, setLessonInfo] = useState({
    description: "",
    learning_video: null,
  })

  const [createLesson] = useAddNewLessonMutation();
  const [editCourseIsPublish] = useIsPublishCourseMutation();
  let content = null
  const {data:course, isError,error, isSuccess, isLoading} = useGetCourseQuery(courseId)
  const getallCourseQuery = useGetAllCourseQuery();
  if(isLoading) {
    content = <Loading/>
  }else if(isError) {
    if(error?.status === 403) {
      dispatch(logout());
      Navigate('/login')
    }else if(error.status === 500 || error.status === 400) {
      content = <ErrorPage/>
    }
  }

  useEffect(()=> {
    if(course) {
      setIsPublish(course?.ispublish ? true : false)
      setPublishText(course?.ispublish === false ? "Publish text":"Unpublish text")
      setUserEnrolledText(course.enrolled_users?.length > 0 ? `${course?.enrolled_users.length} Enrolled` : "0 Enrolled")

    }
  },[course])
  

  const addLesson = ()=> {
    setShowLessonForm(true)
  }
  const handleFileChange = (e)=> {
    setLessonInfo({...lessonInfo, learning_video: e.target.files[0]})
  }
  const handleInputChange = (e)=> {
    setLessonInfo({...lessonInfo, description: e.target.value})
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    const {description,learning_video} = lessonInfo
    
    if(description === '' || learning_video === null ){
        toast.error('Please fill in all fields for all lessons.', {
          position: toast.POSITION.TOP_RIGHT
        })
    }else if(learning_video?.type !== 'video/mp4' && 
        learning_video.type !== 'video/MPEG' && 
        learning_video.type !== 'video/mkv'){
        toast.error("lesson file must be a video ",{
          position: toast.POSITION.TOP_RIGHT
        })
    }else {
        const formData = new FormData();
        formData.append("description",lessonInfo.description)
        formData.append("learning_video",lessonInfo.learning_video)
        setIsLessonLoading(true)
        createLesson({formData,courseId}).unwrap()
        .then(response=> {
          setIsLessonLoading(false)
          setLessonInfo({
            description: "",
            learning_video: null,
          })
          toast.success("Lesson added successfull", {
            position: toast.POSITION.TOP_RIGHT
          })

        })
        .catch(err=> {
          console.log(err)
          if(err.status === 400) {
            toast.error(err.data, {
              position: toast.POSITION.TOP_RIGHT
            })
            
          }else if(err.status === 500) {
            toast.error("Something went wrong", {
              position: toast.POSITION.TOP_RIGHT
            })
            
          }
        })
    }
  }

  const handleEditbtnClick = (e)=> {
    e.preventDefault()
    dispatch(setCourseId(courseId))
    Navigate(`/instructor/${user._id}/course/edit`)
  }

  const handlePublishbtnClick = (courseid) => {
    if(!courseid) return console.log("Course id undefined")
   
    
    editCourseIsPublish({courseid,ispublish}).unwrap()
    .then(response=> {
      console.log(response)
      getallCourseQuery.refetch();
      setIsPublish(!ispublish)
      setPublishText(response?.ispublish === false ? "Publish text" : "Unpublish text")
    })
    .catch(err=> {
      if(err.status === 500) {
        content = <ErrorPage/>
      }else if(err.status === 404) {
        console.log(err.data)
      }else if(err.status === 403) {
        dispatch(logout());
        Navigate('/login')
      }
    })
  }
  
  return (
    <div>
      {content ? content : isSuccess ? <div>

        <div className="p-6 bg-white " id="addcoursemaindiv">
          <div className="cousecontent">
          <div className="mx-auto">
            <img src={`${AWS_S3_DOMAIN_NAME}/${course.course_image}`}
            alt="course_image"
            style={{width:'100px',height:'100px',borderRadius:'50%'}}/>
          </div>
          <div className="col-span-3">
            <p className="font-medium text-4xl">{course.title}</p>
            <p className="font-medium text-xl">{course.description}</p>
            <p className="font-medium text-lg"><FaRupeeSign className="inline-block"/> {course.course_fee}</p>
          </div>
          </div>
          <div className="cursor-pointer" id="icondiv">
            <div className="relative ispublishdiv" >
              <MdPublish className="mt-4 hover:cursor-pointer" 
               onClick={()=> handlePublishbtnClick(courseId)} size={40}/>
             <span id="ispublishcourse" className="hidden px-4 text-white py-2 bg-zinc-500">{publishtext}</span>
            </div>
            <div className="relative edittooltipdiv">
              <AiFillEdit className="mt-4 hover:cursor-auto" 
              onClick={handleEditbtnClick} size={40}/>
              <span id="edittooltip" className="hidden px-4 text-white py-2 bg-zinc-500">{editText}</span>
              
            </div>
            <div className="relative usertooltipdiv">
              <FaUser className="mt-6" size={25}
               />
               <span id="usericontooltip" className="hidden tooltip text-white px-4 py-2 bg-zinc-500">{userEnrolledText}</span>
            </div>
          </div>
          
        </div>
        <div>
          <div className="w-3/5 mx-auto relative">
              <button className="text-center w-full rounded-full py-4 bg-[#234391] text-white" 
              onClick={addLesson}>Add new lesson</button>
              {showLessonform && <form id="lessonform" className="py-4 text-white absolute top-0 z-10 rounded px-4 bg-[#234391]"
              onSubmit={handleSubmit}>
                <div>
                <MdClose className="ml-auto" onClick={()=> setShowLessonForm(false)} size={40}/>
                </div>
                {lessonErr && <ErrorMsg message={lessonErr}/>}
                {successMsg && <SuccessMsg message={successMsg}/>}
                {isLessonLoading && <GridLoader color="#36d7b7" className="gridLoaderanimation"/>}
                <AddLesson lessoninfo={lessonInfo}
                  inputChange={handleInputChange} />
                  <FileInputForm fileChange={handleFileChange}/>
                 <button type='submit' className='hover:border-2 px-4 py-2 mt-2 w-full bg-emerald-600'>Submit</button>
              </form>}
          </div>
          
        </div>
            <div className="md:w-3/5 w-4/5 mx-auto">
            <div id="lessondisplaydiv">
                <p className="font-medium text-xl my-4">{course?.lessons?.length} Lessons</p>
                {course?.lessons?.map((lesson,index)=> (
            <ListLesson key={index} lessonIndex={index} lesson={lesson}/>
                ))}
                
            </div>
            
            </div>
      </div> : <Loading/>}
    </div>
  )
}

export default AddandViewCourse