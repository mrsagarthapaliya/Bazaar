const mongoose = require("mongoose");


productTrashSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    deletedAt: {
        type: Date,
        required: true
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model("productTrash", productTrashSchema);