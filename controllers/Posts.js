import { Op } from "sequelize";
import { responseJson } from "../helper/Respont.js";
import Post from "../models/PostModel.js";
import { uploadPost } from "../helper/UploadImage.js";
import Users from "../models/UserModel.js";
import fs from "fs";

export const getAllPost = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = limit * page;
  const totalRows = await Post.count({
    where: {
      [Op.or]: [
        {
          caption: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          tags: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  try {
    const result = await Post.findAll({
      where: {
        [Op.or]: [
          {
            caption: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            tags: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: {
        model: Users,
        attributes: ["name", "username", "email", "photo"],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    res.status(200).json(
      responseJson(true, "Successfully Get post", {
        result,
        pagination: {
          total: totalRows,
          page: page,
          pages: totalPage,
          limit: limit,
        },
      })
    );
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};

export const getPostId = async (req, res) => {
  try {
    const post = await Post.findOne({
      attributes: [
        "id",
        "image",
        "caption",
        "tags",
        "likes",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: Users,
        attributes: ["name", "username", "email", "photo"],
      },
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(responseJson(true, "Successfully Update Post", post));
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};

export const getPostByUserId = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json(responseJson(false, "User Not Found"));
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = limit * page;
  const totalRows = await Post.count({
    where: {
      [Op.or]: [
        {
          caption: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          tags: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
      userId: req.params.id,
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  try {
    const result = await Post.findAll({
      where: {
        [Op.or]: [
          {
            caption: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            tags: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        userId: req.params.id,
      },
      include: {
        model: Users,
        attributes: ["name", "username", "email", "photo"],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    res.status(200).json(
      responseJson(true, "Successfully Get post", {
        result,
        pagination: {
          total: totalRows,
          page: page,
          pages: totalPage,
          limit: limit,
        },
      })
    );
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};

export const createPost = async (req, res) => {
  const { tags, caption } = req.body;
  if (!tags || !caption) {
    return res
      .status(400)
      .json(responseJson(false, "Body Content {caption, tags}"));
  }
  const uploadImage = uploadPost(req.files, caption.replaceAll(" ", "_"));
  if (!uploadImage.status)
    return res
      .status(422)
      .json(responseJson(uploadImage.status, uploadImage.message));
  try {
    const postCreate = await Post.create({
      userId: req.userId,
      caption: caption,
      tags: tags.toLowerCase(),
      image: `${req.protocol}://${req.get("host") + uploadImage.name}`,
    });
    const post = await Post.findOne({
      attributes: [
        "image",
        "caption",
        "tags",
        "likes",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: Users,
        attributes: ["name", "username", "email", "photo"],
      },
      where: {
        id: postCreate.id,
      },
    });
    res.status(200).json(responseJson(true, "Successfully create post", post));
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};

export const updatePost = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!post) return res.status(404).json(responseJson(false, "Post Not Found"));
  const { tags, caption } = req.body;
  if (!tags || !caption) {
    return res
      .status(400)
      .json(responseJson(false, "Body Content {caption, tags}"));
  }
  let image = post.image;
  if (req.files) {
    const uploadImage = uploadPost(req.files, caption.replaceAll(" ", "_"));
    if (!uploadImage.status)
      return res
        .status(422)
        .json(responseJson(uploadImage.status, uploadImage.message));
    image = `${req.protocol}://${req.get("host") + uploadImage.name}`;
  }
  try {
    await Post.update(
      {
        caption: caption,
        tags: tags.toLowerCase(),
        image: image,
      },
      {
        where: {
          id: post.id,
        },
      }
    );
    const postFind = await Post.findOne({
      attributes: [
        "image",
        "caption",
        "tags",
        "likes",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: Users,
        attributes: ["name", "username", "email", "photo"],
      },
      where: {
        id: post.id,
      },
    });
    res
      .status(200)
      .json(responseJson(true, "Successfully Update Post", postFind));
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};

export const deletePost = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!post) return res.status(404).json(responseJson(false, "Post Not Found"));
  try {
    const imagePath = `./public${post.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await Post.destroy({
      where: {
        id: post.id,
      },
    });
    res.status(200).json(responseJson(true, "Successfully Delete Post"));
  } catch (error) {
    res.status(500).json(responseJson(false, error));
  }
};
