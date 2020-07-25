const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  //_id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  //current code for the course
  courseCode: {
    type: String,
    required: true
  },
  //name of the current instructor
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: true
  },
  //history of this course like the name of the instructor, the cousrse-code and the year when it was taught
  history: [
    {
      year: {
        type: Number,
        //required: true
      },
      courseCode: {
        type: String,
        //required: true
      },
      instructor: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        //required: true
      }
    }
  ],
  //the array of users who enrolled for this course
  users: [
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        //required: true
    }
  ]
});

module.exports = mongoose.model("Course", courseSchema);
