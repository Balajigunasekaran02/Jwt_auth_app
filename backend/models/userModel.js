const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      minLength: [4, "Name must be atleast 5 characters"],
      maxLenght: [30, "Name must be less than 30 chanracters "],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: [true, "Email already Registered"],
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
      },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
  },
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
