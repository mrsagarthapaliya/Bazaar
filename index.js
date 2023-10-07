const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./src/api/routes/user");
const productRoute = require("./src/api/routes/product");
const cartRoute = require("./src/api/routes/cart");
const orderRoute = require("./src/api/routes/order");
const userRecoveryRoute = require("./src/api/routes/trashRecovery/userTrashRecovery");
const productRecoveryRoute = require("./src/api/routes/trashRecovery/productTrashRecovery");
const discountRoute = require("./src/api/routes/discount");
const couponRoute = require("./src/api/routes/coupon");


const app = express();
app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    console.log(
      `Your connection has been Established with database`
    )
  )
  .catch((err) => console.log("uff! error ocured while connecting... " + err));

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/userRecovery', userRecoveryRoute);
app.use('/api/productRecovery', productRecoveryRoute);
app.use('/api/dicount', discountRoute);
app.use('/api/coupon', couponRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Your server is running");
});
