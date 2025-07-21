const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }

});

// ✅ Correct usage: apply plugin to userSchema
userSchema.plugin(passportLocalMongoose);

// ✅ Export the model
module.exports = mongoose.model("User", userSchema);
