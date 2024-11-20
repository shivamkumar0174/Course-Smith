const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../Model/user");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const  bcrypt = require("bcrypt");
const { z } = require("zod");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function(req, res){
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

    const { firstName, email, password} = req.body;
    try{ 
        const hashedpassword = await  bcrypt.hash(password,5);
        await adminModelModel.create({
        firstName,
        email:email,
        password:hashedpassword,
    });
    }catch(e){
        res.json({
            msg: "Admin is already exists"
        })
        errorThrow = true;
    }

    return res.json({
        mesg: "Admin signup"
    }) ;
})

adminRouter.post("/signin", async function(req, res){
    const { email, password} = req.body;
    const Admin = await adminModel.findOne( { email, password });
    if(Admin){
          const token = jwt.sign({
            id: Admin._id
           },JWT_ADMIN_PASSWORD)
           res.status(200).json({
            token,
           });
    }
    else{
        res.status(404).json({
            msg: "check your information",
        })
    }
})

adminRouter.post("/createCourse", adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;
     const course = await courseModel.create({
        title,
        description,
        price,
        imageUrl: imageUrl,
        creatorId: adminId
    })
    
    res.json({
        msg: " Succesfully Course is Created",
        courseId: course._id,
    })
})

adminRouter.put("/edit",adminMiddleware, async function(req, res){
    const { title, description, price, imageUrl, creatorId } = req.body;
    const courseId = req.body;
    const adminId = req.userId;
    const course = await courseModel.updateOne({
        _id : courseId,
        creatorId: adminId,
    }, {
        title,
        description,
        price,
        imageUrl,
   });

    if (!course) {
        return res.status(404).json('Course not found');
      }
  
    res.json({
        msg: "Succesfully edit your course",
    })
})

adminRouter.get("/allCourses",adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const allCourses = await courseModel.find({
        creatorId: adminId,
    });

    res.json({
        msg: "All Created Courses",
        allCourses
    })  
});

module.exports = {
    adminRouter,
}