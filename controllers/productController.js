const asyncHandler = require('express-async-handler');
const Product = require('../models/product');

const path = require('path');
const multer  = require('multer');
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
const products = asyncHandler(async (req, res)=>{
    var id = req.params.id;
    let options;
    if(id){
        options = {'_id':id}
        const products = await Product.aggregate([
            { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: id } ] } }},
            { 
              "$lookup": { 
                  "from": 'categories', 
                  "localField": 'category', 
                  "foreignField": '_id', 
                  "as": 'CategoryData' 
              } 
          }
        ]).exec()
        return res.json(products)
    } else {
        const products = await Product.aggregate([
            { 
              "$lookup": { 
                  "from": 'categories', 
                  "localField": 'category', 
                  "foreignField": '_id', 
                  "as": 'CategoryData' 
              } 
          }
        ]).exec()

        return res.json(products)
    }
})

const addProduct = asyncHandler(async (req, res)=>{
    const image = req.file.path;
    const { name, code, category,color,quantity,mrpPrice, salePrice,status} = req.body;
    if(!name || !code || !category || !image || !color || !quantity || !mrpPrice || !salePrice || !status){
        return res.json({'error': 'All fields are required'});
    }
    const exists = await Product.findOne({code});
    if(exists){
        return res.json({'error': 'Product code exists'})
    }
    const productObject = { name, code, category,image,color,quantity,mrpPrice, salePrice,status};
    const product = await Product.create(productObject);
    if(product){
        return res.json({'success': `New ${product.name} added successfully`})
    }
    else{
        return res.json({'error': 'Something went wrong'});
    }
})

const updateProduct = asyncHandler(async (req, res)=>{
    let image;
    if(!req.file){ image = req.body.picture; }else{ image = req.file.path;}
    const { id, name, code, category,color,quantity,mrpPrice, salePrice,status } = req.body;
    if(!id || !name || !code || !category || !image || !color || !quantity || !mrpPrice || !salePrice || !status){
        return res.json({ error: 'All fields are required'})
    }
    const productExists = await Product.find({ code, _id: { $ne: id } });
    if(productExists.length){
        return res.json({ error: 'Product code already exists!'})
    }
    const productObject = {id, name, code, category,image,color,quantity,mrpPrice, salePrice,status}
    const result = await Product.findByIdAndUpdate(id,productObject,{new: true});
    if(result){
        return res.json({ success: `${result.name} updated`})
    }else{
        return res.json({ error: `Something went wrong`})
    }
})

const deleteProduct = asyncHandler(async (req, res)=>{
    const { id } = req.body; 
    if(!id ){
        return res.json({'error': 'ID is required'})
    }
    const results = await Product.deleteOne({ _id: id });
    if(results.deletedCount>0){
        return res.json({'message':'Product Deleted successfully'})
    }else{
        return res.json({'error':'Something went wrong'})
    }
})

module.exports = {
    products,
    addProduct,
    updateProduct,
    deleteProduct
}