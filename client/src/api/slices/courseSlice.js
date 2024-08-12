import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name: 'course',
    initialState: {
        completedLessons: [],
        courseId: (localStorage.getItem('courseId') !== null && 
                  localStorage.getItem('courseId') !== "undefined") ?
                    JSON.parse(localStorage.getItem('courseId')) : null,
        lesson: (localStorage.getItem('lesson') !== null && 
                localStorage.getItem('lesson') !== "undefined") ?
                JSON.parse(localStorage.getItem('lesson')) : null,
        error: {},
        coursesdata: {type: "", courses:[]},
        search_text : (localStorage.getItem('search_text') !== null && 
                        localStorage.getItem('search_text') !== 'undefined') ?
                        JSON.parse(localStorage.getItem('search_text')) : null,
        
    },
    reducers: {
        setCourseId: (state, action)=> {
            console.log(action.payload)
            state.courseId = action.payload
            localStorage.setItem('courseId', JSON.stringify(action.payload))
        },
        removeCourseid: (state, action)=> {
            localStorage.removeItem('courseId')
            state.courseId = null
        },
        setLesson: (state, action)=> {
            state.lesson = action.payload
            localStorage.setItem('lesson', JSON.stringify(action.payload))
        },
        removeLesson: (state, action)=> {
            localStorage.removeItem('lesson')
            state.lesson = null
        },
        setError: (state,action)=> {
            state.error = action.payload
        },
        removeError : (state,action) => {
            state.error = {}
        },
        setCourses : (state, action)=> {
            state.coursesdata.type = action.payload.type
            state.coursesdata.courses = action.payload.courses
            
        },
        removeCourses : (state, action)=> {
            state.courses = {type: "", courses:[]}
        },
        setCompletedLessons : (state, action)=> {
            state.completedLessons = action.payload
        },
        handleLessonCompleted : (state, action)=> {
            if(action.payload.status === 1) {
                state.completedLessons = state.completedLessons.filter(id=> id !== action.payload.lessonId)
            }else{
                state.completedLessons.push(action.payload.lessonId)
            }
        },
        
    }
})

export const {setCourseId,removeCourseid,setLesson,removeLesson,setError,removeError,
setCourses,removeCourses,setCompletedLessons,handleLessonCompleted} = courseSlice.actions
export default courseSlice.reducer;