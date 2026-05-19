import { UserModel } from "../models/UserModel.js"


export const validUSer = async(req,res,next)=>{
    // take the user details
    // the user can try login or register
    // so we need to get the id of the user and then we can check
    let uid = req.params?.uid 
    if(!uid){
        return res.status.json({
            message:"user id is undefined"
        })
    }
    let user = await UserModel.findOne({_id:uid,role:"USER"});
    if(!user){
        return res.status(404).json({
            message:"No Access"
        })
    }
    next();
}