const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  history: [
    {
      courseCode: {
        type: String,
        required: true
      },
      instructor: {
        {
          name: {
            type: String,
            required: true
          }
        }
      }
    }
  ]
})
