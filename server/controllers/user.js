import { db } from "../config/connection.js";
import { collection } from "../config/collection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { resolve } from "path";
import Razorpay from "razorpay";
import { createHmac } from "crypto";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import { rejects } from "assert";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

let otpStorage = new Map();

function uploadProfilePic(req, res) {
  return new Promise((resolve, rejects) => {
    const extention = req.file.originalname.split(".").at(1);
    const filename = Date.now() + uuidv4() + "." + extention;

    s3.upload({
      Bucket: `${process.env.AWS_S3_BUCKET}/user_profile_pic`,
      Key: filename,
      Body: req.file.buffer,
    })
      .promise()
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        rejects(err);
      });
  });
}

const uploadFileName = (req, res, filename) => {
  return new Promise((resolve, reject) => {
    db.collection(collection.USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(req.params.userid) },
        {
          $set: { profile_pic: filename },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createUser = (req, res, next) => {
  return new Promise(async () => {
    console.log(req.body);
    const { first_name, email, password } = req.body;
    if (!first_name || !email || !password)
      return res.status(401).json("Required all field");
    const salt = await bcrypt.genSalt();
    req.body.password = await bcrypt.hash(req.body.password, salt);
    req.body.role = "student";
    const user = await db
      .collection(collection.USER_COLLECTION)
      .findOne({ email: email });
    if (user) return res.status(400).json("Email already exist.");
    db.collection(collection.USER_COLLECTION)
      .insertOne(req.body)
      .then((response) => {
        return db
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: new ObjectId(response.insertedId) });
      })
      .then((response) => {
        console.log(response);

        jwt.sign(
          { _id: response._id },
          process.env.SECRET_KEY,
          { expiresIn: "5h" },
          (err, decoded) => {
            if (err) throw err;
            res.cookie("token", decoded, {
              maxAge: 5 * 60 * 60 * 1000,
              httpOnly: true,
              sameSite: "Strict",
            });

            res
              .status(201)
              .json({
                _id: response._id,
                name: response.first_name,
                role: response.role,
              });
          }
        );
      })
      .catch((err) => {
        next(err);
      });
  });
};

export const loginUser = (req, res, next) => {
  return new Promise(async () => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return next({ status: 401, message: "Required all field" });
    try {
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ email: email });
      console.log(user);
      if (!user) return res.status(401).json("User not exist , Please signup");

      const isPasswordTrue = await bcrypt.compare(password, user.password);

      if (!isPasswordTrue) return res.status(401).json("Password is Incorrect");

      jwt.sign(
        { _id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "5h" },
        (err, decoded) => {
          if (err) throw err;
          res.cookie("token", decoded, {
            maxAge: 5 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "Strict",
          });

          res
            .status(200)
            .json({ _id: user._id, name: user.first_name, role: user.role });
        }
      );
    } catch (err) {
      next(err);
    }
  });
};

export const verifyAccountViaEmail = async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  if (!email) return res.status(400).json("Email is undefined");

  db.collection(collection.USER_COLLECTION)
    .findOne({ email: email })
    .then((response) => {
      if (!response)
        return res.status(404).json("Email not registered. Please sign in");

      let otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const expirationTime = Date.now() + 90 * 1000;

      otpStorage.set(email, { otp, expirationTime });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "mtshafad@gmail.com",
          pass: "joqp imts zyum ghch",
        },
      });

      let mailoptions = {
        from: "mtshafad@gmail.com", // sender address
        to: `${response.email}`, // list of receivers
        subject: "Verify OTP", // Subject line,
        html: `<b>OTP for you CODEFREAK accout reset</b><h3>${otp}</h3>`,
      };

      transporter.sendMail(mailoptions, (err, info) => {
        if (err) {
          console.log(err);
        }
        otpStorage.set("useremail", email);
        res
          .status(200)
          .json("OTP has been send to your email. Check your email!");
      });
    })
    .catch((err) => {
      next(err);
    });
};

