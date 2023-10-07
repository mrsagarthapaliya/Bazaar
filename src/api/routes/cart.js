const router = require("express").Router();
const { ObjectId } = require('mongodb');

const cart = require("../models/cart");
const { verifyTokenAndAuthorization, verifyToken } = require("../middlewares/tokenVerification");


//ADD to cart
router.post("/add", verifyToken, async (req, res) => {

    try {
        const { userId, productId } = req.body;

        const existingUserWithProduct = await cart.findOne(
            {
                userId: new ObjectId(userId),
                productId: new ObjectId(productId)
            }
        );

        if (!existingUserWithProduct) {
            const newCart = new cart(req.body);
            const savedCart = await newCart.save();

            res.status(200).json(savedCart);

        } else {
            var productCount = existingUserWithProduct.productCount + 1;

            await cart.updateOne(
                { _id: existingUserWithProduct._id },
                { productCount: productCount }
            );

            const myCartData = await cart.findOne({ _id: existingUserWithProduct._id });

            res.status(200).json(myCartData);
        }

    } catch (err) {
        res.status(500).json("err: " + err);

    }
});

//Get user cart
router.get('/:userId', verifyTokenAndAuthorization, async (req, res) => {

    try {
        const userId = new ObjectId(req.params.userId);

        const findCart = await cart.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $addFields: {
                    product: {
                        $map: {
                            input: "$product",
                            as: "product",
                            in: {
                                productId: "$productId",
                                productTitle: "$$product.title",
                                productDesc: "$$product.desc",
                                productCount: "$productCount",
                                productPrice: { $multiply: ["$$product.price", "$productCount"] },
                                productImage: "$$product.image"
                            }//in
                        }//map
                    }//product
                }//addFields
            },
            {
                $group: {
                    _id: new ObjectId(),
                    user: {
                        $addToSet: {
                            userId: "$userId",
                            username: { $arrayElemAt: ["$user.username", 0] }
                        }
                    },
                    product: {
                        $addToSet: "$product"
                    },
                    totalCount: {
                        $sum: "$productCount"
                    },
                    totalAmount: {
                        $sum: { $sum: "$product.productPrice" }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    product: 1,
                    totalCount: 1,
                    totalAmount: 1
                }
            }
        ]);

        res.status(200).json(findCart);

    } catch (err) {
        res.status(500).json("err" + err);

    }
});

// UPDATE cart count
router.put('/update', async (req, res) => {
    try {
        const { userId, productId, productCount } = req.body;

        await cart.findOneAndUpdate(
            {
                userId: new ObjectId(userId),
                productId: new ObjectId(productId)
            },
            {
                $set: { productCount: productCount}
            },
            { new: true },
            { runvalidators: true}
        );

        const myCartData = await cart.findOne({
            userId: new ObjectId(userId),
            productId: new ObjectId(productId)
        });

        res.status(200).json(myCartData);

    } catch (err) {
        res.status(500).json('err: ' + err);

    }
});

//DELETE cart item
router.delete('/cartItemDelete', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const existingUserWithProduct = await cart.findOneAndDelete({
            userId: userId,
            productId: productId
        });

        res.status(200).json(existingUserWithProduct);

    } catch (err) {
        res.status(500).json('err: ' + err);

    }
});

//Delete whole cart
router.delete('/allCartDelete', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { userId } = req.body;

        const deleteCart = await cart.deleteMany({ userId: userId });

        res.status(200).json(deleteCart);

    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

module.exports = router;
