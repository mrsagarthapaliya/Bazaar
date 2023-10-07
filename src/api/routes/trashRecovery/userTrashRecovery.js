const router = require('express').Router();
const { ObjectId } = require('mongodb');

const user = require("../../models/user")
const userTrash = require("../../models/trashModels/userTrash")
const { verifyTokenAndAdmin } = require('../../middlewares/tokenVerification');


router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = await new ObjectId(req.params.id);

        const finduserInTrash = await userTrash.findById(id);

        if (!finduserInTrash) {
            res.status(404).json("This user may already have been recovered");

        } else {
            const userId = await finduserInTrash.userId;
            const recoveredAt = new Date();

            const recovereduser = await user.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        status: 1,
                        recoveredAt: recoveredAt
                    }
                },
                { new: true }
            );

            console.log(recovereduser);

            await userTrash.findByIdAndDelete(id);

            res.status(200).json("The user is recovered: " + recovereduser)

        }
    } catch (err) {
        res.status(500).json("err: " + err);

    }
});

module.exports = router;