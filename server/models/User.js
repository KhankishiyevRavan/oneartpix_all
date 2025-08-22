const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Role = require("./Role");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
  },
  identityNumber: {
    type: String,
    required: true,
    unique: true, // Burada unique olsun ki, eyni nömrədən 2 dənə olmasın
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role", // Bu, istifadəçinin hansı rolda olduğunu saxlayacaq
    required: false,
  },
 
  // address: {
  //   street: { type: String },
  //   city: { type: String },
  //   // state: { type: String },
  //   // postCode: { type: String },
  //   // category: { type: String },
  // },
  balance: {
    type: Number,
    default: 0,
  },
  dynamicFields: { type: Map, of: Schema.Types.Mixed },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Хешируем пароль перед сохранением в базе данных
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.pre("remove", async function (next) {
  if (this.role && this.role.name === "admin") {
    throw new Error("Admin user cannot be deleted");
  }
  next();
});

const User = mongoose.model("User", userSchema, "kombim_users");

module.exports = User;
