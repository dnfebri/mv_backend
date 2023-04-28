import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";

import indexRoute from "./routes/index.js";

// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//   db: db
// })

// // ## Generate database tables
import db from "./config/Database.js";
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

app.use(cookieParser());
app.use(cors());
app.use(FileUpload());
app.use(express.json());
app.use(express.static("public"));
app.use(indexRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up port '" + process.env.APP_PORT + "' and running ...");
});
