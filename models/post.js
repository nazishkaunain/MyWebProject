const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    document: {
        type: String
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            comment: {
                type: String
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);