import jwt from "jsonwebtoken";
import { UserModel } from "../Models/UserModel.js";

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // read the token
      let token = req.cookies?.token;
      if (!token) {
        return res.status(400).json({
          message: "Unauthorized req, please login",
        });
      }
      // decode the token
      let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // check if the role is allowed or not
      if (!allowedRoles.includes(decodedToken.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden. you don't have access" });
      }

      // console.log(decodedToken)
      // let user = await UserModel.findById(decodedToken.userId)

      // if(!user){
      //     return res.status(401).json({
      //         message:"user no longer exists!"
      //     });
      // }

      req.user = decodedToken;

      next();
    } catch (err) {
      // jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token. Please login again" });
      }
    }
  };
};