export const verfiyOTP = (req, res) => {
  let { otp } = req.body;
  console.log(req.email);
  if (!otp) return res.status(400).json("Email or otp undefined");
  const email = otpStorage.get("useremail");
  const storedOtp = otpStorage.get(email);

  if (storedOtp && storedOtp.expirationTime > Date.now()) {
    if (otp === storedOtp.otp) {
      res.status(200).json("OTP verification successfull");
    } else {
      res.status(400).json("Invalid OTP");
    }
  } else {
    res.status(400).json("OTP has expired or not available");
  }
};

export const resetPassword = (req, res, next) => {
  const { email, password, confirm_password } = req.body;
  console.log(req.body);
  if (!email || !password || !confirm_password)
    return res.status(400).json("Required all field");

  if (confirm_password !== password)
    return res.status(400).json("Do not match cofirm password with password");

  db.collection(collection.USER_COLLECTION)
    .findOne({ email: email })
    .then((user) => {
      if (!user) return res.status(400).json("Email not registered");

      return bcrypt.genSalt(10);
    })
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return db.collection(collection.USER_COLLECTION).updateOne(
        { email: email },
        {
          $set: { password: hashedPassword },
        }
      );
    })
    .then((response) => {
      console.log("password reset successfull");
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const auth = (req, res) => {
  try {
    console.log("hello world");
    res.status(200).json("ok");
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log("hello safad mt");
    const { userid } = req.params;
    console.log(userid);
    const id = userid !== undefined && userid !== null ? userid : req.user;
    const user = await db
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) return res.status(404).json("User not found");

    if (user?.enrolled_courses && user.enrolled_courses.length > 0) {
      let user = await db
        .collection(collection.USER_COLLECTION)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          { $unwind: "$enrolled_courses" },
          {
            $lookup: {
              from: "courses",
              localField: "enrolled_courses.courseId",
              foreignField: "_id",
              as: "courseInfo",
            },
          },
          {
            $unwind: "$courseInfo",
          },
          {
            $group: {
              _id: "$_id",
              email: { $first: "$email" },
              first_name: { $first: "$first_name" },
              role: { $first: "$role" },
              profile_pic: { $first: "$profile_pic" },
              instagram: { $first: "$instagram" },
              last_name: { $first: "$last_name" },
              facebook: { $first: "$facebook" },
              occupation: { $first: "$occupation" },
              enrolled_courses: {
                $push: {
                  courseId: "$courseInfo._id",
                  title: "$courseInfo.title",
                  description: "$courseInfo.description",
                  course_fee: "$courseInfo.course_fee",
                  fee_status: "$courseInfo.fee_status",
                  course_image: "$courseInfo.course_image",
                  lessonscompleted: "$enrolled_courses.lessonscompleted",
                },
              },
            },
          },
        ])
        .toArray();
      if (!user) return res.status(404).json("User not found");

      res.status(200).json(user[0]);
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

// const getEnrolledCourses = (req,res, next) => {
//     const {userid} = req.params;

//     if(!userid) return res.status(404).json("User Id undefined or null")

//     db.collection(collection.USER_COLLECTION).

// }

export const editPassword = async (req, res, next) => {
  try {
    const { userid } = req.params;
    console.log(req.body);
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res.status(400).json("Required Password Information");
    const id = userid !== undefined && userid !== null ? userid : req.user;

    const user = await db
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(id) });
    const isPasswordTrue = await bcrypt.compare(
      current_password,
      user.password
    );
    if (isPasswordTrue) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      const updated = await db.collection(collection.USER_COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { password: hashedPassword },
        }
      );
      if (updated) {
        res.status(200).json("Success");
      }
    } else {
      res.status(400).json("Current Password is incorrect");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const editUserInfo = (req, res, next) => {
  const { userid } = req.params;
  const id = userid !== undefined && userid !== null ? userid : req.user;

  const { first_name, last_name, occupation, facebook, instagram } = req.body;

  if (!first_name || !last_name || !occupation || !facebook || !instagram) {
    res.status(401).json("Require all field");
  }

  db.collection(collection.USER_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: req.body,
      }
    )
    .then((response) => {
      res.status(201).json("updated");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

export const uploadProfiePhoto = async (req, res, next) => {
  const { userid } = req.params;
  console.log(req.files);
  const id = userid !== undefined && userid !== null ? userid : req.user;
  try {
    const user = await db
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(id) }, { projection: { profile_pic: 1 } });

    if (!user) return res.status(404).json("User not registered");

    //creating a unique filename for
    const extention = req.file.originalname.split(".").at(1);
    const filename = Date.now() + uuidv4() + "." + extention;
    if (user?.profile_pic) {
      let info = {
        Bucket: `${process.env.AWS_S3_BUCKET}`,
        Key: user.profile_pic,
      };

      await s3.deleteObject(info).promise();

      const response = await uploadProfilePic(req, res);
      console.log(response);
      if (response) {
        const updated = uploadFileName(req, res, response.Key);
        res.status(200).json(updated);
      }
    } else {
      const response = await uploadProfilePic(req, res);
      if (response) {
        const updated = await uploadFileName(req, res, response.Key);
        res.status(200).json(updated);
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteProfilePic = async (req, res, next) => {
  const { userid } = req.params;

  const id = userid !== undefined || userid !== null ? userid : req.user;
  try {
    const user = await db
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(id) }, { projection: { profile_pic: 1 } });

    if (user) {
      let info = {
        Bucket: `${process.env.AWS_S3_BUCKET}`,
        Key: user.profile_pic,
      };

      await s3.deleteObject(info).promise();

      const response = await db
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { profile_pic: null } });

      res.status(200).json(response);
    }
  } catch (err) {
    next(err);
  }
};

export const submitInstructorInfo = (req, res, next) => {
  const { userid } = req.params;

  const id = userid !== undefined || userid !== null ? userid : req.user;

  const {
    highest_level_education,
    currently_work,
    subject_area,
    experience,
    aboutyourself,
    education_subject,
    university,
  } = req.body;
  if (
    !currently_work ||
    !subject_area ||
    !experience ||
    !aboutyourself ||
    !highest_level_education ||
    !education_subject ||
    !university
  ) {
    console.log("hello");
    return res.status(400).json("Required all field");
  }

  req.body.role = "instructor";
  db.collection(collection.USER_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: req.body,
      }
    )
    .then((response) => {
      return db
        .collection(collection.USER_COLLECTION)
        .findOne(
          { _id: new ObjectId(id) },
          { projection: { role: 1, email: 1 } }
        );
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

export const BuyCourse = (req, res) => {
  const fee = Number(req.body.course_fee);
  console.log(fee);
  var options = {
    amount: fee * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "rzpl",
  };

  instance.orders.create(options, function (err, paymentdetails) {
    console.log(err);
    console.log(paymentdetails);
    if (err) return res.status(err.statusCode).json(err.error);
    res.status(201).json(paymentdetails);
  });
};

export const verifyPayment = (req, res, next) => {
  if (!req.body) return res.status(400).json("Payment details not found");
  let { response, userId, courseId, amount } = req.body;

  let hma = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hma.update(response.razorpay_order_id + "|" + response.razorpay_payment_id);
  hma = hma.digest("hex");

  db.collection(collection.COURSE_COLLECTION)
    .findOne({ _id: new ObjectId(courseId) }, { projection: { userid: 1 } })
    .then((user) => {
      if (hma == response.razorpay_signature) {
        const paymentdetails = {
          userId: new ObjectId(req.user),
          instructorId: new ObjectId(user.userid),
          courseId: new ObjectId(courseId),
          paymentId: response.razorpay_payment_id,
          amount: Number(amount),
          payment_gateway: "Razorpay",
          status: "Successfull",
          orderId: response.razorpay_order_id,
        };

        db.collection(collection.PAYMENT_COLLECTION)
          .findOneAndUpdate(
            { paymentId: response.razorpay_payment_id },
            {
              $set: paymentdetails,
            },
            { upsert: true, returnDocument: "after" }
          )
          .then((response) => {
            return db.collection(collection.USER_COLLECTION).findOneAndUpdate(
              { _id: new ObjectId(userId) },
              {
                $addToSet: {
                  enrolled_courses: {
                    courseId: new ObjectId(courseId),
                    fee_status: "Paid",
                    lessonscompleted: [],
                  },
                  paymentIds: response._id,
                },
              }
            );
          })
          .then(() => {
            console.log(response);
            return db.collection(collection.COURSE_COLLECTION).updateOne(
              { _id: new ObjectId(courseId) },
              {
                $addToSet: {
                  enrolled_users: {
                    userid: new ObjectId(req.user),
                    enrollment_date: new Date(),
                  },
                },
              }
            );
          })
          .then((response) => {
            res.status(200).json("Payment successfull");
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.status(400).json("Payment failed");
      }
    })
    .catch((err) => {
      next(err);
    });
};

export const paymentFailed = (req, res, next) => {
  if (req.body) return res.status(400).json("Payment details not found");
  const { reason, courseId, userId, amount, order_id, payment_id } = req.body;

  db.collection(collection.COURSE_COLLECTION);
  findOne({ _id: new ObjectId(userId) }, { projection: { userid: 1 } })
    .then((user) => {
      const paymentdetails = {
        userId: userId,
        courseId: courseId,
        instructorId: user.userid,
        paymentId: payment_id,
        amount: Number(amount),
        payment_gateway: "Razorpay",
        status: "Failed",
        reason,
        orderId: order_id,
      };

      db.collection(collection.PAYMENT_COLLECTION)
        .findOneAndUpdate(
          { paymentId: payment_id },
          {
            $set: paymentdetails,
          },
          { upsert: true, returnDocument: "after" }
        )
        .then((response) => {
          return db.collection(collection.USER_COLLECTION).updateOne(
            { _id: new ObjectId(req.user) },
            {
              $addToSet: { paymentIds: new ObjectId(response._id) },
            }
          );
        })
        .then((response) => {
          res.status(200).json("Ok");
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .catch((err) => {});
};

export const setEnrollCourse = (req, res, next) => {
  let { userid } = req.params;
  if (!req.body) return res.status(400).json("Details not found");
  userid = userid !== undefined || userid !== null ? userid : req.user;
  db.collection(collection.USER_COLLECTION)
    .updateOne(
      { _id: new ObjectId(userid) },
      {
        $addToSet: {
          enrolled_courses: {
            courseId: new ObjectId(req.body.courseid),
            fee_status: req.body.fee_status,
            lessonscompleted: [],
          },
        },
      }
    )
    .then(() => {
      return db.collection(collection.COURSE_COLLECTION).updateOne(
        { _id: new ObjectId(req.body.courseid) },
        {
          $addToSet: {
            enrolled_users: new ObjectId(userid),
          },
        }
      );
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
};

export const setEnrolledCoursesLessonStatus = (req, res) => {
  const { userid } = req.params;
  console.log(req.body, "hello enrolled");
  const { status, courseId, lessonId } = req.body;
  if (status == 0) {
    db.collection(collection.USER_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(userid),
          "enrolled_courses.courseId": new ObjectId(courseId),
        },
        {
          $addToSet: {
            "enrolled_courses.$.lessonscompleted": new ObjectId(lessonId),
          },
        }
      )
      .then((response) => {
        console.log(response);
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err.message);
        next(err);
      });
  } else if (status == 1) {
    db.collection(collection.USER_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(userid),
          "enrolled_courses.courseId": new ObjectId(courseId),
        },
        {
          $pull: {
            "enrolled_courses.$.lessonscompleted": new ObjectId(lessonId),
          },
        }
      )
      .then((response) => {
        console.log(response);
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err.message);
        next(err);
      });
  }
};

export const updateWishList = (req, res, next) => {
  console.log(req.body.courseId);
  const { userid } = req.params;
  if (!userid || !req.body.courseId) {
    res.status(400).json("UserId or CourseId not found");
  }
  db.collection(collection.USER_COLLECTION)
    .findOne({ _id: new ObjectId(userid) })
    .then((user) => {
      const isCourse = user.wishlist
        ? user.wishlist.some((id) => id.toString() === req.body.courseId)
        : false;
      console.log(isCourse);
      if (isCourse) {
        db.collection(collection.USER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(userid) },
            {
              $pull: { wishlist: new ObjectId(req.body.courseId) },
            }
          )
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        db.collection(collection.USER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(userid) },
            {
              $addToSet: { wishlist: new ObjectId(req.body.courseId) },
            }
          )
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((err) => {
            next(err);
          });
      }
    });
};

export const getInstructorInfo = (req, res, next) => {
  const { userid } = req.params;

  if (!userid) return res.status(400).json("User Id undefined");

  db.collection(collection.USER_COLLECTION)
    .findOne(
      { _id: new ObjectId(userid) },
      {
        projection: {
          aboutyourself: 1,
          currently_work: 1,
          experience: 1,
          highest_level_education: 1,
          education_subject: 1,
          subject_area: 1,
          university: 1,
          first_name: 1,
        },
      }
    )
    .then((response) => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const getWishList = (req, res, next) => {
  const { userid } = req.params;
  if (!userid) {
    res.status(400).json("UserId not found");
  }

  db.collection(collection.USER_COLLECTION)
    .findOne({ _id: new ObjectId(userid) }, { projection: { wishlist: 1 } })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const getWishlistDetails = (req, res, next) => {
  const { userid } = req.params;
  if (!userid) {
    res.status(400).json("UserId not found");
  }

  db.collection(collection.USER_COLLECTION)
    .aggregate([
      {
        $match: { _id: new ObjectId(userid) },
      },
      {
        $unwind: "$wishlist",
      },
      {
        $lookup: {
          from: "courses", // Replace with your actual courses collection name
          localField: "wishlist",
          foreignField: "_id",
          as: "courseInfo",
        },
      },

      // Unwind the courseInfo array
      { $unwind: "$courseInfo" },

      {
        $project: {
          course_id: "$courseInfo._id",
          wishlist: 1,
          title: "$courseInfo.title",
          description: "$courseInfo.description",
          course_fee: "$courseInfo.course_fee",
          ispublish: "$courseInfo.ispublish",
          fee_status: "$courseInfo.fee_status",
          rating: "$courseInfo.rating",
          course_image: "$courseInfo.course_image",
        },
      },
    ])
    .toArray()
    .then((response) => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export const editInstructorInfo = async (req, res, next) => {
  const { userid } = req.params;

  if (!userid) return res.status(400).json("User Id undefined");

  const {
    highest_level_education,
    currently_work,
    subject_area,
    experience,
    aboutyourself,
    education_subject,
    university,
  } = req.body;

  if (
    !req.body ||
    !highest_level_education ||
    !currently_work ||
    !university ||
    !subject_area ||
    !experience ||
    !aboutyourself ||
    !education_subject
  )
    return res.status(400).json("Instructor info is undefined");
  try {
    const response = await db.collection(collection.USER_COLLECTION).updateOne(
      { _id: new ObjectId(userid) },
      {
        $set: {
          highest_level_education,
          currently_work,
          subject_area,
          experience,
          aboutyourself,
          education_subject,
          university,
        },
      }
    );

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
