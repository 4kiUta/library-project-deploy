const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      // required: [true, 'Username is Required'], // message that we get (probably)
      unique: true
    },
    email: {
      type: String,
      // required: [true, 'Email is Required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        'Please provide a Valid Email.'
      ]
    },
    passwordHash: {
      type: String,
      // required: [true, 'Password is Required'],
    },
    googleId: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
