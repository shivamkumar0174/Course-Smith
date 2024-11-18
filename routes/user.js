const { Router } = require("express");

const userRouter = Router();
const { userModel, purchaseModel } = require("../Model/user");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function (req, res) {
    const { firstName, email, password } = req.body;

    await userModel.create({
        firstName,
        email,
        password,
    });
    return res.status(200).json({
        msg: "user signup",
    });
});

userRouter.post("/signin",async function (req, res) {
    const {  email, password } = req.body;

    //todos: ideally password should be hashed and hence you can't
    // compare the user provided password and the database password 
    const User = await userModel.findOne({ email, password });
    if(User){
       const token =  jwt.sign({
            id: User._id
        },JWT_USER_PASSWORD);
        res.status(202).json({
            token,
        });
    }
    else{
        res.status(404).json({
            msg: "check your information"
        })
    }
});

userRouter.post("/purchase",userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    const purchases = await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        msg: "You have Successfully bought the course",
        purchases
    })
});

userRouter.get("/purchases",userMiddleware, async function(req, res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    })

    res.json({
        purchases
    })
})
module.exports = {
    userRouter,
}