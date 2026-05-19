import express from "express";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validAuthor } from "../middlewares/validAuthor.js";
import { register } from "../services/AuthServices.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = express.Router();
// register author
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;
    try {
      // get user object from req
      let authorObj = req.body;
      // call register function
      if (req.file) {
        // console.log("file is ",req.file);
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }
      let newAuthorObj = await register({
        ...authorObj,
        role: "AUTHOR",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      // send the res
      res
        .status(201)
        .json({ message: "Author created", payload: newAuthorObj });
    } catch (err) {
      // Step 3: rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err); // send to your error middleware
    }
  },
);

// create article (private or protected)
authorRoute.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
  // get the article from req
  let author = req.user.userId;
  let articleObj = req.body;
  articleObj.author = author;
  // create the article document
  let articleDoc = new ArticleModel(articleObj);
  // save the article
  let article = await articleDoc.save();
  // send res
  res.status(201).json({ message: "article created", payload: article });
});

// read articles (private or protected)  --> old way
// authorRoute.get("/articles/:authorid",verifyToken("AUTHOR"),async(req,res)=>{
//     // get the author id
//     let authorId = req.params.authorid;

//     // read the articles by the author
//     let allArticles = await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author comments.user", "firstName lastName");
//     // res
//     res.status(200).json({message:"author articles",payload:allArticles})
// })

authorRoute.get("/articles", verifyToken("AUTHOR"), async (req, res) => {
  // get the author id
  let authorId = req.user.userId;

  // read the articles by the author
  let allArticles = await ArticleModel.find({
    author: authorId,
    isArticleActive: true,
  }).populate("author comments.user", "firstName lastName");
  // res
  res.status(200).json({ message: "author articles", payload: allArticles });
});

// // edit article by author my version
// authorRoute.put("/articles", validAuthor, async(req,res)=>{
//     // get the modified article from req
//     let modifiedArticle = req.body;
//     let id=modifiedArticle.articleId;
//     delete modifiedArticle.articleId;
//     // find and update the article
//     let updatedArticle = await ArticleModel.findOneAndUpdate(
//         {_id:id},
//         {...modifiedArticle},
//         {new:true}
//     ).populate("author")

//     // res

//     res.status(200).json({message:"article updated",payload:updatedArticle});
// })

// edit article by author (sirs version) (private or protected)
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  // get the modified article from req
  let { articleId, category, title, content } = req.body;
  let author = req.user.userId;
  // find and update the article
  let articleOfDB = await ArticleModel.findOne({
    _id: articleId,
    author: author,
  });
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }

  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );

  // res

  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

// delete (soft delete)  (private or protected)
authorRoute.patch(
  "/article/:articleid/status",
  verifyToken("AUTHOR"),
  async (req, res) => {
    // get the article id
    let aid = req.params.articleid;
    let author = req.user.userId;
    // find the article
    let articleOfDB = await ArticleModel.findOne({ _id: aid, author: author });
    if (!articleOfDB) {
      res
        .status(401)
        .json({ message: "article not found or not belong to you" });
    }

    // make the article status to false (isArticleActive)
    let updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id: aid },
      { $set: { isArticleActive: !articleOfDB.isArticleActive } },
      { runValidators: true, returnDocument: "after" },
    );

    res
      .status(200)
      .json({
        message: "Status of the article changed",
        payload: updatedArticle,
      });
  },
);