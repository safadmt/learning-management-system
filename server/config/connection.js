import {MongoClient ,ServerApiVersion} from 'mongodb';
import { collection } from './collection.js';
import 'dotenv/config'


const uri = process.env.mongodbURL;
let db;


const client = new MongoClient(uri, {serverApi: {
    version: ServerApiVersion.v1,
    strict:false,
    deprecationErrors:true,
}})


export const connect = async(done)=> {
    try {
        await client.connect();

        db = client.db('learningapp')
        
        done(null, "database connected")
    }catch(err) {
        done(err, null)
    }
}

async function createIndex (done) {
    try{
        let newdb = client.db('learningapp')
       const result =  await db.collection(collection.COURSE_COLLECTION)
       .createIndex({title: "text", description: "text"},{default_language: "english"})
       done(null, result)
    }catch(err) {
        done(err, null);
    }
    
}


export {db,createIndex};

