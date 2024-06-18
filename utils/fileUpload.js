const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/cate')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var uploadProfileImgs = multer({storage:storage}).single('picture');

module.exports = {
    uploadProfileImgs
}
