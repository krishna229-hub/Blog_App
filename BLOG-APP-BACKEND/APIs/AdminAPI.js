import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { UserModel } from '../Models/UserModel.js';
import { validateAdmin } from '../middlewares/validAdmin.js';

export const adminRoute = express.Router()

// authenticate admin  --> this will also be in common
// adminRoute.post('/login',async(req,res)=>{
//     let {email,password} = req.body;
//     let findAdmin = await UserModel.findOne({email:email});
//     if(!findAdmin){
//         res.status(403).json({message:"Invalid admin"})
//     }
//     if(findAdmin.password !== password){
//         res.status(403).json({message:"Invalid admin password"})
//     }
//     res.status(200).json({message:"Admin loggedin"})
// })
// read all articles
adminRoute.get("/articles",verifyToken("ADMIN"),async(req,res)=>{
    // reading all the articles available
    let allArticles = await ArticleModel.find();

    res.status(200).json({message:"all articles",payload:allArticles});
})
// block user
adminRoute.put("/block/:uid",verifyToken("ADMIN"),async(req,res)=>{
    let uid = req.params.uid; // getting the uid from the params which user has to be blocked
    // find the user if it exists 
    let user = await UserModel.findOne({uid});
    if(user === undefined){
        res.status(404).json({message:"user not existing"});
    }
    // updating the user
    let blockedUSer = await UserModel.findOneAndUpdate(
        {_id:uid},
        {$set:{isActive:false}},
        {new:true}
    )

    res.status(200).json({message:"user blocked",payload:blockedUSer})
})

//  unblock user roles
adminRoute.put("/unblock/:uid",verifyToken("ADMIN"),async(req,res)=>{
    let uid = req.params.uid; // getting the uid from the params which user has to be blocked
    // find the user if it exists 
    let user = await UserModel.findOne({uid});
    if(user === undefined){
        res.status(404).json({message:"user not existing"});
    }
    // updating the user
    let blockedUSer = await UserModel.findOneAndUpdate(
        {_id:uid},
        {$set:{isActive:true}},
        {new:true}
    )

    res.status(200).json({message:"user Unblocked",payload:blockedUSer})
})