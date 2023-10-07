const { json } = require("express");
const mongoose = require("mongoose");


const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "email address is required"],
      unique: true,
      trim: true,
      validate: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please enter valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, 'password is required']
    },
    contact: {
      primary: {
        type: String,
        required: [true, 'primary contact number is required'],
        unique: [true, 'This phone number already exists',],
        trim: true,
        validate: [(number) => number.length == 10, 'Phone number must have length 10']
      },
      alternative: {
        type: String,
        trim: true,
        validate: [(number) => number.length == 10, 'Phone number must have length 10']
      }
    },
    address: {
      homeAddressForDelevery: {
        country: {
          type: String,
          enum: ["Nepal", "India", "Bangladesh"],
          default: "Nepal",
          trim: true,
          required: [true, "Please fill the country field"]
        },
        state: {
          type: String,
          trim: true,
          required: [true, "Please fill the state field"]
        },
        city: {
          type: String,
          trim: true,
          required: [true, "Please fill the city field"]
        },
        area: {
          type: String,
          trim: true,
          required: [true, "Please fill the area field"]
        },
        houseNumber: {
          type: String,
          trim: true,
          required: [true, "Please fill the housenumber field"]
        },
        landmark: {
          type: String,
          trim: true,
          required: [true, "Please fill the landmark field"]
        }
      },
      officeAddressForDelevery: {
        country: {
          type: String,
          enum: ["Nepal", "India", "Bangladesh"],
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        area: {
          type: String,
          trim: true,
        },
        houseNumber: {
          type: String,
          trim: true,
        },
        landmark: {
          type: String,
          trim: true,
        }
      },
      option: {otherAddressForDelevery: {
        country: {
          type: String,
          enum: ["Nepal", "India", "Bangladesh"],
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        area: {
          type: String,
          trim: true,
        },
        houseNumber: {
          type: String,
          trim: true,
        },
        landmark: {
          type: String,
          trim: true,
        }
      },}
    },
    gender: {
      type: String,
      default: "Male",
      enum: ["Male", "Female", "Others"]
    },
    age: {
      type: Number,
      required: [true, 'Your age is required \nYour age must be above 13'],
      trim: true,
      validate: [(value) => value >= 13, "Your age must be above 13"]
    },
    isAdmin: {
      type: Boolean,
      trim: true,
      default: false
    },
    birthday: {
      type: Date,
      required: true,
      trim: true
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

module.exports = mongoose.model("user", userSchema);