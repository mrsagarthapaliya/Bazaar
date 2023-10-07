const router = require('express').Router();
const { ObjectId } = require("mongodb");

const order = require('../models/order');
const { verifyTokenAndAuthorization } = require('../middlewares/tokenVerification');


//add new order
router.post('/add', async (req, res) => {
    try {
        const user = req.body[0].user;
        const product = await req.body[0].product;

        const newOrder = await new order({
            user: user,
            product: product
        });

        const savedOrder = await newOrder.save();

        res.status(200).json(savedOrder);

    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

//get order
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id)
        const findOrder = await order.findById(id)

        res.status(200).json(findOrder);

    } catch (err) {
        res.status(500).json("err: " + err);
    }
});

//delete order (ask for delete)
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const findOrder = await order.findById(id);

        if (findOrder) {
            const deleteOrder = await order.findByIdAndDelete(id);
            res.status(200).json(deleteOrder);
        }
        else {
            res.status(404).json("Order not found!");
        }
        
    } catch (err) {
        res.status(500).json('err: ' + err);

    }
});


module.exports = router;
