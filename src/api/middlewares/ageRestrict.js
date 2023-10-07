const jwt = require("jsonwebtoken");
const product = require("../models/product");


exports.ageRestrict = async (req, res, next) => {

    if (req.body.ageMatured == true) {
        next();

    } else {
        console.log("age restricted");
        try {
            const keyword = req.params.keyword;
            const keyRegex = new RegExp(keyword, 'i');

            const findProduct = await product.find({
                
                $and:[{
                    $or: [
                    {
                        title: {
                            $regex: keyRegex
                        }
                    }, {
                        category: {
                            $regex: keyRegex
                        }
                        }
                    ]
                }, {
                        isRestricted: false
                    }
                ]
            });

            if (findProduct.length == 0) {
                res.status(404).json("Product not available for you");

            } else {
                res.status(200).json(findProduct);

            }
        } catch (err) {
            res.status(500).json('err: ' + err);

        }

    }

}