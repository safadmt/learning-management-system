import { db } from "../config/connection.js";
import { collection } from "../config/collection.js";
import { ObjectId } from "mongodb";



export const getAllCategories = (req,res) => {
    
    db.collection(collection.CATEGORY_COLLECTION).find({}).toArray().then(response=> {
       
        res.status(200).json(response)
    }).catch(err=> {
        console.log(err)
    })
}

export const getCategorybyId = (req,res) => {
    console.log(req.params.id)
    if(!req.params.id) return res.status(400).json("Undefined category Id")
    db.collection(collection.CATEGORY_COLLECTION)
    .findOne({_id:new ObjectId(req.params.id)})
    .then(response=> {
       
        res.status(200).json(response)
    }).catch(err=> {
        console.log(err)
    })
}