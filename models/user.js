var mongoose = require("mongoose");
      plm     = require("passport-local-mongoose");


userSchema =new mongoose.Schema({
  username: String,
  password: String,
  medicine: [{
    id:{type: mongoose.Schema.Types.ObjectId,
    ref: "medicine"
  },
    number: Number
  }],
  location: String,
  image: String,
  isAdmin: Boolean
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);
