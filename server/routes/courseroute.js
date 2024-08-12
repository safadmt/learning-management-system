import express, { response } from 'express'
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import 'dotenv/config.js'
import { jwtauthUser } from '../middleware/auth.middleware.js';
import fs from 'fs'
import {getCourse, createCourse,updateIsPublishCourse, getCourses, getInstructorCourses,editCourseDetais,
addNewLesson, 
removeLesson,
addQuestion,
editLesson,addCourseComment, getCourseComments,
 getAverageRating, getCourseBycategory, searchCourses,getQuestionAndAnswer,
  getAllcourses, addQuestionReply} from '../controllers/courses.js';

import AWS from 'aws-sdk';
import { error } from 'console';

AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY,
     secretAccessKey: process.env.AWS_SECRET_KEY ,
     region:'ap-southeast-2'
    })
const s3 = new AWS.S3();

const router = express.Router();



const store = multer.memoryStorage()
const uploadbuffer = multer({storage:store  })

// const storage = multer.diskStorage({
//     destination: (req,file,callback) => {
//         console.log(req.body)
//         console.log(req.files)
//         callback(null, './public/course')
//     },
//     filename: (req,file, callabck)=> {

//         const uniqueFileName = Date.now() + uuidv4() + file.originalname;
//         callabck(null, uniqueFileName)
//     }
// })

// const upload = multer({storage:storage})
// const cpUpload = upload.fields([{name: 'course_image', maxCount:1}, {name:'learning_video'}])
const upbuffer = uploadbuffer.fields([{name: 'course_image', maxCount:1}, {name:'learning_video'}])
router.post('/create/:userid',jwtauthUser,uploadbuffer.single('course_image'),createCourse);
const BUCKET = 'awsfeecourses'


router.post('/uploadfile', uploadbuffer.single('course_image'), (req,res)=> {
     
    console.log(req.file)
    console.log(req.files)
    
        const extention = req.file.originalname.split('.').at(1)
        const filename = Date.now() + uuidv4() + "." + extention
    
        const uploadfile = {
            Bucket:`${BUCKET}/courseimages`,
            Key: filename,
            Body: req.file.buffer
        }
        s3.upload(uploadfile).promise()
        .then(response=> {
            console.log(response)
                res.status(200).json(response)
        })
        .catch(err=> {
            console.log(err)
            res.status(500).json(err)
        })
    
    
    // const filePromises = req.files.map(file=> {
    //     const extention = file.originalname.split('.').at(1)
    //     const filename = Date.now() + uuidv4() + "." + extention
    
    //     const uploadfile = {
    //         Bucket:BUCKET,
    //         Key: filename,
    //         Body: file.buffer
    //     }
    //     return s3.upload(uploadfile).promise()
    // })
    

    // Promise.all(filePromises)
    // .then(response=> {
    //     console.log(response)
    //     res.status(200).json(response)
    // })
    // .catch(err=> {
    //     console.log(err)
    //     console.log(err)
    // })
})


router.get('/file', (req, res)=> {
    
    s3.getObject({Bucket:BUCKET}, (err,data)=> {
        if(err) throw err.message
       
        res.status(200).json(data)
    })
})


router.delete('/file', (req, res)=> {
    let info = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key : 'lesson_videos/17080608493253fdc499c-51a0-4a4d-93cb-ca5361900e79.js API - tutorial 1'
    }
    s3.deleteObject(info, (err,data)=> {
        if(err) throw err.message
        console.log(data)
        res.status(200).json(data)
    })
})
router.get(`/all`, getCourses);

router.get('/instructor-courses/:userid', getInstructorCourses)

router.get('/:courseid',getCourse)

router.post('/:courseid/add-lesson', jwtauthUser,uploadbuffer.single('learning_video'), addNewLesson)

router.post('/edit/:courseId',jwtauthUser,uploadbuffer.single('course_image') , editCourseDetais)

router.post('/edit/lesson/:courseid/:lessonid',jwtauthUser, uploadbuffer.single('learning_video'), editLesson)

router.patch('/ispublish/:courseid',jwtauthUser,updateIsPublishCourse)

router.get('/:categoryid/:skipcourses/:limitcourses', (req,res,next)=> {
    if(req.params.categoryid !== 'undefined') {
        getCourseBycategory(req,res,next)
    }else{
        getCourses(req,res,next)
    }
});
router.post('/feedback/:courseid', addCourseComment)

router.post('/add/question/:courseid', addQuestion)

router.post('/add/question-reply/:courseid', addQuestionReply)

router.get('/question-answer/:courseid',getQuestionAndAnswer)

router.get('/feedbacks/:courseid', getCourseComments )

router.get('/rating/:courseid', getAverageRating);

router.post('/lesson/:courseid/:lessonid',jwtauthUser, removeLesson);

//get All courses 

router.post('/allcourse/', getAllcourses)

router.post('/search', searchCourses)
router.get("*", (req,res)=> {
    res.send("wrong router")
})


export default router;