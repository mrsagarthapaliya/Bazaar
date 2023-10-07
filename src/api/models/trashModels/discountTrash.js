const mongoose = require("mongoose");


const discountTrashSchema = mongoose.Schema(
    {
        discountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId
        },
        deletedAt: {
            type: Date
        }
    }
);

module.exports = mongoose.model("discountTrash", discountTrashSchema);