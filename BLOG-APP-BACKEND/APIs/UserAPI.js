// building the mini express application
import express from "express";
import { register } from "../services/AuthServices.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validUSer } from "../middlewares/validUser.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { upload } from "../Config/multer.js";
import cloudinary from "../Config/cloudinary.js";
import { uploadToCloudinary } from "../Config/cloudinaryUpload.js";

export const userRoute = express.Router();

// register
userRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;
    // console.log("req is ", req);
    try {
      let userObj = req.body;

      //  Step 1: upload image to cloudinary from memoryStorage (if exists)
      if (req.file) {
        // console.log("file is ",req.file);
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Step 2: call existing register()
      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
        payload: newUserObj,
      });
    } catch (err) {
      // Step 3: rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err); // send to your error middleware
    }
  },
);

// read all articles
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  let allArticles = await ArticleModel.find({ isArticleActive: true }).populate(
    "author comments.user",
  );
  res.status(200).json({
    message: "All Articles",
    payload: allArticles,
  });
});

// // adding one comment on an article
// userRoute.put("/user/:uid/article/:aid",verifyToken("USER"),validUSer, async(req,res) => {
//     let {uid,aid} = req.params;
//     // console.log(aid)
//     if(uid != req.user.userId){
//         return res.status(403).json({message:"forbidden"})
//     }
//     // we have already checked if it's a valid user or not now we just need to find out if the article is present or not
//     let articleofDB = await ArticleModel.findOne({_id:aid,isArticleActive:true});
//     // let articleofDB = await ArticleModel.find();
//     console.log(articleofDB)
//     if(!articleofDB){
//         return res.status(404).json({
//             message:"Article not found"
//         })
//     }

//     // now we need to push the comment
//     let newArticle = await ArticleModel.findOneAndUpdate(
//         {_id:aid,isArticleActive:true},
//         {$push:{"comments":{user:uid,comment:req.body.comment}}},
//         {returnDocument:"after"}
//     ).populate("comments.user author")

//     res.status(200).json({
//         message:"comment added",
//         payload:newArticle
//     })
// })

// user reads an article with id
userRoute.get("/article/:id", verifyToken("USER"), async (req, res) => {
  let id = req.params.id;

  let article = await ArticleModel.findById(id).populate("comment.user");
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json({ message: "Article found", payload: article });
});

// adding one comment on an article
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  let { articleId, comment } = req.body;
  const user = req.user.userId;
  // find and update the article with the new comment
  let articleofDB = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { comments: { user, comment } } },
    { returnDocument: "after", runValidators: true },
  )
  .populate("author", "firstName lastName profileImageUrl")
  .populate("comments.user", "firstName lastName profileImageUrl");
  if (!articleofDB) {
    return res.status(404).json({
      message: "Article not found",
    });
  }

  res.status(200).json({
    message: "comment added",
    payload: articleofDB,
  });
});