var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var FileUpload = require("express-fileupload");
var bodyParser = require("body-parser");

var indexRoute = require("./routes/index.js");

// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//   db: db
// })

// // ## Generate database tables
var db = require("./config/Database.js");
const runDb = async () => {
  try {
    await db.authenticate();
    console.log("databases Connected...");
    await db.sync();
    // store.sync();
  } catch (error) {
    console.error(error.parent);
  }
};
runDb();

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(FileUpload());
app.use(express.json());
app.use(express.static("public"));
app.use(indexRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up port '" + process.env.APP_PORT + "' and running ...");
});
