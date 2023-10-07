const mongoose = require("mongoose");


const discountSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        discountAmount: {
            type: Number,
        },
        recoveredBy:{
            type: mongoose.Schema.Types.ObjectId
        },
        recoveredAt: {
            type: Date
        }
    }
);

module.exports = mongoose.model("discount", discountSchema);