import { Op } from "sequelize";
import { responseJson } from "../helper/Respont.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { uploadImage } from "../helper/UploadImage.js";

export const getUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
  const {name, username, email } = req.body;
  const user = await User.findOne({
    attributes:[
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
  if (user.email !== email) {
    const emailUser = await User.findOne({
      where: {
        email: email
      }
    });
    if(emailUser) return res.status(404).json(
      responseJson(
        false, "Email already exists"
      )
    );
  }
  const uploadPhoto = uploadImage(req.files, username);
  if (!uploadPhoto.status) return res.status(422).json(responseJson(uploadPhoto.status, uploadPhoto.message))
  try {
    await User.update({
      name: name,
      username: username,
      email: email,
      photo: uploadPhoto.name
    }, {
      where: {
        uuid: req.uuid
      }
    });
    res.status(200).json(
      responseJson(
        true, "Successfully Change Password", user
      )
    );
  } catch (error) {
    res.status(500).json(
      responseJson(
        false, error
      )
    );
  }
}

export const changePassword = async (req, res) => {
  const {oldPassword, newPassword, confrimNewPassword } = req.body;
  const user = await User.findOne({
    where: {
      uuid: req.uuid
    }
  });
  const match = bcrypt.compareSync(oldPassword, user.password);
  if(!match) return res.status(400).json(responseJson(
    false, "Wrong Password!"
  ));
  if(newPassword !== confrimNewPassword) return res.status(400).json(responseJson(
    false, "Password confirmation does not match!"
  ));
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(newPassword, salt);
  try {
    await User.update({
      password: hashPassword
    }, {
      where: {
        uuid: req.uuid
      }
    });
    res.status(200).json(
      responseJson(
        true, "Successfully Change Password"
      )
    );
  } catch (error) {
    res.status(500).json(
      responseJson(
        false, error
      )
    );
  }
}
