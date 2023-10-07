const mongoose = require('mongoose');


productSchema = mongoose.Schema(
    {
        proId: {
            type: Number,
            trim: true,
            required: true
        },
        title: {
            type: String,
            trim: true,
            required: [true, "Product name is required"]
        },
        desc: {
            type: String,
            trim: true,
            required: [true, "Product desc is required"]
        },
        category: {
            type: Array,
            trim: true,
            required: [true, "Product category is required"]
        },
        image: {
            type: String,
            trim: true,
            required: [true, "Product image is required"]
        },
        size: {
            type: Number,
            trim: true
        },
        color: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            trim: true,
            required: [true, "Product price is required"]
        },
        isRestricted: {
            type: Boolean,
            required: true
        },
        status: {
            type: Number,
            required: true,
            default: 1
        },
        recoveredAt: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('product', productSchema);