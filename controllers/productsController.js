const { model } = require("mongoose")
const Product = require("../models/Products")


module.exports ={
    createProduct : async(req,res) =>{
        const newProduct = new Product(req.body);
        try {
            await newProduct.save();
            res.status(200).json("product create successfully")
        } catch (error) {
            res.status(500).json("fail to create the product")
        }
    },
    getAllProduct: async(req,res)=>{
        try {
            const products = await Product.find().sort({createAt:-1})
            res.status(200).json(products)
        } catch (error) {
            res.status(500).json("fail to get the products")
        }
    },
    getProductById: async(req,res)=>{
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json("fail to get the product")
        }
    },
    searchProduct: async (req,res)=>{
        try {
            const result = await Product.aggregate(
                [
                    {
                      $search: {
                        index: "watch",
                        text: {
                          query: req.params.key,
                          path: {
                            // search tất cả loại
                            wildcard: "*" 
                          }
                        }
                      }
                    }
                  ]
            )
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json("fail to search the product")
        }
    },
    deleteProduct: async (req, res) => {
        try {
          const product = await Product.findById(req.params.id)
      
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
      
          await Product.findByIdAndDelete(req.params.id);
      
          res.status(200).json({ message: "Product removed" });
        } catch (error) {
          res.status(500).json({ message: "Error deleting product", error: error.message });
        }
      }

}
