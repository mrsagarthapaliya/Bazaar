const router = require("express").Router();

const { verifyTokenAndAdmin } = require("../middlewares/tokenVerification");
const discount = require("../models/discount");
const coupon = require("../models/coupon");


//create discount
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const { productId } = req.body;


    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

//get discount


module.exports = router;