import { emptySplitApi } from "./emptySplitApi";

const user = emptySplitApi.injectEndpoints({
    endpoints : builder => ({
        loginUser : builder.mutation({
            query: userInfo => ({
                url: '/user/login',
                method: 'POST',
                body: userInfo
            }),
            transformResponse : response => response
        }),
        createUser : builder.mutation({
            query: userInfo => ({
                url: '/user/signup',
                method: 'POST',
                body: userInfo
            }),
            invalidatesTags: ['User'],
            transformResponse: response => response
        }),
        getUsers: builder.query({
            query: ()=> '/user/get-all-users',
            providesTags: ['User']
        }),
        getUser : builder.query({
            query: userId => `/user/${userId}`,
            providesTags: (result, error, arg) => [{type: 'Payment', id: arg}]
        }),
        getOneUser : builder.mutation({
            query: userid => ({
                url: `/user/get/${userid}`,
                method: 'POST',
                body: {userid}
            })
        }),
        getUserAuth : builder.query({
            query: ()=> `/user/auth`
        }),
        editPassword : builder.mutation({
            query: info => ({
                url: `/user/edit/password/${info.userid}`,
                method: 'PATCH',
                body: info.passwordInfo
            })
        }),
        addUserInfo : builder.mutation({
            query: info => ({
                url: `/user/edit/info/${info.userid}`,
                method: 'POST',
                body: info.userInfo
            }),
            invalidatesTags: (result, error, arg)=> [{type: 'User', id: arg.userid}]
        }),
        uploadProfilePic: builder.mutation({
            query: ({formData, userid}) => (
                {
                url: `/user/upload-profile-pic/${userid}`,
                method: 'POST',
                body: formData
                
            }),
            invalidatesTags: (result, error, arg)=> [{type: 'User', id: arg.userid}]
        }),
        deleteProfilePic: builder.mutation({
            query: (userid)=> ({
                url: `/user/delete/profile-pic/${userid}`,
                method: 'DELETE',
               
            }),
            invalidatesTags: (result, error,arg)=> [{type: 'User', id: arg}]
        }),
        addInstructorInfo: builder.mutation({
            query: ({info,userid}) => ({
                url: `/user/instructor-info/${userid}`,
                method: 'POST',
                body: info
            }),
            invalidatesTags: (result, error, info)=> [{type: 'User' , id:info.userid}]
        }),
        buyCourse: builder.mutation({
            query: ({course_fee}) => ({
                url: '/user/buy-course',
                method: 'POST',
                body: {course_fee}
            })
        }),
        getInstructorInfo : builder.query({
            query: userId => `/user/instructor-info/${userId}`,
            providesTags: (result, error, arg) => [{type: 'User', id: arg}]
        }),
        setEnrolledCourse : builder.mutation({
            query: ({ courseid, fee_status, userid }) => ({
                url: `/user/enroll_course/${userid}`,
                method: 'PATCH',
                body: { courseid, fee_status }
            }),
            invalidatesTags: (result,error,info)=> [{type:'Payment', id:info.userid}]
        }),
        setLessonCompeltedStatus: builder.mutation({
            query: ({userId,status,courseId, lessonId})=> ({
                url: `/user/enrolled_course/lesson_status/${userId}`,
                method:'PATCH',
                body: {courseId,lessonId, status}
            }),
            invalidatesTags: (result,error,info)=> [{type:'User', id:info.userId}]
        }),
        getUserWishlist : builder.query({
            query: userId => `/user/wishlist/${userId}`,
            providesTags: (result, error, arg) => [{type: 'Wishlist', id: arg}]
        }),
        addorRemoveFromWishlist: builder.mutation({
            query: ({userId,courseId})=> ({
                url: `/user/wishlist/update/${userId}`,
                method:'PATCH',
                body: {courseId}
            }),
            invalidatesTags: (result,error,info)=> [{type:'Wishlist', id:info.userId}]
        }),
        getUserWishlistDetals : builder.query({
            query: userId => `/user/wishlist/details/${userId}`,
            providesTags: (result, error, arg) => [{type: 'Wishlist', id: arg}]
        }),
        forgotPassword: builder.mutation({
            query: (email)=> ({
                url: `/user/forgot-password`,
                method:'POST',
                body: {email}
            }),
            
        }),
        verfiyOTP : builder.mutation({
            query: (otp)=> ({
                url: `/user/verify-OTP`,
                method:'POST',
                body: {otp}
            }),
            
        }),
        resetPassword : builder.mutation({
            query: ({email,password,confirm_password})=> ({
                url: `/user/reset-password`,
                method:'POST',
                body: {email,password,confirm_password}
            }),
            
        }),
        editInstructorInfo : builder.mutation({
            query: ({info,userid})=> ({
                url: `/user/edit/instructor-info/${userid}`,
                method:'PATCH',
                body: info
            }),
            invalidatesTags: (result, error, info)=> [{type: 'User' , id:info.userid}]
        }),

    })
})

export const {useLoginUserMutation, useCreateUserMutation,useGetUserQuery,useGetUserAuthQuery,
            useEditPasswordMutation, useAddUserInfoMutation, useUploadProfilePicMutation,
            useDeleteProfilePicMutation,useAddInstructorInfoMutation,useBuyCourseMutation,
            useSetEnrolledCourseMutation,useSetLessonCompeltedStatusMutation,
            useGetUserWishlistQuery, useAddorRemoveFromWishlistMutation,
            useGetUserWishlistDetalsQuery,useVerfiyOTPMutation,useResetPasswordMutation,
            useForgotPasswordMutation, useGetOneUserMutation,useGetInstructorInfoQuery,
            useEditInstructorInfoMutation} = user


