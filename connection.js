const mongoose = require("mongoose");

async function ConnectToMongoDb(user){
    return mongoose.connect(user);
}

module.exports = {
    ConnectToMongoDb,
}