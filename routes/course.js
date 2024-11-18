const { Router } = require("express");
const courseRouter = Router();
const { courseModel } = require("../Model/user");

courseRouter.get("/preview", async function (req, res) {
    const courses = await courseModel.findAll({});

    res.json({
        courses
    })
});

module.exports = {
    courseRouter,
}