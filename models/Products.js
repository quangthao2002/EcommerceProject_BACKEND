const mongoose = require("mongoose") 

const ProductSchema = new mongoose.Schema({
    name: {type:String, require: true},
    supplier: {type:String, require: true},
    price: {type:String, require: true},
    imageUrl:{type:String,require:true},
    description: {type:String, require: true},
    product_location:{type:String,require:true}
},{timestamps:true})
module.exports=mongoose.model('Product',ProductSchema)