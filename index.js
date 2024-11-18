const express = require("express");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const { ConnectToMongoDb } = require("./connection");

const app = express();
const port = 3000;

ConnectToMongoDb("mongodb://localhost:27017/Course_Smith")
.then( ()=> console.log("MongoDb Connected"));

//Middlewares
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

app.listen(port,console.log(`Server Stated at port ${port}`));