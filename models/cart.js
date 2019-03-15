var mongoose = require("mongoose");
    plm = require("passport-local-mongoose");

cartSchema = new mongoose.Schema({
  customerName:String,
  shopName:String,
  medicine:[
    {
      name:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "medicine"
      },
      count: Number
    }
  ],
  isCheckedOut: Boolean,
  address: String,
  isDispatched: Boolean,
  isReceived: Boolean
});

cartSchema.plugin(plm);

module.exports = mongoose.model("cart",cartSchema);
