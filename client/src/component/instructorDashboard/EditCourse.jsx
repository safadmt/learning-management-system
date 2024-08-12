import React, { useEffect, useRef, useState } from 'react'
import AddCourse from './createcourse/AddCourse'
import SubmitButton from '../SubmitButton';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { useEditCourseDetailsMutation, useEditLessonInfoMutation, useGetCourseQuery, useRemoveLessonMutation } from '../../api/course';
import { logout } from '../../api/slices/usersSlice';
import ListLesson from '../watchcourse/ListLesson';
import { AiFillEdit, AiTwotoneDelete } from "react-icons/ai";
import handleUiMessges from '../../utils/handleUiMessges';
import SuccessMsg from '../SuccessMsg';
import ErrorMsg from '../ErrorMsg';
import AddLesson from './addandviewcourse/AddLesson';
import FileInputForm from '../FileInputForm';
import { MdClose } from 'react-icons/md';
import { AWS_S3_DOMAIN_NAME, BASE_URL } from '../../config';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
import BeatLoader from 'react-spinners/BeatLoader';


function EditCourse() {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { userid } = useParams();
  const [successMsgCoursedetails, setSuccessMsgforCourseDetails] = useState(null);
  const [isApiLoading, setIsLoading] = useState(false)
  const [imageErr, setImageErr] = useState(null);
  const [errMsg, setErrMsg] = useState(null)
  const [isexistlessonfile, setIsExistLessonFile] = useState(false)
  const [showEditLessonForm, setShowLessonForm] = useState(false)
  const [lessonInfo, setLessonInfo] = useState({})
  const [lessonFile, setLessonFile] = useState(null)
  const [lessonErr, setLessonErr] = useState(null);
  const [lessonSuccess, setLessonSuccess] = useState(null)
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    description: "",
    course_fee: "",
    course_image: "",
    fee_status: "",
    category: "",
    lessons: []
  })

  let content = null

  const [deleteLesson] = useRemoveLessonMutation();
  const [editCourseDetails] = useEditCourseDetailsMutation();
  const [editLessonInfo] = useEditLessonInfoMutation();

  const courseId = useSelector(state => state.courseInfo.courseId)
  const { data: course, isError, error, isSuccess, isLoading } = useGetCourseQuery(courseId)

  useEffect(() => {
    if (isLoading) {
      content = <Loading />
    }
    if (isError) {
      if (error?.status === 403) {
        dispatch(logout());
        Navigate('/login')
      } else if (error.status === 500 || error.status === 400) {
        content = <ErrorPage />
      }
    }
    if (isSuccess) {
      setCourseInfo({
        title: course?.title ? course.title : "",
        description: course?.description ? course.description : "",
        fee_status: course?.fee_status ? course.fee_status : "",
        course_fee: course?.course_fee ? course.course_fee : "",
        course_image: course?.course_image ? course.course_image : null,
        category: course?.category ? course.category : "",
        lessons: course?.lessons ? course.lessons : []
      })
    }
  }, [isLoading, isError, isSuccess, course])

  const handleDeleteLesson = (courseid, lessonid) => {
    console.log(courseid, lessonid)
    if (!courseid || !lessonid) return console.log(courseid, lessonid)
    if (window.confirm(`Are you sure you want to delete the lesson`)) {
      setIsLoading(true)
      deleteLesson({ courseid, lessonid }).unwrap()
        .then(response => {
          setIsLoading(false)
          toast.success("Deleted successfully", {
            position:toast.POSITION.TOP_RIGHT
          })

        })
        .catch(err => {
          setIsLoading(false)
          if (err.status === 500) {
            content = <ErrorPage />
          } else if (err.status === 403) {
            dispatch(logout());
            Navigate('/login');
          } else if (err.status === 400) {
            console.log(err.data)
          }


        })
    }



  }
  const handleShowLesssonForm = (e, lesson) => {
    e.preventDefault();
    console.log(lesson)
    const { description, learning_video, _id } = lesson
    setLessonInfo({
      _id: _id,
      description: description ? description : "",
      learning_video: learning_video ? learning_video : ""
    })
    setShowLessonForm(true)
  }
  const handleFileChange = (e) => {
    setCourseInfo({ ...courseInfo, course_image: e.target.files[0] })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseInfo({ ...courseInfo, [name]: value })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { title, description, course_fee, category, fee_status, course_image } = courseInfo;
    if (title === "" || description === "" || fee_status === "" ||
      category === "") {
      toast.error("Required all field", {
        position:toast.POSITION.TOP_RIGHT
      });
    }
    if (fee_status === "Paid" && course_fee === "") {
      toast.error("Required Course fee field  ", {
        position:toast.POSITION.TOP_RIGHT
      });
    }
    if (typeof (course_image) === 'object') {
      if (course_image.type !== "image/webp" && course_image.type !== "image/jpeg"
        && course_image.type !== "image/png") {
        toast.error("Select only image files", {
          position:toast.POSITION.TOP_RIGHT
        })
      }
    }
    let cateogryid;
    if (typeof (category) === 'object') {
      cateogryid = category._id
    } else {
      cateogryid = category
    }

    const form_Data = new FormData();
    form_Data.append('title', title);
    form_Data.append('description', description);
    form_Data.append('fee_status', fee_status);
    form_Data.append('course_fee', course_fee);
    form_Data.append('category', cateogryid);
    form_Data.append('course_image', course_image);

    setIsLoading(true)
    editCourseDetails({ form_Data, courseId }).unwrap()
      .then(response => {
        setIsLoading(false)
        toast.success("Changes made successfull", {
          position: toast.POSITION.TOP_CENTER
        })
      })
      .catch(err => {
        setIsLoading(false)
        if (err.status === 500) {
          content = <ErrorPage />
        } else if (err.status === 403) {
          dispatch(logout());
          Navigate('/login');
        } else if (err.status === 404) {
          console.log(err.data)
        }
      })

  }

  const handleLessonFileChange = (e) => {
    const file = e.target.files[0]

    setLessonInfo({ ...lessonInfo, learning_video: file })
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLessonFile(reader.result)
      }
      reader.readAsDataURL(file)

      setIsExistLessonFile(true)
    }


  }
  const handleLessonSubmit = (e, lessonid) => {
    e.preventDefault();

    if (!lessonid) return console.log(lessonid)
    const { description, learning_video } = lessonInfo

    if (description === "" || learning_video === null) {
      toast.error("Required all field", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('learning_video', learning_video)
      setIsLoading(true)
      editLessonInfo({ courseId, lessonid, formData }).unwrap()
        .then(response => {
          setIsLoading(false)
          toast.success("Updated successfully", {
            position: toast.POSITION.TOP_CENTER
          })
        })
        .catch(err => {
          setIsLoading(false)
          if (err.status === 403) {
            dispatch(logout());
            Navigate('/login')
          } else if (err.status === 500) {
            content = <ErrorPage />
          } else if (err.status === 404) {
            console.log(err.data)
          }
        })

    }
  }

  return (
    <div>
      {(isApiLoading || isLoading) && <BeatLoader className='absolute top-2/4 left-2/4' color='#36d7b7' size={25} />}
      {content ? content : <div>
      
        <div className='w-4/5 mx-auto'>
          <form onSubmit={handleFormSubmit}>
            <AddCourse fileChange={handleFileChange} fileErr={imageErr}
              inputChange={handleInputChange} course_details={courseInfo} />
            {errMsg && <ErrorMsg message={errMsg} />}
            {successMsgCoursedetails && <SuccessMsg message={successMsgCoursedetails} />}
            <SubmitButton btnname={"Submit Changes"} />
          </form>
        </div>
        <div className='relative'>
          <div className="md:w-4/5 w-4/5 mx-auto relative">
            <p className="font-medium text-xl my-4">{courseInfo?.lessons?.length} Lessons</p>
            <Link to={`/instructor/${userid}/course/${courseId}`}
              className='hover:border-2 text-white px-4 py-2 rounded-full bg-[#234391]'>Add new Lesson</Link>
            <div className='mb-2'>
              
            </div>
            {(showEditLessonForm && lessonInfo) && <div
              className='rounded absolute top-2 mb-4 border-2 z-0 px-2 py-4 bg-[#113946]'>
              <div>
                <MdClose className="ml-auto" onClick={() => {
                  setLessonFile(null)
                  setLessonInfo({})
                  setShowLessonForm(false)
                }} size={40} />
              </div>
              <form onSubmit={(e) => handleLessonSubmit(e, lessonInfo._id)}>
                <AddLesson lessoninfo={lessonInfo} inputChange={(e) => {
                  setLessonInfo({ ...lessonInfo, description: e.target.value })
                }}
                />
                {(lessonFile && isexistlessonfile) ? <ReactPlayer url={lessonFile} width={"100%"}
                  controls={true} /> :
                  <ReactPlayer url={`${AWS_S3_DOMAIN_NAME}/${lessonInfo.learning_video}`} width={"100%"} controls={true} />}
                <FileInputForm fileChange={handleLessonFileChange} />
                {lessonErr && <ErrorMsg message={lessonErr} />}
                {lessonSuccess && <SuccessMsg message={lessonSuccess} />}
                <SubmitButton btnname={"Submit Changes"} />
              </form>
            </div>}
            {courseInfo?.lessons?.map((lesson, index) => (
              <div className='grid grid-cols-7' key={index}>
                <div className='col-span-5'>
                  <ListLesson lessonIndex={index} lesson={lesson} />
                </div>

                <AiFillEdit onClick={(e) => handleShowLesssonForm(e, lesson)}
                  className='mx-auto mt-4' size={30} color='#7071E8' />
                <AiTwotoneDelete className='mx-auto mt-4'
                  size={30} color='red' onClick={() => { handleDeleteLesson(course?._id, lesson._id) }} />
              </div>

            ))}

          </div>

        </div>
      </div>}
    </div>
  )
}

export default EditCourse