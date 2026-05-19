import { UserModel } from "../models/UserModel.js";


export const validAuthor = async(req,res,next) => {
    // get author id
    let authorId = req.body?.author || req.params?.authorid;
    // verify the author
    let isMatchUser = await UserModel.findById(authorId);
    // if author not found
    if(!isMatchUser){
        return res.status(404).json({message:"author is not valid"})
    }
    // if author founcd but role is differnt 
    if(isMatchUser.role != "AUTHOR"){
        return res.status(403).json({message:"User is not Author"})
    }
    // if author is there but blocked
    if(!isMatchUser.isActive){
        return res.status(403).json({message:"Author account is not active contact Admin!"})
    }
    // give to the next middleware
    next();
}