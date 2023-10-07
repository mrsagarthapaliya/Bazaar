const router = require("express").Router();
const { ObjectId } = require('mongodb');

const product = require("../models/product");
const trashProduct = require("../models/trashModels/productTrash")
const { verifyTokenAndAdmin } = require("../middlewares/tokenVerification");
const { ageRestrict } = require("../middlewares/ageRestrict");

//ADD NEW product
router.post("/add", verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new product(req.body);

    try {
        const { title, category, color, size, price } = req.body;

        const findProduct = await product.findOne({
            title: title,
            category: category,
            size: size,
            price: price,
            color: color
        });

        if (findProduct) {
            res.status(200).json("Same product with given properties already exists");

        } else {
            const saveProduct = await newProduct.save();
            res.status(200).json(saveProduct);
        
        }

    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

//FIND ALL products OR BY FILTERING
router.get('/', ageRestrict, async (req, res) => {
    try {
        const query = {}
        const title = req.query.title && req.query.title.split(',');
        const category = req.query.category && req.query.category.split(',');
        const color = req.query.color && req.query.color.split(',');
        const page = req.query.page || 1;

        const limit = req.query.limit || 3;
        const skip = (page - 1) * limit;
        
        const sortBy = req.query.sortBy;
        const sort = req.query.sort;

        const mySort = { [sortBy]: sort };
        
        const totalData = await product.countDocuments();
     
        if (title || category || color) {

            if (title) {
                query.title = title
            }
            if (category) {
                query.category = { $all: category }
            }
            if (color) {
                query.color = color
            }

            const findProduct = await product.find(query).sort(mySort).skip(skip).limit(limit);

            if (skip < totalData) {
                if (findProduct.length === 0) {
                    res.status(200).json("Product not availabe");

                }
                else {
                    res.status(200).json(findProduct);
                }
            } else {
                res.status(404).json("No more products available");
            }
            

        } else {
            const findProduct = await product.find().sort(mySort).skip(skip).limit(limit);

            if (skip < totalData) {
                res.status(200).json(findProduct);
                
            } else {
                res.status(404).json("No more products availabe");

            }
    }
    } catch (err) {
    res.status(500).json("err: " + err);

}
});

//search product by keyword
router.get('/:keyword', ageRestrict, async (req, res) => {

    try {
        const keyword = req.params.keyword;
        const keyRegex = new RegExp(keyword, 'i');

        const findProduct = await product.find({
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
        });

        if (!findProduct) {
            res.status(404).json("Product not available");

        } else {
            res.status(200).json(findProduct);

        }
    } catch (err) {
        res.status(500).json('err: ' + err);

    }
});

// UPDATE product
router.put('/update/:pId', verifyTokenAndAdmin, async (req, res) => {
    try {
        const pId = new ObjectId(req.params.pId);

        const updateProduct = await product.findByIdAndUpdate(
            pId,
            {
                $set: req.body
            },
            { new: true }
        ).timestamp.timestamps();

        res.status(200).json(updateProduct);

    } catch (err) {
        res.status(500).json('err: ' + err);

    }
});

//DELETE product
router.patch('/delete/:pId', verifyTokenAndAdmin, async (req, res) => {
    const pId = new ObjectId(req.params.pId);
    const findProduct = await product.findOne(pId);

    try {
        if (!findProduct) {
            res.status(404).json('product not found');

        }
        else {
            await product.findByIdAndUpdate(
                pId,
                {
                    $set: {
                        status: 0
                    }
                },
                { new: true }
            );

            const deletedAt = new Date();
            const actionUser = new ObjectId(req.user.id);

            const productTrash = await new trashProduct({
                productId: pId,
                deletedAt: deletedAt,
                deletedBy: actionUser
            });

            const savedTrash = await productTrash.save();

            res.status(200).json('The product is deleated: ' + savedTrash);

        }
    } catch (err) {
        res.status(500).json('err: ' + err);
        
    }
});

module.exports = router;