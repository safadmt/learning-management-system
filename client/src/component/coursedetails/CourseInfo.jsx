import React, { useEffect } from 'react'
import { RAZORPAY_KEY_ID, AWS_S3_DOMAIN_NAME } from '../../config'
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCourseId } from '../../api/slices/courseSlice';

import { logout } from '../../api/slices/usersSlice';
import ErrorPage from '../../pages/ErrorPage';
import { toast } from 'react-toastify';
import { usePaymentFailedMutation, useVerifyPaymentMutation, usePayWithRazorpayMutation } from '../../api/payment';
import { useGetUserQuery, useSetEnrolledCourseMutation } from '../../api/user';
import AverageRating from '../watchcourse/AverageRating';



function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}


function CourseInfo({ course }) {

    const { user } = useSelector(state => state.userInfo)
    const dispatch = useDispatch();
    const Navigate = useNavigate()

    let content;
    const [buyCourse] = usePayWithRazorpayMutation();
    const [verifyPaymentInfo] = useVerifyPaymentMutation();
    const [onPaymentFailed] = usePaymentFailedMutation();

    const { data: userInfo, isLoading: isUserLoading } = useGetUserQuery(user?._id)

    const [setEnrolledCourse] = useSetEnrolledCourseMutation();


    useEffect(()=> {
        if(userInfo) {

        }
},[userInfo])

    function handleErrorResponse(err) {
        console.log(err.data)
        switch (err.status) {
            case 500:
                content = <ErrorPage />;
                break;
            case 403:
                dispatch(logout());
                Navigate('/login');
                break;
            case 400:
                toast.error(err.data, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            default:
                console.log(err);
                toast.error(err.data || err.description, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
        }
    }

    async function verifyPayment(response) {
        try {
            await verifyPaymentInfo({
                response,
                userId: user?._id,
                courseId: course._id,
                amount: course.course_fee
            }).unwrap();

            Navigate(`/course/${course.title}/learn`)

        } catch (err) {
            console.log(err.data)
            handleErrorResponse(err);
        }
    }
    function payWithRazorpay(course_fee) {
        buyCourse(course_fee).unwrap()
            .then(response => {
                console.log(response)
                displayRazorPay(response)
            })
            .catch(err => {
                console.log(err.data)
                handleErrorResponse(err)
            })
    }

    const displayRazorPay = async (response) => {
        try {

            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

            if (!res) {
                alert()
                toast.error('Razropay failed to load!!', {
                    position: toast.POSITION.TOP_LEFT
                });
                return
            }



            const options = {
                "key": RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                "amount": response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Code Freak",
                "description": "Test Transaction",
                "order_id": response.id,
                "handler": function (response) {
                    verifyPayment(response);
                },

                "notes": {
                    "address": "CodeFreak Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', async function (response) {
                const details = {
                    courseId: course._id,
                    userId: user._id,
                    amount: course.course_fee,
                    reason: response.error.reason,
                    order_id: response.error.metadata.order_id,
                    payment_id: response.error.metadata.payment_id,
                    description: response.error.description
                };

                try {
                    const failedResponse = await onPaymentFailed(details).unwrap();

                    toast.error(failedResponse.error.reason, {
                        position: toast.POSITION.TOP_LEFT
                    });
                } catch (err) {
                    handleErrorResponse(err);
                }

                Navigate(`/course/${course._id}/`);
            });

            paymentObject.open();

        } catch (err) {
            handleErrorResponse(err);
        }
    }

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (user && userInfo) {
            const isCourse = userInfo?.enrolled_courses?.some(obj => obj.courseId === course?._id)
            console.log(user)
            console.log(userInfo)
            console.log(isCourse)
            if (isCourse) {
                dispatch(setCourseId(course._id))
                Navigate(`/course/${course.title}/learn`)
                }
            else if (course?.fee_status === "Paid") {
                dispatch(setCourseId(course._id))
                payWithRazorpay(course.course_fee)
            } else if (course?.fee_status === "Free") {
                    setEnrolledCourse({ courseid: course._id, fee_status: "Free", userid: user?._id }).unwrap()
                        .then(response => {
                            dispatch(setCourseId(course._id))
                            Navigate(`/course/${course.title}/learn`)
                        })
                        .catch(err => {
                            handleErrorResponse(err)
                        })
                


            }

        } else {
            Navigate('/login')
        }
    }
    return (
        <div className='bg-[#637E76] grid grid-cols-8 py-10'>
            <div className='ps-20 text-white col-span-5 pb-16 pt-12'>
                <div className='font-medium text-5xl pb-4'>{course?.title}</div>
                <div className='font-medium text-2xl'>{course?.description}</div>
                <div>Created by <span className='font-medium hover:cursor-pointer text-blue-400' 
                onClick={()=> Navigate(`/user/profile/${course?.userid}`)}>{course?.username}</span></div>
                <AverageRating courseid={course._id} size={"25px"} spacing={"0px"}/>
                <div className='text-xl'>{course?.fee_status === "Paid" ? <div><FaRupeeSign className='inline' />  {course?.course_fee}</div> : course?.fee_status}</div>
            </div>
            <div className='col-span-3 py-10 px-10'>
                <div>
                    <img style={{ width: "500px" }}
                        src={`${AWS_S3_DOMAIN_NAME}/${course?.course_image}`} alt='course image' />

                </div>
                <div className='mt-2'>
                    <button onClick={handleButtonClick}
                        className={`px-8 text-xl w-full font-medium rounded-full leading-0 
                bg-white py-4 hover:border-2`}>
                        {course?.fee_status === "Paid" ? "Enroll now" : "Go ot course"}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default CourseInfo