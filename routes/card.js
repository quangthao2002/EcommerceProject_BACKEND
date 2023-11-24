const  router = require('express').Router();

const cardController = require('../controllers/cartController')

router.get('/find/:id', cardController.getCard);
router.post('/', cardController.addToCard);
router.post('/quantity', cardController.decrementCardItem);
router.delete('/:cardItemId', cardController.deleteCardItem);
 

module.exports = router