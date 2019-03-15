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
mongoose.connect("mongodb://nachijr4:PAssword00!!@ds113871.mlab.com:13871/medsys",{useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/medsys",{useNewUrlParser: true});
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
app.listen(3000, console.log("Medsystem has started in port 3000"));




//--------------------------------------------------------------
  // app.get("/addmedicine",function(req,res){
  //   res.render("addmedicine.ejs");
  // });
  //
  // app.post("/addmedicine",function(req,res){
  //   var data = {name: req.body.name, image: req.body.image, description: req.body.description}
  //   console.log(data);
  //   medicine.create(data, function(err,newmed){
  //     if(err){console.log(err);}
  //     else{
  //       console.log(newmed);
  //       res.redirect("/addmedicine");
  //     }
  //   });
  // });
  //
  // app.get("/adduser",function(req,res){
  //   res.render("adduser.ejs");
  // });
  //
  // app.post("/adduser",function(req,res){
  //   console.log(req.body);
  //   var newUser = new user({username: req.body.username});
  //   user.register(newUser, req.body.password, function(err,newUser){
  //     console.log("added user");
  //     if(err){console.log(err);}
  //     else{
  //         // var authenticate = passport.authenticate("local");
  //         // authenticate(req,res,function(){
  //         //   console.log("found user");
  //           // user.find({username:req.body.username}, function(err,nuser){
  //               newUser.image= req.body.image;
  //               newUser.location= req.body.location;
  //               newUser.save();
  //               res.redirect("/adduser");
  //
  //     // });
  //   }
  //   });
  // });

