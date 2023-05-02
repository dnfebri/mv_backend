var { Sequelize } = require("sequelize");
var db = require("../config/Database.js");
var Users = require("./UserModel.js");

const { DataTypes } = Sequelize;

const Post = db.define(
  "posts",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Post);
Post.belongsTo(Users, { foreignKey: "userId" });

module.exports = Post;
