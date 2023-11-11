import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        // file.originalname
        cb(null, file.originalname + '-' + Date.now().toFixed(3))
    }
});

export const upload = multer({ storage })