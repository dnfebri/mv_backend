import jwt from "jsonwebtoken";
import { responseJson } from "../helper/Respont.js";

export const verifyToken = (req, res, next) => {
  if (!req.header("authorization"))
    return res
      .status(401)
      .json(responseJson(false, "'Authorization Bearer' Token not detected"));
  const token = req.header("authorization").split(" ")[1];
  if (!token)
    return res.status(401).json(responseJson(false, "Token not detected"));
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json(responseJson(false, err.message));
    req.userId = decoded.id;
    req.uuid = decoded.uuid;
    next();
  });
};

// export const verifySession = (req, res, next) => {
//   const token = req.headers.token;
//   // const token = req.cookies.token;
//   if(!token) return res.status(401).json({msg: "Mohon Login ke akun anda!"});
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//     if(err) return res.status(403).json({msg: err.message});
//     req.uuid = decoded.uuid;
//     req.token = token;
//     next();
//   })
// }
