// db.database.dropIndex();
var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    plm      = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    passport  = require("passport"),
    expressSession = require("express-session"),
    localstratergy = require("passport-local");

//-------------------Routes-----------------------------------------------
var indexroutes = require("./routes/index.js");
    medicalshopUser = require("./routes/medicalshopUser.js"),
    medicalshopCustomer = require("./routes/medicalshopCustomer.js");
//--------------------------------------------------------------
var medicine = require("./models/medicine.js")
    user     = require("./models/user.js");
//--------------------------------------------------------------
// mongoose.connect("mongodb://nachijr4:PAssword00!!@ds113871.mlab.com:13871/medsys",{useNewUrlParser: true});
mongoose.connect(process.env.database,{useNewUrlParser: true});
// mongoose.connect("mongodb://localhost2:27017/medsys",{useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
console.log(__dirname);
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({extended: true}));
//--------------------------------------------------------------

passport.use(new localstratergy(user.authenticate()));
app.use(expressSession({
  secret:"secret of the med system",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//--------------------------------------------------------------


app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

app.use(indexroutes);
app.use(medicalshopUser);
app.use(medicalshopCustomer);
app.listen(process.env.PORT);
