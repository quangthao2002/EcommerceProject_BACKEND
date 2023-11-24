const router = require('express').Router();
const productController = require('../controllers/productsController')

router.get('/',productController.getAllProduct)
router.get('/:id',productController.getProductById)
router.get('/search/:key',productController.searchProduct)
router.post('/',productController.createProduct)
router.delete('/:id',productController.deleteProduct)

module.exports = router
