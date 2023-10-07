const cryptoJS = require('crypto-js');
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const user = require("../models/user");
const trashUser = require("../models/trashModels/userTrash");
const findAge = require("../../functions/findAge");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/tokenVerification");


//REGISTER NEW USER
router.post("/register", async (req, res) => {

  const birthday = new Date(req.body.birthday);
  const age = await findAge.findAge(birthday);

  const newUser = new user({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJS.AES.encrypt(req.body.password, process.env.SEC_PASS).toString(),
    contact: req.body.contact,
    address: req.body.address,
    gender: req.body.gender,
    age: age,
    isAdmin: req.body.isAdmin,
    birthday: req.body.birthday
  });

  try {
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);

  } catch (err) {
    res.status(500).json("err: " + err);
  }

});

//USER LOGIN WITH EMAIL OR USERNAME
router.post('/login', async (req, res) => {
  try {
    const usernameOrEmail = req.body.usernameOrEmail;

    const findUser = await user.findOne({
      $or: [{ username: { $regex: new RegExp(usernameOrEmail, 'i') } },
      { email: { $regex: new RegExp(usernameOrEmail, 'i') } }
      ]
    });

    !findUser && res.status(400).json("Incorrect username or email");

    const originalPassword = await cryptoJS.AES.decrypt(
      findUser.password,
      process.env.SEC_PASS
    ).toString(cryptoJS.enc.Utf8);

    originalPassword != req.body.password && res.status(400).json("Incorrect Password");

    //creating token after login
    const accessToken = jwt.sign({
      id: findUser.id,
      isAdmin: findUser.isAdmin
    },
      process.env.SEC_JWT,
      { expiresIn: '7d' }
    );

    const { password, ...others } = findUser._doc;

    res.status(200).json({ ...others, accessToken });

  } catch (err) {
    res.status(500).json('err: ' + err);

  }
});


//FIND ALL USER OR BY FILTERING
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const username = req.query.username && req.query.username.split(',');
    const email = req.query.email && req.query.email.split(',');
    const isAdmin = req.query.isAdmin;

    if (username || email || isAdmin) {
      const findUser = await user.find({

        $or: [
          { username: { $in: username } },
          { email: { $in: email } },
          { isAdmin: isAdmin }
        ]
      });

      res.status(200).json(findUser);

    } else {
      const findUser = await user.find();

      res.status(200).json(findUser);

    }

  }
  catch (err) {
    res.status(500).json(err);

  }
});

//FIND USER BY KEYWORD
router.get('/:keyword', verifyTokenAndAdmin, async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const keyRegex = new RegExp(keyword, 'i');

    if (keyword) {
      const findUser = await user.find({
        $or: [
          { username: { $regex: keyRegex } },
          { email: { $regex: keyRegex } },
        ]
      });

      res.status(200).json(findUser);

    } else {
      const findUser = await user.find();

      res.status(200).json(findUser);

    }

  } catch (err) {
    res.status(500).json(err);

  }
});

// UPDATE USER
router.put('/update/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const updateUser = await user.findByIdAndUpdate(
      id,
      {
        $set: req.body
      },
      { new: true },
      { runvalidators: true }
    );

    res.status(200).json(updateUser);

  } catch (err) {
    res.status(500).json('err: ' + err);

  }
});

//DELETE USER
router.patch('/delete/:id', verifyTokenAndAdmin, async (req, res) => {

  const id = new ObjectId(req.params.id);
  const findUser = await user.findOne(
    {
      _id: id,
      status: 1
    });

  try {
    if (!findUser) {
      res.status(404).json('User not found');

    }
    else if (id.toString() === "64896cfe62446f37dc04d532") {
      res.status(500).json('This user cannot be deleated');

    }
    else {
      await user.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 0
          }
        },
        { new: true }
      );

      const deletedAt = new Date();
      const actionUser = new ObjectId(req.user.id);

      const userTrash = await new trashUser({
        userId: id,
        deleatedAt: deletedAt,
        deleatedBy: actionUser
      });

      const savedTrash = await userTrash.save()

      res.status(200).json('The user is deleated: ' + savedTrash);

    }
  } catch (err) {
    res.status(500).json('err: ' + err);

  }
});

module.exports = router;