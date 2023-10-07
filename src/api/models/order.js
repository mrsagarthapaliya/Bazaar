const mongoose = require('mongoose');


const orderSchema = mongoose.Schema(
    {
        user: {
            type: Array,
            required: true
        },
        product: {
            type: Array,
            deleveryStatus: {
                type: String,
                enum: ['pending', 'on the way', 'completed'],
                default: 'pending'
            },
        },
        deleveryAddress: {
            type: String,
            ref: 'user'
        },
        totalAmount: {
            itemAmount: {
                type: Number
            },
            discountAmount: {
                type: Number
            },
            finalAmount: {
                type: Number
            }
        },
        payment: {
            paymentMethod: {
                type: String,
                enum: ['cash on delivery', 'visa card payment', 'mobile banking payment'],
                default: 'cash on delivery'
            },
            paymentStatus: {
                type: Boolean,
                default: 0
            }
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('order', orderSchema);