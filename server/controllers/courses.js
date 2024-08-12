import { v4 as uuidv4 } from "uuid";
import "dotenv/config.js";
import { ObjectId } from "mongodb";
import { db } from "../config/connection.js";
import { collection } from "../config/collection.js";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

const uploadImageFile = (req, res) => {
  return new Promise((resolve, reject) => {
    const extention = req.file.originalname.split(".").at(1);
    const filename = Date.now() + uuidv4() + "." + extention;
    req.body.lessons = [];
    const uploadfile = {
      Bucket: `${process.env.AWS_S3_BUCKET}/course_images`,
      Key: filename,
      Body: req.file.buffer,
    };
    s3.upload(uploadfile)
      .promise()
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createCourse = (req, res, next) => {
  const { userid } = req.params;

  const id = userid !== null || userid !== undefined ? userid : req.user;
  const { title, description, fee_status, category, course_fee } = req.body;

  if (
    !title ||
    !description ||
    !fee_status ||
    !category ||
    !req.files["course_image"][0]
  ) {
    return res.status(400).json("Required all details of course");
  }
  if (
    fee_status === "Paid" &&
    (course_fee === "" || course_fee === undefined)
  ) {
    return res.status(400).json("Course fee is required");
  }
  if (fee_status === "Paid") {
    req.body.course_fee = parseInt(req.body.course_fee);
  }
  req.body.userid = new ObjectId(id);
  req.body.rating = 0;
  req.body.ispublish = req.body.ispublish === "false" ? false : true;
  req.body.category = new ObjectId(req.body.category);
  // req.body.course_image = req.files["course_image"][0].filename;

  req.body.lessons = [];
  uploadImageFile(req, res)
    .then((response) => {
      req.body.course_image = response.Key;
      return db.collection(collection.COURSE_COLLECTION).insertOne(req.body);
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const getInstructorCourses = (req, res, next) => {
  const { userid } = req.params;

  const id = userid !== "undefined" && userid !== null ? userid : req.user;

  db.collection(collection.COURSE_COLLECTION)
    .aggregate([
      {
        $match: { userid: new ObjectId(id) },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          pipeline: [{ $project: { first_name: 1 } }],
          as: "userinfo",
        },
      },
      {
        $unwind: "$userinfo",
      },
      {
        $project: {
          title: 1,
          description: 1,
          course_fee: 1,
          category: 1,
          lessons: 1,
          userid: 1,
          rating: 1,
          ispublish: 1,
          fee_status: 1,
          course_image: 1,
          username: "$userinfo.first_name",
        },
      },
    ])
    .toArray()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const getCourses = async (req, res, next) => {
  let { limitcourses, skipcourses } = req.params;

  skipcourses = Number(skipcourses) || 1;
  limitcourses = Number(limitcourses) || 5;

  skipcourses = (skipcourses - 1) * limitcourses || 0 * limitcourses;
  try {
    const totalcourses = await db
      .collection(collection.COURSE_COLLECTION)
      .countDocuments({ ispublish: true });
    const totalpages = Math.ceil(totalcourses / limitcourses);
    const totalcoursefetched = limitcourses * req.params.skipcourses;
    console.log(req.params);
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .find({ ispublish: true })
      .skip(skipcourses)
      .limit(limitcourses)
      .toArray();

    res
      .status(200)
      .json({ response, totalcourses, totalpages, totalcoursefetched });
  } catch (err) {
    next(err);
  }
};

export const getCourse = (req, res, next) => {
  let { courseid } = req.params;
  if (courseid == "undefined" && courseid === null)
    return res.status(400).json("Course id not provided");

  db.collection(collection.COURSE_COLLECTION)
    .aggregate([
      {
        $match: { _id: new ObjectId(courseid) },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          pipeline: [{ $project: { first_name: 1 } }],
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },

      {
        $project: {
          title: 1,
          description: 1,
          course_fee: 1,
          userid: 1,
          ispublish: 1,
          fee_status: 1,
          enrolled_users: 1,
          rating: 1,
          course_image: 1,
          category: "$categoryInfo",
          lessons: 1,
          username: "$userInfo.first_name",
        },
      },
    ])
    .toArray()
    .then((response) => {
      res.status(200).json(response[0]);
    })
    .catch((err) => {
      next(err);
    });
};

export const addNewLesson = (req, res, next) => {
  const { courseid } = req.params;

  if (!courseid) return res.status(400).json("Undefined course id");

  const { description } = req.body;
  if (!description || !req.file)
    return res.status(400).json("lesson info not provided");
  req.body._id = new ObjectId();

  const extention = req.file.originalname.split(".").at(1);
  const filename = Date.now() + uuidv4() + "." + extention;
  const uploadFile = {
    Bucket: `${process.env.AWS_S3_BUCKET}/lesson_videos`,
    Key: filename,
    Body: req.file.buffer,
  };

  s3.upload(uploadFile)
    .promise()
    .then((response) => {
      req.body.learning_video = response.Key;
      return db.collection(collection.COURSE_COLLECTION).updateOne(
        { _id: new ObjectId(courseid) },
        {
          $push: { lessons: req.body },
        }
      );
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const removeLesson = (req, res, next) => {
  const { courseid, lessonid } = req.params;

  if (!courseid || !ObjectId.isValid(courseid))
    return res.status(400).json("Undefined course Id");
  if (!lessonid || !ObjectId.isValid(lessonid))
    return res.status(400).json("Undefined lesson id ");
  db.collection(collection.COURSE_COLLECTION)
    .findOne({ _id: new ObjectId(courseid) }, { projection: { lessons: 1 } })
    .then((data) => {
      const _lesson = data.lessons.find((lesson) => lesson._id == lessonid);
      console.log(_lesson);
      const info = {
        Bucket: `${process.env.AWS_S3_BUCKET}`,
        Key: _lesson.learning_video,
      };
      s3.deleteObject(info)
        .promise()
        .then((response) => {
          console.log(response);
          return db.collection(collection.COURSE_COLLECTION).updateOne(
            { _id: new ObjectId(courseid) },
            {
              $pull: { lessons: { _id: new ObjectId(lessonid) } },
            }
          );
        })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

export const editCourseDetais = async (req, res, next) => {
  const { courseId } = req.params;
  console.log(req.body);
  if (courseId == undefined || courseId == null)
    return res.status(404).json("Required product Id");
  if (!req.body) return res.status(404).json("Please provide course details");

  const { title, description, fee_status, course_fee, category } = req.body;
  if (!title || !description || !fee_status || !category) {
    return res.status(404).json("Please Provide course details");
  }
  if (fee_status === "Paid" && (!course_fee || course_fee === null)) {
    return res.status(404).json("Course fee is required");
  }
  if (fee_status === "Paid") {
    req.body.course_fee === parseInt(course_fee);
  }
  req.body.category = new ObjectId(req.body.category);

  if (req.file) {
    let course_image_name;

    db.collection(collection.COURSE_COLLECTION)
      .findOne(
        { _id: new ObjectId(courseId) },
        { projection: { course_image: 1 } }
      )
      .then((course) => {
        course_image_name = course.course_image;
        const info = {
          Bucket: `${process.env.AWS_S3_BUCKET}`,
          Key: course_image_name,
        };
        return s3.deleteObject(info).promise();
      })
      .then((response) => {
        return uploadImageFile(req, res);
      })
      .then((response) => {
        req.body.course_image = response.Key;
        return db.collection(collection.COURSE_COLLECTION).updateOne(
          { _id: new ObjectId(courseId) },
          {
            $set: {
              title,
              description,
              category: new ObjectId(category),
              fee_status,
              course_fee: fee_status === "Paid" ? Number(course_fee) : null,
              course_image: response.Key,
            },
          }
        );
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    db.collection(collection.COURSE_COLLECTION)
      .updateOne(
        { _id: new ObjectId(courseId) },
        {
          $set: {
            title,
            description,
            category: new ObjectId(category),
            fee_status,
            course_fee: fee_status === "Paid" ? Number(course_fee) : null,
          },
        }
      )
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      });
  }
};

export const editLesson = (req, res, next) => {
  const { courseid, lessonid } = req.params;

  if (courseid == undefined || courseid === null) {
    return res.status(404).json("Course id undefined");
  }

  if (lessonid == undefined || lessonid === null) {
    return res.status(404).json("Lesson id undefined");
  }

  if (!req.body) return res.status(404).json("formData is undefined");
  if (req.file) {
    return new Promise(() => {
      db.collection(collection.COURSE_COLLECTION)
        .findOne(
          { _id: new ObjectId(courseid) },
          { projection: { lessons: 1 } }
        )
        .then((response) => {
          const lesson = response.lessons.find(
            (lesson) => lesson._id == lessonid
          );

          let info = {
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: lesson.learning_video,
          };

          return s3.deleteObject(info).promise();
        })
        .then((response) => {
          const extention = req.file.originalname.split(".").at(1);
          const filename = Date.now() + uuidv4() + "." + extention;

          const uploadFile = {
            Bucket: `${process.env.AWS_S3_BUCKET}/lesson_videos`,
            Key: filename,
            Body: req.file.buffer,
          };

          return s3.upload(uploadFile).promise();
        })
        .then((response) => {
          return db.collection(collection.COURSE_COLLECTION).updateOne(
            {
              _id: new ObjectId(courseid),
              "lessons._id": new ObjectId(lessonid),
            },
            {
              $set: {
                "lessons.$.learning_video": response.Key,
                "lessons.$.description": req.body.description,
              },
            }
          );
        })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          next(err);
        });
    });
  } else {
    db.collection(collection.COURSE_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(courseid),
          "lessons._id": new ObjectId(lessonid),
        },
        {
          $set: { "lessons.$.description": req.body.description },
        }
      )
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      });
  }
};

export const updateIsPublishCourse = (req, res, next) => {
  const { courseid } = req.params;

  if (!req.params.courseid) {
    return res.status(404).json("Course _id is undefined");
  }
  console.log(req.body.ispublish);

  db.collection(collection.COURSE_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(courseid) },
      {
        $set: { ispublish: req.body.ispublish },
      },
      { upsert: true, returnDocument: "after" }
    )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const addCourseComment = (req, res, next) => {
  let { courseid } = req.params;
  console.log("add course", courseid);
  console.log(req.body);
  let { rating, comment, userId } = req.body;
  if (!courseid || !ObjectId.isValid(courseid)) {
    res.status(400).json("Courseid not found or not valid");
  }
  if (!rating || !comment) {
    return res.status(400).json("Please fill all the field");
  } else {
    db.collection(collection.COURSE_FEEDBACK)
      .insertOne({
        courseid: new ObjectId(courseid),
        userid: new ObjectId(userId),
        rating: Number(rating),
        comment,
        createdAt: new Date(),
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      });
  }
};

export const getCourseComments = (req, res, next) => {
  let { courseid } = req.params;
  if (!courseid || !ObjectId.isValid(courseid))
    return res.status(400).json("Course Id not valid or not found");
  db.collection(collection.COURSE_FEEDBACK)
    .aggregate([
      {
        $match: { courseid: new ObjectId(courseid) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          pipeline: [{ $project: { first_name: 1 } }],
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          courseid: 1,
          user: "$userInfo.first_name",
          rating: 1,
          comment: 1,
          createdAt: 1,
        },
      },
    ])
    .toArray()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const getAverageRating = async (req, res, next) => {
  if (!req.params.courseid) return res.status(400).json("Course Id undefined");
  try {
    const response = await db
      .collection(collection.COURSE_FEEDBACK)
      .aggregate([
        {
          $match: { courseid: new ObjectId(req.params.courseid) },
        },
        {
          $group: {
            _id: "$courseid",
            avgrating: { $avg: { $sum: "$rating" } },
          },
        },
        {
          $project: {
            avgrating: { $round: ["$avgrating", 1] },
          },
        },
      ])
      .toArray();

    if (response.length > 0) {
      await db.collection(collection.COURSE_COLLECTION).updateOne(
        { _id: new ObjectId(req.params.courseid) },
        {
          $set: { rating: response[0].avgrating },
        }
      );
      res.status(200).json(response[0]);
    } else {
      res.status(200).json({ _id: req.params.courseid, avgrating: 0 });
    }
  } catch (err) {
    next(err);
  }
};

// get courses by filtering categories by category id's

export const getCourseBycategory = async (req, res, next) => {
  let { categoryid, skipcourses, limitcourses } = req.params;

  if (!categoryid || !skipcourses || !limitcourses)
    return res.status(400).json("Search params not provided");

  skipcourses = Number(skipcourses);
  limitcourses = Number(limitcourses) || 5;
  skipcourses = (skipcourses - 1) * limitcourses || 0 * limitcourses;
  try {
    const totalcourses = await db
      .collection(collection.COURSE_COLLECTION)
      .countDocuments({ category: new ObjectId(categoryid) });
    const totalpages = Math.ceil(totalcourses / limitcourses);
    const totalcoursefetched = limitcourses * req.params.skipcourses;
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .find({ category: new ObjectId(categoryid) })
      .sort({ _id: -1 })
      .skip(skipcourses)
      .limit(limitcourses)
      .toArray();
    res
      .status(200)
      .json({ response, totalcourses, totalpages, totalcoursefetched });
  } catch (err) {
    next(err);
  }
};

export const searchCourses = async (req, res, next) => {
  let query = {};
  let { text_search, limit, page, rating, price, categoryIds } = req.body;
  if (!text_search) return res.status(400).json("Search input undefined");

  page = Number(page);
  limit = Number(limit) || 5;
  page = (page - 1) * limit || 0 * limit;

  query.ispublish = true;
  query.$text = { $search: text_search };
  if (rating !== null) {
    query.rating = { $gte: rating };
  }
  if (price !== null) {
    query.fee_status = price;
  }
  if (categoryIds && categoryIds.length > 0) {
    let categoryId = categoryIds.map((id) => new ObjectId(id));
    query.category = { $in: categoryId };
  }

  try {
    const totalcourses = await db
      .collection(collection.COURSE_COLLECTION)
      .countDocuments(query);
    const totalpages = Math.ceil(totalcourses / limit);
    const totalcoursefetched = limit * req.body.page;

    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .find(query)
      .sort({ _id: -1 })
      .skip(page)
      .limit(limit)
      .toArray();
    res
      .status(200)
      .json({ response, totalcoursefetched, totalcourses, totalpages });
  } catch (err) {
    next(err);
  }
};

export const getAllcourses = async (req, res, next) => {
  let { skipcourses, limitcourses, categoryIds, rating, price } = req.body;

  skipcourses = Number(skipcourses);
  limitcourses = Number(limitcourses) || 5;
  skipcourses = (skipcourses - 1) * limitcourses || 0 * limitcourses;

  let query = { ispublish: true };
  if (categoryIds.length > 0) {
    let ids = categoryIds.map((id) => new ObjectId(id));
    query.category = { $in: ids };
  }

  if (rating !== null) {
    query.rating = { $gte: JSON.parse(rating) };
  }

  if (price !== null) {
    query.fee_status = price;
  }

  try {
    const totalcourses = await db
      .collection(collection.COURSE_COLLECTION)
      .countDocuments(query);
    const totalpages = Math.ceil(totalcourses / limitcourses);
    const totalcoursefetched = limitcourses * req.body.skipcourses;
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .aggregate([
        {
          $match: query,
        },

        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            pipeline: [{ $project: { first_name: 1 } }],
            as: "userinfo",
          },
        },
        {
          $unwind: "$userinfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            pipeline: [{ $project: { category_name: 1 } }],
            as: "categoryInfo",
          },
        },
        {
          $unwind: "$categoryInfo",
        },
        {
          $project: {
            title: 1,
            description: 1,
            course_fee: 1,
            category: "$categoryInfo.category_name",
            userid: 1,
            fee_status: 1,
            course_image: 1,
            username: "$userinfo.first_name",
            lessons: 1,
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $skip: skipcourses,
        },
        {
          $limit: limitcourses,
        },
      ])
      .toArray();

    res
      .status(200)
      .json({ response, totalpages, totalcourses, totalcoursefetched });
  } catch (err) {
    next(err);
  }
};

export const addQuestion = async (req, res, next) => {
  const { courseid } = req.params;
  console.log(courseid);
  const { question_text, created_by } = req.body;
  if (!req.body || !question_text || !created_by)
    return res.status(400).json("Question content not found");

  let info = {
    _id: new ObjectId(),
    created_by: new ObjectId(created_by),
    question_text: req.body.question_text,
    created_at: new Date(),
    replies: [],
  };
  try {
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .updateOne(
        { _id: new ObjectId(courseid) },
        {
          $push: { questions: info },
        }
      );

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const addQuestionReply = async (req, res, next) => {
  const { courseid } = req.params;

  const { created_by, questionId, reply_text } = req.body;
  if (!req.body || !created_by || !questionId || !reply_text)
    return res.status(400).json("Form data not found");

  let info = {
    _id: new ObjectId(),
    questionId: new ObjectId(questionId),
    reply_text,
    created_by: new ObjectId(created_by),
    created_at: new Date(),
  };

  try {
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(courseid),
          "questions._id": new ObjectId(questionId),
        },
        {
          $push: { "questions.$.replies": info },
        }
      );

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getQuestionAndAnswer = async (req, res, next) => {
  const { courseid } = req.params;

  if (!courseid) return res.status(400).json("Course Id undefined");

  try {
    const response = await db
      .collection(collection.COURSE_COLLECTION)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(courseid),
          },
        },
        // {
        //   $unwind: "$questions",
        // },
        {
          $lookup: {
            from: "users",
            localField: "questions.created_by",
            foreignField: "_id",
            pipeline: [{ $project: { email: 1 } }],
            as: "question_created_by",
          },
        },
        // { $unwind: "$question_created_by" },

        // {
        //   $unwind: "$questions.replies",
        // },

        {
          $lookup: {
            from: "users",
            localField: "questions.replies.created_by",
            foreignField: "_id",
            pipeline: [{ $project: { email: 1 } }],
            as: "reply_created_by",
          },
        },
        // {
        //   $unwind: "$reply_created_by",
        // },
        // {
        //   $project: {
        //     questions: 1,
        //     question_created_by: 1,
        //     reply_created_by :1
        //   }
        // }
        // {
        //   $group: {
        //     _id: "_id",
        //     questions: {
        //       $addToSet: {
        //         _id: "$questions._id",
        //         question_text: "$questions.question_text",
        //         created_by: "$question_created_by.email",
        //         created_at: "$questions.created_at",
        //         replies: {
        //           // Use sub-aggregation pipeline
        //           $map: {
        //             input: {
        //                 $filter: {
        //                     input: "$questions.replies",
        //                     as: "reply",
        //                     cond: { $eq: ["$$reply.questionId", "$questions._id"] } // Filter by question ID
        //                 }
        //             },
        //             as: "reply",
        //             in: {
        //                 _id: "$$reply._id",
        //                 reply_text: "$$reply.reply_text",
        //                 created_by: "$$reply.created_by.email",
        //                 created_at: "$$reply.created_at"
        //             }
        //         }
        //         },
        //       },
        //     },
        //   },
        // },
      ])
      .toArray();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
