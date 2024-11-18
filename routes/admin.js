const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../Model/user");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function(req, res){
    const { firstName, email, password} = req.body;
    await adminModel.create ({
        firstName,
        email,
        password,
    });
    return res.json({
        mesg: "Admin signup"
    }) ;
})

adminRouter.post("/signin", async function(req, res){
    const { email, password} = req.body;
    const Admin = await adminModel.findOne( { email, password });
   //todos: ideally password should be hashed and hence you can't
    // compare the user provided password and the database password
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