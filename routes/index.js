var express = require("express"),
    app = express(),
    routes  = express.Router(),
    passport = require("passport"),
    middleware = require("../middleware/index.js"),
    users = require("../models/user.js");

routes.get("/",middleware.isNotLoggedIn,function(req,res){
  res.render("index/landing.ejs");
})


routes.get("/home",middleware.isLoggedIn,middleware.isCustomer,function(req,res){
  users.find({},function(err,foundusers){
    if(err){ console.log(err);}
    else {
      //console.log(req.user);
      res.render("medicalshop/home.ejs",{user: foundusers});
    }
  });
});

//-----------------------------------Adding Users------------------------
routes.get("/adduser", function(req,res){
  res.render("index/adduser.ejs");
});

routes.post("/adduser",function(req,res){
  var username = new user({username: req.body.username});
  users.register(username,req.body.password,function(err, newUser){
    if(err){console.log(err);}
    else{
      newUser.location = req.body.location;
      newUser.image = req.body.image;
      newUser.isAdmin = true;
      newUser.save();
      var authenticate = passport.authenticate("local");
      authenticate(req,res,function(){
        res.redirect("/"+newUser.username);
      });
    }
  });
});

routes.get("/addcustomer", function(req,res){
  res.render("index/addcustomer.ejs");
});

routes.post("/addcustomer",function(req,res){
  var username = new user({username: req.body.username});
  users.register(username,req.body.password,function(err, newUser){
    if(err){console.log(err);}
    else{
      newUser.isAdmin = false;
      newUser.save();
      var authenticate = passport.authenticate("local");
      authenticate(req,res,function(){
        res.redirect("/home");
      });
    }
  });
});
//-----------------------------------------------------------------------
routes.get("/login", function(req, res){
  res.render("index/login.ejs");
});

routes.post("/login",passport.authenticate("local",{successRedirect: "/home",failureRedirect: "/login"}),function(req,res){});

routes.get("/logout",function(req,res){
  req.logout();
  res.redirect("back");
})

module.exports = routes;
