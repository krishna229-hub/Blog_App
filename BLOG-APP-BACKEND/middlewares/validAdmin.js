import { UserModel } from "../Models/UserModel.js"

export const validateAdmin = async(req,res,next) => {
    let aid = req.params?.aid || req.body?.aid;
    // let uid = req.params?.uid || req.body?.uid;
    // console.log(aid);
    // validate the admin if it exist or not
    let adminDB = await UserModel.findOne({_id:aid, role:"ADMIN"});
    // if admin not exist then it's invalid admin trying to do something
    if(!adminDB){
        return res.status(401).json({message:"you are not an admin"})
    }
    // console.log(adminDB)
    // if valid admin then it can change that 
    // so next
    next();

}