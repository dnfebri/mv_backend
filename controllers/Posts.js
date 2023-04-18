import { Op } from "sequelize";
import { responseJson } from "../helper/Respont.js";
import Post from "../models/PostModel.js";
import { uploadPost } from "../helper/UploadImage.js";
import Users from "../models/UserModel.js";
import fs from "fs"

// export const Post = async (req, res) => {
// }
export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.findAll();
    res.status(200).json(
      responseJson(
        true, "Successfully Show all post", allPost
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

export const createPost = async (req, res) => {
  const {tags, caption} = req.body;
  if (!tags || !caption) { 
    return res.status(400).json(responseJson(
      false, 
      "Body Content {caption, tags}"
    )) 
  };
  const uploadImage = uploadPost(req.files, caption.replaceAll(' ', '_'));
  if (!uploadImage.status) return res.status(422).json(responseJson(uploadImage.status, uploadImage.message))
  try {
    const postCreate = await Post.create({
      userId: req.userId,
      caption: caption,
      tags: tags.toLowerCase(),
      image: uploadImage.name
    });
    const post = await Post.findOne({
      attributes: [
        'image', 'caption', 'tags', 'likes', 'createdAt', 'updatedAt'
      ],
      include: ({
        model: Users,
        attributes: [
          'name', 'username', 'email', 'photo'
        ]
      }),
      where: {
        id: postCreate.id
      }
    });
    res.status(200).json(
      responseJson(
        true, "Successfully create post", post
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

export const updatePost = async (req, res) => {
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
  const {tags, caption} = req.body;
  if (!tags || !caption) { 
    return res.status(400).json(responseJson(
      false, 
      "Body Content {caption, tags}"
    )) 
  };
  let image = post.image
  if (req.files) {
    const uploadImage = uploadPost(req.files, caption.replaceAll(' ', '_'));
    if (!uploadImage.status) return res.status(422).json(responseJson(uploadImage.status, uploadImage.message));
    image = uploadImage.name;
  }
  try {
    await Post.update({
      caption: caption,
      tags: tags.toLowerCase(),
      image: image
    }, {
      where: {
        id: post.id
      }
    });
    const postFind = await Post.findOne({
      attributes: [
        'image', 'caption', 'tags', 'likes', 'createdAt', 'updatedAt'
      ],
      include: ({
        model: Users,
        attributes: [
          'name', 'username', 'email', 'photo'
        ]
      }),
      where: {
        id: post.id
      }
    });
    res.status(200).json(
      responseJson(
        true, "Successfully Update Post", postFind
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

export const deletePost = async (req, res) => {
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
  try {
    const imagePath = `./public${post.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await Post.destroy({
      where: {
        id: post.id
      }
    })
    res.status(200).json(
      responseJson(
        true, "Successfully Delete Post"
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