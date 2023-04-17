import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { responseJson } from "../helper/Respont.js";
import { Op } from "sequelize";

export const Login = async(req, res) => {
  const {username, email, password } = req.body;
  if (!username && !email) { 
    return res.status(400).json(responseJson(
      false, 
      "Body Content {username, Email, password}"
    )) 
  };
  const reqAuth = email ?? username;
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: reqAuth }, { email: reqAuth }]
      }
    });
    if (!user) return res.status(400).json(
      responseJson(
        false, "User Not Found"
      )
    );
    const match = bcrypt.compareSync(password, user.password);
    if(!match) return res.status(400).json(responseJson(
      false, "Wrong Password!"
    ));
    const token = jwt.sign(
      {
        id: user.id, 
        uuid: user.uuid, 
        name: user.name, 
        username: user.username, 
        email: user.email
      }, 
      process.env.TOKEN_SECRET, 
      { expiresIn: 60 * 60 * 8 } // expired Token
    );
    return res.status(200).json(
      responseJson(
        true, "Successfuly Login", {token}
      )
    );
  } catch (error) {
    
  }
}

export const Register = async(req, res) => {
  const {name, username, email, password, confPassword, photo} = req.body;
  if (!name || !username || !email || !password || !confPassword) { 
    return res.status(400).json(responseJson(
      false, 
      "Body Content {name, email, password, confPassword}"
    )) 
  };
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: username }]
    }
  });
  if (user) return res.status(401).json(
    responseJson(
      false, "Username or Email is Already Registered"
    )
  );
  if (password !== confPassword) return res.status(401).json(
    responseJson(
      false, "Password dan confirm password tidak cocok"
    )
  );
  try {
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(password, salt);
    const userCreate = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashPassword,
      photo: photo ?? "https://picsum.photos/200",
    });
    res.status(201).json(responseJson(true, "Register Success", userCreate));
  } catch (error) {
    res.status(400).json(responseJson(false, error.massage));
  }
}

export const Me = async(req, res) => {
  if (!req.uuid) { //wrong UUID
    return res.status(401).json(
      responseJson(
        false, "wrong UUID"
      )
    );
  }
  const user = await User.findOne({
    attributes:[
      'uuid', 
      'name', 
      'username', 
      'email', 
      'photo', 
      'createdAt', 
      'updatedAt'
    ],
    where: {
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json(
    responseJson(
      false, "User Not Found"
    )
  );
  return res.status(200).json(
    responseJson(true, "Successfully Get User", user)
  );
}

export const logOut = async(req, res) => {
  res.status(200).json(responseJson(true, "Logout Success"));
}