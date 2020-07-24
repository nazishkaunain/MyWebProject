const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
      type: String
    },
    resetTokenExpiration: {
      type: String
    },
    profilePhoto: {
      type: String
    },
    birthday: {    ///m.date = Date('2013-12-31');
        type: Date,
        max: Date('2014-01-01')
    },
    degree: {
        type: String
    },
    gender: {
        type: String
        //required: true
    },
    department: {
        type: String
        //required: true
    },
    yearOfGraduation: {
        type: Number
        //required: true
    },
    //the courses enrolled in by the user
    courses: [
        {
            course: {
                type: Schema.Types.ObjectId,
                ref: "Course",
                //required: true
            }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
