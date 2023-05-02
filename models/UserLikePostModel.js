var { Sequelize } = require("sequelize");
var db = require("../config/Database.js");
var Users = require("./UserModel.js");
var Post = require("./PostModel.js");

const { DataTypes } = Sequelize;

const UserLikePost = db.define(
  "user_like_post",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(UserLikePost);
Post.hasMany(UserLikePost);
UserLikePost.belongsTo(Users, { foreignKey: "userId" });
UserLikePost.belongsTo(Post, { foreignKey: "postId" });

module.exports = UserLikePost;
