const mongoose = require('mongoose');


const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    productCount: {
        type: Number, 
        validate: [(value) => value > 0, "Number of product in cart can't be zero."],
        required: true,
        default: 1
    }
}
);

module.exports = mongoose.model('cart', cartSchema);