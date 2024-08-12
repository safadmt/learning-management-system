import React , {useEffect,useState} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setCompletedLessons, setLesson } from '../../api/slices/courseSlice';
import { TiTick } from "react-icons/ti";


function LessonSidebar({course, userInfo}) {
   
    const dispatch = useDispatch();
    let courseInfo = {};
    
    const [isShowSidebar, setShowSidebar] = useState(true);

    const [size, setSize] = useState("w-80 h-screen")
    const [selectedLesson, setSelectedLesson] = useState(null)

    const {completedLessons} = useSelector(state=> state.courseInfo)
    const {lesson} = useSelector(state=> state.courseInfo)

    let [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(()=> {
        if(lesson) {
            setSelectedLesson(lesson?._id)
        }
    },[lesson])

    useEffect(()=> {
        if(!course?.lessons || course.lessons?.length === 0) {
            dispatch(setLesson({}))
        }else if(course?.lessons?.length > 0) {
            dispatch(setLesson(course.lessons[0]))
        }

    },[course])


    function updateSidebarWith() {
        console.log("resize")
        if(window.innerWidth <= 800) {
            setSize("absolute left-0 top-0 z-0 px-2 h-12");
            setShowSidebar(false);
        }else{
            setSize("w-80 h-screen");
            setShowSidebar(true);
        }
    }
    
    useEffect(()=> {
        courseInfo = userInfo?.enrolled_courses?.find(obj => obj.courseId === course._id)
        
        let lessonIds =  courseInfo?.lessonscompleted?.length > 0 ? courseInfo.lessonscompleted : []
        
        dispatch(setCompletedLessons(lessonIds))
       
    },[userInfo])
    
    useEffect(()=> {
        
    window.addEventListener('resize', updateSidebarWith)
    
    return ()=> {
        window.addEventListener('resize', updateSidebarWith)
    }
    },[])


   const handleCloseBtnClick = ()=> {
    setSize("absolute left-0 top-0 z-1 px-2 h-12")
    setShowSidebar(false)
   }
   const handleLessonClick = (e,lesson)=> {
    dispatch(setLesson(lesson))
    setSearchParams(lesson.description)
   }
   const handleMenuBtnClick = ()=> {
    setSize("w-80 h-screen z-1")
    setShowSidebar(true)
   }
    return (
        <div className={`${size} bg-white border-r-2 sm:pb-4 pt-2 text-white px-2`} id="sidebar">
            <div>
               {!isShowSidebar ? <MdMenu 
               onClick={handleMenuBtnClick}
               className="inline text-black" 
               size={25}/> :
                <IoClose className="inline float-right me-2 text-black"
                onClick={handleCloseBtnClick}
                size={25}/> }
            </div>
            {isShowSidebar && <div>
                
            <div className='text-center text-xl'>Course Lessons</div>
            {course?.lessons.length > 0 ? course.lessons.map((lesson,index)=> {
                
               let isLessonCompleted = completedLessons.includes(lesson._id)
                return <div key={index} onClick={(e)=>handleLessonClick(e,lesson)}
                className={`relative flex flex-wrap bg-white text-black rounded-full 
                hover:cursor-pointer px-4 py-2 my-2 ${selectedLesson === lesson._id ? "bg-zinc-400" : ''}`}>
                    <div>{index + 1}</div>
                    <div className='ms-4'>{lesson?.description}</div>
                    {isLessonCompleted ? <TiTick className='float-right absolute right-4' size={25} color='green'/> :
                         
                             <IoClose className='float-right absolute right-4' size={25} color='red'/> 
                    }
                   
                </div>
            }): <div className='text-black text-center'>No lesson have created</div>}</div>
            }
        </div>
    )
}

export default LessonSidebar