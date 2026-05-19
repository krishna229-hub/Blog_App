import {UserModel} from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import {hash,compare} from "bcryptjs"


export const register = async(userObj) => {
    // creating the document from this object
    let userDoc = new UserModel(userObj);
    await userDoc.validate();
    // hash the password
    userDoc.password = await hash(userDoc.password,12);
    // saving it 
    let createdDoc = await userDoc.save();
    // convert it to object
    let createdObj = createdDoc.toObject();
    // remove the password
    delete createdObj.password;

    return createdObj;
}

// login the user it can be author,admin or user
export const login = async(email,password) => {
    // check if there exist a user with the given mail or not
    let user = await UserModel.findOne({
        email:email
    })
    // console.log(user)
    if(!user){
        let err = new Error("Invalid Email!");
        err.status = 401;
        throw err;
    }
    // console.log(user)
    // we are here that means there exist a user with that mail 
    // now match the password
    // console.log(password)
    // console.log(user.password)
    let isMAtch = await compare(password,user.password);
    if(!isMAtch){
        let err = new Error("Invalid Password!")
        err.status=401;
        throw err;
    }
    // now there is user and password is also correct but 
    // we need to check if the user is blocked or not 
    if(user.isActive === false){
        let err = new Error("your account has been bloacked please contact Admin!")
        err.status = 403;
        throw err;
    }

    // generate a token
    let signedToken = jwt.sign({email:user.email,firstName:user.firstName,role:user.role,userId:user._id,profileImageUrl:user.profileImageUrl},process.env.JWT_SECRET,{expiresIn:"1h"})

    let userObj = user.toObject();
    delete userObj.password;
    return {token:signedToken,user:userObj};

}