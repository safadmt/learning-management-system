import React, { useEffect, useState } from 'react'
import './profile.css'
import { CgProfile } from 'react-icons/cg'
import { IoLink } from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useAddorRemoveFromWishlistMutation, useGetInstructorInfoQuery, useGetUserWishlistQuery } from '../../api/user';
import { useGetInstructorCoursesQuery } from '../../api/course';
import Loading from '../../component/Loading';
import ErrorPage from '../ErrorPage';
import DisplayImage from '../../component/DisplayImage';
import DisplayInstructorCourse from '../../component/instructorDashboard/DisplayInstructorCourse'
import { useSelector } from 'react-redux';
import Course from '../../component/home/Course';


function Profile() {
    let content;

    const Navigate = useNavigate()
    const { userid } = useParams();
    

    const [wishlists, setWishlists] = useState([])

    const { user } = useSelector(state => state.userInfo)

    const { data: userInfo, isLoading: isUserLoading, isError: isUserError, error, isSuccess: isUserSuccess } = useGetInstructorInfoQuery(userid);
    const { data: courses, isLoading: isCourseLoading, isError: isCourseError, error: course_error, isSuccess } = useGetInstructorCoursesQuery(userid)

    const { data: userwishlist, isLoading: isWishListLoading, isError: isWishListError,
        isSuccess: isWishListSuccess, error: wishlisterro, refetch: refetchWishlist } = useGetUserWishlistQuery(userid)

    const [updateUserWishlist] = useAddorRemoveFromWishlistMutation()


    useEffect(() => {
        if (isSuccess && user) {

            setWishlists(userwishlist?.wishlist)
        } else {
            setWishlists([])
        }

    }, [isSuccess, user, userwishlist])

    const updateWishlist = async (courseId) => {

        if (user) {
            try {
                await updateUserWishlist({ userId: user._id, courseId })

            } catch (err) {
                console.log(err.data)
            }

        } else {
            Navigate('/login')
        }
    }
    if (isUserLoading || isCourseLoading || isWishListLoading) {
        content = <Loading />
    } else if (isUserError || isCourseError) {
        let errors = error.status || course_error.status
        switch (errors) {
            case 400:
                console.log(errors.data)
                break;
            case 500:
                content = <ErrorPage />
                break;
            default:
                break;
        }

    }
    
    return (
        <div id='instructorprofilemaindiv'>



            {content ? content : (isSuccess && isUserSuccess) && <div>
                <div id='instructorprofilemaincontent'>

                    <div id='instructorprofileinfo'>
                        <div className='instructor-profile-image'>
                            {userInfo?.profile_pic ? <DisplayImage image={userInfo.profile_pic} /> :
                                <CgProfile size={100} />}
                        </div>
                        <h2 className='font-medium text-xl text-zinc-500'>Instructor</h2>
                        <h1 className='font-medium text-4xl text-zinc-800'>{userInfo.first_name}</h1>
                        <h2 className='font-medium text-base text-zinc-800'>{userInfo.subject_area}</h2>
                        <div>
                            <h6 className='font-medium text-sm bg-cyan-300 px-2 py-2 w-fit text-zinc-800'>CodeFreak Instructor</h6>
                        </div>

                        <div className='mt-6'>
                            <div>
                                <div className='font-medium text-sm text-zinc-800'>Total Studenets</div>
                                <div className='font-medium text-xl text-zinc-800'>2.383,53</div>
                            </div>

                        </div>
                        <h2 className='font-medium text-2xl mt-4 text-zinc-800'>About me</h2>
                        <div>
                            <div>{userInfo?.aboutyourself}</div>
                        </div>
                    </div>
                    <div className='linkandimage'>
                        <div className='instructor-profile-image2'>
                            {userInfo?.profile_pic ? <DisplayImage image={userInfo.profile_pic} /> : <CgProfile size={100} />}
                        </div>
                        <div className='social-media-links'>
                            <div className='links'><IoLink size={30} className='pt-1' /> <span>Website</span></div>
                            <div className='links'><FaSquareXTwitter /><span>Twitter</span></div>
                            <div className='links'><FaLinkedin /> <span>LinkedIn</span></div>
                        </div>

                    </div>

                </div>
                <div className='mt-16'>
                    <h2 className='font-medium text-xl text-zinc-500'>Courses</h2>
                    <div className='course-display-div'>
                    {courses.map((course, index) => (

                        <Course course={course} updateUserWishlist={updateWishlist}
                            wishlistStatus={wishlists?.length > 0 ? wishlists.includes(course._id) : false}
                            key={index} path={`/course/${course._id}`} />
                    ))}
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default Profile