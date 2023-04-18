import { Op } from "sequelize";
import { responseJson } from "../helper/Respont.js";
import UserLikePost from "../models/UserLikePostModel.js";
import Post from "../models/PostModel.js";
import { uploadPost } from "../helper/UploadImage.js";
import Users from "../models/UserModel.js";
import fs from "fs"

export const like = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id
    }
  });
  if(!post) return res.status(404).json(
    responseJson(
      false, "Post Not Found"
    )
  );
  const userLike = await UserLikePost.findOne({
    where: {
      [Op.and]: {
        userId: req.userId,
        postId: post.id
      }
    }
  });
  if (userLike && userLike.like === 1) return res.status(400).json(responseJson(false, 'Fail Like'));
  try {
    await Post.update({
      likes: post.likes+1
    }, {
      where: {
        id: post.id
      }
    });
    if (userLike) {
      await UserLikePost.update({
        like: 1
      }, {
        where: {
          id: userLike.id
        }
      });
    } else {
      await UserLikePost.create({
        userId: req.userId,
        postId: post.id,
        like: 1
      })
    }
    res.status(200).json(
      responseJson(
        true, "Successfully Like Post"
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

export const unLike = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id
    }
  });
  if(!post) return res.status(404).json(
    responseJson(
      false, "Post Not Found"
    )
  );
  const userLike = await UserLikePost.findOne({
    where: {
      [Op.and]: {
        userId: req.userId,
        postId: post.id
      }
    }
  });
  if (userLike && userLike.like === 0) return res.status(400).json(responseJson(false, 'Fail UnLike'));
  try {
    await Post.update({
      likes: post.likes-1
    }, {
      where: {
        id: post.id
      }
    });
    if (userLike) {
      await UserLikePost.update({
        like: 0
      }, {
        where: {
          id: userLike.id
        }
      });
    } else {
      await UserLikePost.create({
        userId: req.userId,
        postId: post.id,
        like: 0
      })
    }
    res.status(200).json(
      responseJson(
        true, "Successfully Unlike Post"
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