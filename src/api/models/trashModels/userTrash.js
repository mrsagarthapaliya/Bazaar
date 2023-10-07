const mongoose = require("mongoose");


userTrashSchema = mongoose.Schema({
    userId: {
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

module.exports = mongoose.model('userTrash', userTrashSchema);