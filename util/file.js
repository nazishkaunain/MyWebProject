const fs = require("fs");

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("successfully deleted the image");
        }
    });
};

exports.deleteFile = deleteFile