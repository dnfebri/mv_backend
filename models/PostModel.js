import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Post = db.define('posts', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  freezeTableName: true
});

Users.hasMany(Post);
Post.belongsTo(Users, {foreignKey: 'userId'});

export default Post;