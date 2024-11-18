const  mongoose  = require("mongoose");

// mongoose.connectMongoDb("mongodb://127.0.0.1:27017//Course_Smith");
// console.log("MongoDb Connected");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        requred: true,
        unique: true,
    },
})

const adminSchema = new  Schema({
    firstName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        requred: true,
        unique: true,
    },
    
});

const courseSchema = new  Schema({
    title : {
        type: String,
        required: true,

    },
    description : {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        requred: true,
    },
    imageUrl : {
        type: String,
    },
    creatorId : ObjectId,
});

const purchaseSchema = new Schema({
    courseId:ObjectId,
    userId: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
}



