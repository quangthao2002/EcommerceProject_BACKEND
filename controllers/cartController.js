const Product = require("../models/Products");
const Card = require("../models/Cart");

module.exports = {
    addToCard: async (req, res) => {
    const { userId, cardItem, quantity } = req.body;
    try {
      const card = await Card.findOne({ userId });
      if (card) {
        const existingProduct = card.products.find(
          (product) => product.cardItem.toString() === cardItem
        );
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          card.products.push({ cardItem, quantity });
        }
        await card.save();
        res.status(200).json("Product add to card");
      } else {
        const newCard =  new Card({
          userId,
          products: [{ cardItem, quantity: quantity }],
        });
        await newCard.save();
        res.status(200).json("Product add to card");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCard: async (req, res) => {
    const userId =req.params.id;
    try {
        const  card  = await Card.find({userId})
        .populate('products.cardItem',"_id name supplier price imageUrl")
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({measage:error});
    }
  },
  deleteCardItem: async (req, res) => {
        const cardItemId= req.params.cardItemId
    try {
        const  updateCard = await Card.findOneAndUpdate(
            {'products._id':cardItemId},
            {$pull:{products:{_id:cardItemId}}},
            {new:true}
        )
        if(!updateCard){
            return res.status(404).json("Card item not found")
        }
        res.status(200).json(updateCard);
    } catch (error) {
        res.status(500).json(error);
    }
  },
  decrementCardItem: async (req, res) => {
    const { userId, cardItem } = req.body;
    try {
        const card = await Card.findOne({userId});
        if(!card){
            return res.status(401).json("Card not found")
        }
        const existingProduct = card.products.find(
            (product) => product.cardItem.toString() === cardItem
          );
         
          if(!existingProduct){
                return res.status(404).json("Product not found in card")
          }
          if(existingProduct.quantity ===1){
            card.products = card.products.filter(
                (product) => product.cardItem.toString() !== cardItem
            )
          }else{
            existingProduct.quantity -= 1;
          }

            await card.save();

            if(existingProduct.quantity===0){
                await Card.updateOne(
                    {userId},
                    {$pull:{products:{cardItem:cardItem}}},
                )
            }
            res.status(200).json("Product decrement");

    } catch (error) {
        res.status(500).json(error);
    }
  },
};
