const mongoose = require('mongoose');
const Category = require('../models/category');
const { Schema } = mongoose;
const productSchema = new Schema({
    name:String,
    code:String,
    category:{type: Schema.Types.ObjectId, ref: "category"},
    image:{type:String, default:null},
    color:String,
    quantity:String,
    mrpPrice:String,
    salePrice:String, 
    status:String,
},{
    timestamps: true
})
module.exports = mongoose.model('products', productSchema)