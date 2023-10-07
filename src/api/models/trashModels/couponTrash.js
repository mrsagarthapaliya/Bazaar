const mongoose = require("mongoose");


const couponTrashSchema = mongoose.Schema(
    {
        couponId: {
            type: String,
            required: true
        },
        deletedAt: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        deletedBy: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("couponTrash", couponTrashSchema);