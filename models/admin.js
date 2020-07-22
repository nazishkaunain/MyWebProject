const mongoose = require("mongoose");
const { model } = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Admin", adminSchema);