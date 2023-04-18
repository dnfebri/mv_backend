import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Post from "./PostModel.js";

const { DataTypes } = Sequelize;

const UserLikePost = db.define('user_like_post', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  like: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true
});

Users.hasMany(UserLikePost);
Post.hasMany(UserLikePost);
UserLikePost.belongsTo(Users, {foreignKey: 'userId'});
UserLikePost.belongsTo(Post, {foreignKey: 'postId'});

export default UserLikePost;