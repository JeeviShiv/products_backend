const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const path = require('path');
const multer  = require('multer');
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

const categories = asyncHandler(async (req, res)=> {
    var id = req.params.id;
    let options;
    if(id){
        options = {'_id':id}
    }
    const categories = await Category.find(options);
    return res.json(categories)
})

const addCategory = asyncHandler(async (req, res)=>{
    const image = req.file.filename;
    const { name, status } = req.body;
    if(!name || !status || !image){
        return res.json({'error': 'All fields are required'});
    }
    const exists = await Category.findOne({name});
    if(exists){
        return res.json({'error': 'Category name exists'})
    }
    const categoryObject = { name, status, image: req.file.path};
    const category = await Category.create(categoryObject);
    if(category){
        console.log(category);
        return res.json({'success': 'New category added successfully'})
    }
    else{
        return res.json({'error': 'Something went wrong'});
    }
})

const updateCategory = asyncHandler(async (req, res)=>{
    let image;
    if(!req.file){ image = req.body.picture; }else{ image = req.file.path;}

    const { id, name, status } = req.body;
    if(!id || !name || !status || !image){
        return res.json({ error: 'All fields are required'})
    }
    const categoryExists = await Category.find({ name, _id: { $ne: id } });
    if(categoryExists.length){
        return res.json({ error: 'Category already exists!'})
    }
    const categoryObject = {name, status, image}
    const result = await Category.findByIdAndUpdate(id,categoryObject,{new: true});
    if(result){
        return res.json({ success: `${result.name} updated`, data:result})
    }else{
        return res.json({ error: `Something went wrong`})
    }
})

const deleteCategory = asyncHandler(async (req, res)=>{
    const { id } = req.body; 
    if(!id ){
        return res.json({'error': 'ID is required'})
    }
    const results = await Category.deleteOne({ _id: id });
    if(results.deletedCount>0){
        return res.json({'message':'Deleted successfully'})
    }else{
        return res.json({'error':'Something went wrong'})
    }
})

module.exports = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
}