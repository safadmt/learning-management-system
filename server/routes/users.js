import express from 'express';
import multer from 'multer';
import path from 'path';
import 'dotenv/config.js'
import { auth, createUser, loginUser,getUser,editPassword ,
    editUserInfo,uploadProfiePhoto, deleteProfilePic,submitInstructorInfo, setEnrollCourse, 
    setEnrolledCoursesLessonStatus, getWishList, updateWishList, getWishlistDetails, 
    verifyAccountViaEmail, verfiyOTP, resetPassword, getInstructorInfo,
    editInstructorInfo} from '../controllers/user.js';
import { jwtauthUser } from '../middleware/auth.middleware.js';


const router = express.Router()

const store = multer.memoryStorage()
const uploadbuffer = multer({storage:store  })

// const storage = multer.diskStorage({
//     destination: (req, file, callabck)=> {
//         console.log(file)
//         callabck(null, './public/user/');
//     },
//     filename: (req,file, callabck)=> {
//         console.log(file)
//         const originalname = file.originalname.toString()
//         const uniqueFileName = Date.now() + Math.round(Math.random() * 100 * 184) + path.extname(originalname);
//         callabck(null, uniqueFileName)
//     }
// })
// const uploadProfilePic = multer({storage: storage});

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/forgot-password', verifyAccountViaEmail)
router.post('/verify-OTP', verfiyOTP)
router.post('/reset-password', resetPassword)
router.get(`/auth` ,jwtauthUser, auth );
router.get('/:userid',jwtauthUser, getUser);
router.get('/get/:userid', jwtauthUser, getUser)
router.patch('/edit/password/:userid', jwtauthUser, editPassword);
router.post('/edit/info/:userid',jwtauthUser, editUserInfo);

router.post('/upload-profile-pic/:userid', jwtauthUser,
    uploadbuffer.single('profile_pic'), uploadProfiePhoto);
router.delete('/delete/profile-pic/:userid', jwtauthUser, deleteProfilePic);
router.post('/instructor-info/:userid', jwtauthUser, submitInstructorInfo);
router.patch('/enroll_course/:userid', jwtauthUser, setEnrollCourse);
router.patch('/wishlist/update/:userid', jwtauthUser,updateWishList);
router.get('/wishlist/:userid', getWishList);
router.get('/wishlist/details/:userid',getWishlistDetails);

router.patch('/edit/instructor-info/:userid',jwtauthUser, editInstructorInfo)

router.get('/instructor-info/:userid', getInstructorInfo)

router.patch('/enrolled_course/lesson_status/:userid',jwtauthUser,setEnrolledCoursesLessonStatus )

export default router;