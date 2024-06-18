const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const categoryController = require('../controllers/categoryController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/categories')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({storage: storage})

router.route('/')
    .get(categoryController.categories)
    .post(upload.single('picture'), categoryController.addCategory)
    .patch(upload.single('picture'),categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

router.route('/:id')
    .get(categoryController.categories)

module.exports = router;