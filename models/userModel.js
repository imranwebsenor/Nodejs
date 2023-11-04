const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const secretKey = process.env.JWT_SECRET || "yourSecretKey";
const { Schema } = require("mongoose");
const Address =require('./addressModel')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      validate: {
        // if email exists
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          if (user) {
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: (props) => "The specified email address is already in use.",
      },
    },

    phone: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
      validate: {
        validator: async function (phone) {
          const user = await this.constructor.findOne({ phone });
          if (user) {
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: (props) => "The specified phone Number is already in use.",
      },
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      required: [true, "username can't be blank"],
      index: true,
      validate: {
        validator: async function (username) {
          const user = await this.constructor.findOne({ username });
          if (user) {
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: "The specified username is already in use.",
      },
    },
    role: {
      type: String,
      default: "Basic",
      required: true,
    },

    profile_picture: {
      type: String,
    },
    fee: {
      type: Number,
    },
    nameSlug:{
      type:String
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//delete user address on deleting user
userSchema.pre('deleteOne', async function (next) {
  let filter = this.getFilter(); //cannot use this._id because Mongoose does not automatically populate the _id field when a document is being deleted
  await Address.deleteMany({ user: filter._id  });
  next();
});

// Define a pre-save hook to hash the password before saving the user
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });

});


userSchema.pre("save", function (next) {
  this.nameSlug = this.name.replaceAll(' ','-');
  next();
});

//Reverse Populate with virtuals
userSchema.virtual('addresses',{
  ref:'Address',
  localField:'_id',
  foreignField:'user',
  justOne:false
})

const User = mongoose.model("User", userSchema);

module.exports = User;
