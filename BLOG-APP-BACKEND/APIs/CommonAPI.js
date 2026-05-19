// mini express app
import express from "express";
import { login } from "../services/AuthServices.js";
import { UserModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { compare, hash } from "bcryptjs";
import {verifyToken} from "../middlewares/verifyToken.js"

export const commonRoute = express.Router();

// public: get latest articles for home page (no auth)
commonRoute.get("/articles", async (req, res, next) => {
    try {
        let articles = await ArticleModel.find({ isArticleActive: true })
            .populate("author", "firstName lastName profileImageUrl")
            .sort({ createdAt: -1 })
            .limit(6);
        res.status(200).json({
            message: "Latest articles",
            payload: articles
        });
    } catch (err) {
        next(err);
    }
});
// login route
commonRoute.post("/login",async(req,res,next)=>{
    try{
        let {email,password} = req.body;
        let {token,user} = await login(email,password);
        // console.log(token)
        // save the cookie as http only cookie
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false
        });
        // sending the response now
        res.status(200).json({
            message:`${user.role} Logged In Successfully!`,
            payload: user
        })
    }catch(err){
        next(err);
    }
})

// logout

commonRoute.get("/logout",async(req,res)=>{
    // clear the cookies
    res.clearCookie("token",{
        secure:false,
        sameSite:"lax",
        httpOnly:true
    })
    res.status(200).json({
        message: `logout successful!`
    })
})

// change password
commonRoute.put("/change-password",async(req,res)=>{
    // get the email,oldpassword,newpassword
    let {email,oldPassword,newPassword} = req.body;
    // chack if there's a user with this email or not 
    
    let user = await UserModel.findOne({email:email});
    // console.log(user)
    if(!user){
        return res.status(401).json({
            message:"no user with this email"
        })
    }
    // compare the password
    // console.log(oldPassword)
    // console.log(user.password)
    let isMatchPassword = await compare(oldPassword,user.password)
    // console.log(isMatchPassword)
    if(!isMatchPassword){
        return res.status(401).json({
            message:"Sorry wrong password"
        })
    }
    // now the passwords are same so update the password
    newPassword = await hash(newPassword,12);
    let updatedUser = await UserModel.findOneAndUpdate(
        {email:email},
        {$set:{password:newPassword}},
        {returnDocument:"after", runValidators:true}
    )
    // send the response
    res.status(200).json({
        message:"changes the password Successfully",
        payload: updatedUser
    })
})

commonRoute.get("/check-auth", verifyToken("USER","AUTHOR","ADMIN"), (req,res) => {
    // console.log(req.user);
    res.status(200).json({
        message:"Authenticated",
        payload: req.user
    })
})

// public: get single article by id (with comments populated)
commonRoute.get("/articles/:id", async (req, res, next) => {
    try {
        let article = await ArticleModel.findOne({ _id: req.params.id, isArticleActive: true })
            .populate("author", "firstName lastName profileImageUrl")
            .populate("comments.user", "firstName lastName profileImageUrl");
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({ message: "Article found", payload: article });
    } catch (err) {
        next(err);
    }
});

// delete a comment (allowed for comment owner OR article author)
commonRoute.delete("/articles/:articleId/comments/:commentId", verifyToken("USER","AUTHOR"), async (req, res, next) => {
    try {
        let { articleId, commentId } = req.params;
        let userId = req.user.userId;

        // find the article
        let article = await ArticleModel.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // find the comment
        let comment = article.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // allow deletion if user is the comment owner OR the article author
        let isCommentOwner = comment.user.toString() === userId;
        let isArticleAuthor = article.author.toString() === userId;

        if (!isCommentOwner && !isArticleAuthor) {
            return res.status(403).json({ message: "You cannot delete this comment" });
        }

        // remove the comment using $pull
        let updatedArticle = await ArticleModel.findByIdAndUpdate(
            articleId,
            { $pull: { comments: { _id: commentId } } },
            { returnDocument: "after" }
        )
        .populate("author", "firstName lastName profileImageUrl")
        .populate("comments.user", "firstName lastName profileImageUrl");

        res.status(200).json({
            message: "Comment deleted",
            payload: updatedArticle
        });
    } catch (err) {
        next(err);
    }
});