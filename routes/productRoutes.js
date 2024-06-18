const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/products')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({storage: storage})
router.route('/')
    .get(productController.products)
    .post(upload.single('picture'),productController.addProduct)
    .patch(upload.single('picture'),productController.updateProduct)
    .delete(productController.deleteProduct)

router.route('/:id')
    .get(productController.products)

module.exports = router;