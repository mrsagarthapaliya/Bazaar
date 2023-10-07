const router = require("express").Router();

const { verifyTokenAndAdmin } = require("../middlewares/tokenVerification.js");
const coupon = require("../models/coupon.js");


//add coupon
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    
    try {
        const { couponName, couponCode, couponDiscount, couponExpiresIn, maxDiscount } = req.body;

        if (couponName && couponCode && couponDiscount && couponExpiresIn) {
            
            const newCoupon = await new coupon(req.body);

            const savedCoupon = await newCoupon.save();

            res.status(200).json(savedCoupon);
            
        } else {
            
            res.status(200).json("Please provide complete data");
        }
        
    } catch (err) {
        res.status(500).json(err);
    }
});

//get Coupon by keyword
router.get('/:Keyword', verifyTokenAndAdmin, async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const keyRegex = new RegExp(keyword, 'i');

        const findCoupon = await coupon.find(keyRegex);

        res.status(200).json(findCoupon);
    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

//get Coupon by query
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
    try {
        const couponName = req.query.couponName && req.query.couponName.split(',');
        const couponCode = req.query.couponCode && req.query.couponCode.split(',');
        const couponPriceDiscount = req.query.couponPriceDiscount && req.query.couponPriceDiscount.split(',');
        const couponPercentageDiscount = req.query.couponPercentageDiscount && req.query.couponPercentageDiscount.split(',');

        if (couponName || couponCode || couponPriceDiscount || couponPercentageDiscount) {
            
            const findCoupon = await coupon.find({
                $or: [
                    { couponName: { $in: couponName } },
                    { couponCode: { $in: couponCode } },
                    { "couponDiscount.couponPriceDiscount": { $in: couponPriceDiscount } },
                    { "couponDiscount.couponPercentageDiscount": { $in: couponPercentageDiscount } }
                ]
            });

            res.status(200).json(findCoupon);

        }
    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

module.exports = router;