const { Router } = require("express");

const userRouter = Router();
const { userModel, purchaseModel } = require("../Model/user");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const  bcrypt = require("bcrypt");
const { z } = require("zod");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function (req, res) {
    const requiredBody = z.object({
        firstName:z.string().min(3).max(100),
        email:z.string().min(3).max(30).email(),
        password:z.string().min(6).refine((password)=>/[A-Z]/.test(password),
        {msg: "Required atleast one Uppercase character"}).refine((password)=>
            /[a-z]/.test(password),{msg:"Required atleast one lowetcase character"})
        .refine((password)=>/[0-9]/.test(password),{msg:"Required atleast one number"})
        .refine((password)=>/[!@#$%^&*]/.test(password),{msg:"Required atleast one special character"}),
    })
    // const parseData = requiredBody.parse(req.body);
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            mes: "Incorrect Formate",
            err: parsedDataWithSuccess.error 
        })
        return
    }

    const { firstName, email, password } = req.body;
    try{ 
        const hashedpassword = await  bcrypt.hash(password,5);
        await userModel.create({
        firstName,
        email:email,
        password:hashedpassword,
    });
    }catch(e){
        res.json({
            msg: "User is already exists"
        })
        errorThrow = true;
    }
   
        return res.status(200).json({
            msg: "user signup",
        });
                                                                     
});

userRouter.post("/signin",async function (req, res) {
    const {  email, password } = req.body;

    const User = await userModel.findOne({ email });

    if(!User){
        res.status(403).json({
            msg:"User is not find in our DB"
        })
        return
    }
   
    const passwordMatch = await bcrypt.compare(password, User.password);
    
   if(passwordMatch){
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