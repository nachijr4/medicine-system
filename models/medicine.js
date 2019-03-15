var mongoose = require("mongoose"),
    plm      = require("passport-local-mongoose");

var medicine_schema = new mongoose.Schema({
  name: {type:String, index:{unique:true}},
  image: String,
  description: String,
  price: String
});

medicine_schema.plugin(plm);

module.exports = mongoose.model("medicine", medicine_schema);
