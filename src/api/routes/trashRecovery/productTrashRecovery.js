const router = require('express').Router();
const { ObjectId } = require('mongodb');

const product = require("../../models/product")
const productTrash = require("../../models/trashModels/productTrash")
const { verifyTokenAndAdmin } = require('../../middlewares/tokenVerification');


router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = await new ObjectId(req.params.id);
        
        const findProductInTrash = await productTrash.findById(id);

        if (!findProductInTrash) {
            res.status(404).json("This product may already have been recovered");

        } else {
            const productId = await findProductInTrash.productId;
            const recoveredAt = new Date();

            const recoveredProduct = await product.findByIdAndUpdate(
                { _id: productId },
                {
                    $set: {
                        status: 1,
                        recoveredAt: recoveredAt
                    }
                },
                { new: true }
            );

            console.log(recoveredProduct);

            await productTrash.findByIdAndDelete(id);

            res.status(200).json("The product is recovered: " + recoveredProduct)
            
        }  
    } catch (err) {
        res.status(500).json("err: " + err);

    }
});

module.exports = router;