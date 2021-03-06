const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    //_id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    //the array of the courses offered by the instructor
    courses: [
        {
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: true
        }
    ],
    //general opinion formed by the past students who enrolled for any of his courses
    opinions: [
        {
            opinion: {
                type: String,
            },
            admin: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }   
    ]
});

module.exports = mongoose.model("Instructor", instructorSchema);