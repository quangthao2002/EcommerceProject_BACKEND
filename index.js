const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const productRouter = require('./routes/products');
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const cardRouter = require('./routes/card')
const orderRouter = require('./routes/order')
const port = 3000;
const cors = require('cors');

app.use(cors());
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

app.use(express.json({ limit: '10mb' }));
app.use('/api/products', productRouter);
app.use('/api/', authRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cardRouter);
app.use('/api/orders', orderRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
