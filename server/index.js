import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path,{dirname} from 'path';
import {fileURLToPath} from 'url';
import helmet from 'helmet';

const app = express();

import {connect, createIndex} from './config/connection.js';

import user from  './routes/users.js';
import course from './routes/courseroute.js';
import admin from './routes/admin.js';
import payment from './routes/payment.js';
import { db } from './config/connection.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import{ collection }from './config/collection.js'
import { ObjectId } from 'mongodb';

connect((err, data)=> {
    if(err) {
        console.log(err)
    }else {
        console.log("database connected")
        // createIndex((err,data)=> {
        //     if(err) {
        //         console.log(err)
        //     }else {
        //         console.log(data)
        //     }
        // })
   
        // console.log(data)
        // function updateONE () {
        //      db.collection(collection.PAYMENT_COLLECTION).drop()
        // }
        // updateONE()
       
    }
})

const currentFilePath = fileURLToPath(import.meta.url);
const __dirname = dirname(currentFilePath);
app.use(express.static(path.join(__dirname + '/public')));

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'stackpath.bootstrapcdn.com'],
        scriptSrc: ["'self'", 'https://razorpay.com/'],
    }
}))
app.use(cors({origin: 'http://localhost:3000' , credentials:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


  
app.use('/user', user);
app.use('/course', course);
app.use('/admin',admin);
app.use('/payment', payment);

app.use(errorMiddleware);
const PORT = process.env.PORT || 4000;
app.listen(PORT, err => err ? console.log(err) : console.log(`Server running on port ${PORT}`));



