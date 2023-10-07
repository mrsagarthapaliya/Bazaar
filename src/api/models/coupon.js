const mongoose = require("mongoose");


const couponSchema = mongoose.Schema(
    {
        couponName: {
            type: String,
            required: true
        },
        couponCode: {
            type: String,
            required: true
        },
        couponDiscount: {
            couponPriceDiscount: {
                type: Number
            },
            couponPercentageDiscount: {
                type: Number
            },
            maxDiscount: {
                type: Number,
            }
        },
        couponExpiresIn: {
            type: mongoose.SchemaTypes.Mixed,
            required: true
        },
        recoveredAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("coupon", couponSchema);