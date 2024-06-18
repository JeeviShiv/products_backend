const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name:String,
    status:String,
    image:{type:String, default:null},
  })
module.exports = mongoose.model('Category',categorySchema);