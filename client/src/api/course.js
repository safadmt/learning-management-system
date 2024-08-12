import { emptySplitApi } from "./emptySplitApi"; 

const course = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        createCourse: builder.mutation({
            query: ({form_Data, userid}) => ({
                url: `/course/create/${userid}`,
                method: 'POST',
                body: form_Data
            }),
            invalidatesTags: ['Course']
        }),
        getAllCourse : builder.query({
            query: ({skipcourses,limitcourses,rating,price,categoryIds}) => 
            `/course/all?skipcourses=${skipcourses}&limit=${limitcourses}&rating=${rating}&price=${price}&categoryIds=${categoryIds}`,
            providesTags: (result, error, arg) =>
            result
              ? [...result.map(({ id }) => ({ type: 'Course', id })), 'Course']
              : ['Course'],
        }),
        getInstructorCourses: builder.query({
            query: (userid)=> `/course/instructor-courses/${userid}`,
            providesTags: (result, error,arg) => [{type: 'Course',id:arg}]
        }),
        getCourse: builder.query({
            query: (coourseid) => `/course/${coourseid}`,
            providesTags: (result, error,arg) => [{type: 'Course',id:arg}]
        }),
        addNewLesson: builder.mutation({
            query: ({formData, courseId})=> ({
                url: `/course/${courseId}/add-lesson`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: (result, error, arg)=> [{type:'Course',id:arg.courseId}]
        }),
        removeLesson:builder.mutation({
            query: ({courseid, lessonid})=> ({
                url: `/course/lesson/${courseid}/${lessonid}`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, arg)=> [{type:'Course',id:arg.courseid}]
        }),
        editCourseDetails: builder.mutation({
            query: ({form_Data, courseId})=> ({
                url: `/course/edit/${courseId}`,
                method: 'POST',
                body: form_Data
            }),
            invalidatesTags: (result, error, arg)=> [{type:'Course',id:arg.courseid}]
        }),
        editLessonInfo : builder.mutation({
            query: ({courseId, lessonid, formData})=> ({
                url: `/course/edit/lesson/${courseId}/${lessonid}`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: (result, error, arg)=> [{type:'Course',id:arg.courseid}]
        }),
        isPublishCourse: builder.mutation({
            query: ({ courseid, ispublish }) => ({
                url: `/course/ispublish/${courseid}`,
                method: 'PATCH',
                body: { ispublish: !ispublish }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Course', id: arg.courseid }]
        }),
        getCourseFeedbacks : builder.query({
            query: (courseid)=> `/course/feedbacks/${courseid}`,
            providesTags: (result, error,arg) => [{type: 'Comment',id:arg}]
        }),
        getAverageRating: builder.query({
            query: (coourseid) => `/course/rating/${coourseid}`,
            providesTags: (result, error,arg) => [{type:'Comment',id:arg}]
        }),
        courseFeedback: builder.mutation({
            query: ({rating,comment,courseId, userId})=> ({
                url: `/course/feedback/${courseId}`,
                method: 'POST',
                body: {rating, comment, userId}
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg.courseId }]
        }),
        getCoursesbyCateory: builder.query({
            query: ({categoryId,skipcourses,limitcourses})=> `/course/${categoryId}/${skipcourses}/${limitcourses}`,
            
        }),
        searchCourses: builder.mutation({
            query: ({text_search,id,page,limit,rating,price,categoryIds})=> ({
                url: `/course/search`,
                method: 'POST',
                body: {text_search,id,page,limit,rating,price,categoryIds}
            }),
        }),
        getCourses: builder.mutation({
            query: ({skipcourses,limitcourses,rating,price,categoryIds})=> ({
                url: `/course/allcourse`,
                method: 'POST',
                body: {skipcourses,limitcourses,categoryIds,price,rating}
            }),
            
        }),
        addQuestion : builder.mutation({
            query: ({courseId, info})=> ({
                url: `/course/add/question/${courseId}`,
                method: 'POST',
                body: info
            }),
            invalidatesTags: (result, error, arg)=> [{type:'Question',id:arg.courseid}]
        }),
        addReply : builder.mutation({
            query: ({courseId, formData})=> ({
                url: `/course/add/question-reply/${courseId}`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: (result, error, arg)=> [{type: 'Question',id:arg.courseid}]
        }),
        getCourseQuestionandAnswer: builder.query({
            query: (courseid) => `/course/question-answer/${courseid}`,
            providesTags: (result, error,arg) => [{type: 'Question',id:arg}]
        }),
        
    })
})

export const {useCreateCourseMutation,useGetAllCourseQuery,useGetInstructorCoursesQuery,
            useGetCourseQuery,useAddNewLessonMutation,useRemoveLessonMutation,
            useEditCourseDetailsMutation,useEditLessonInfoMutation,useIsPublishCourseMutation,
            useCourseFeedbackMutation,useGetCourseFeedbacksQuery,useGetAverageRatingQuery,
            useGetCoursesbyCateoryQuery, useSearchCoursesMutation,useGetCoursesMutation,
            useAddQuestionMutation,useAddReplyMutation,useGetCourseQuestionandAnswerQuery} = course;