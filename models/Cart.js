const mongoose = require("mongoose") 

const CardSchema = new mongoose.Schema({
    userId: { type: String, require: true },
   products:[
        {
            cardItem:{
                type:mongoose.Schema.ObjectId,
                ref:"Product"
            },
            quantity:{type:Number,default:1},
        }
   ]
},{timestamps:true})
module.exports=mongoose.model('Cart',CardSchema)