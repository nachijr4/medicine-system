var express = require("express"),
    routes   = express.Router();
    users    = require("../models/user.js");
    medicine = require("../models/medicine.js")
    middleware = require("../middleware/index.js");

//-------------------------------------------removing a paticular medicine-----------
routes.post("/:username/remove",middleware.isLoggedIn,middleware.isAdmin,function(req,res){
  users.findOne({username:req.params.username},function(err,foundUser){
    if(err){console.log(err);}
    else{
    for ( var i=0 ; i<foundUser.medicine.length;i++){
      if(foundUser.medicine[i].id == req.body.medRemove)
      {
        foundUser.medicine.splice(i,1);
        break;
      }
    }
    foundUser.save();
    res.redirect("/"+foundUser.username);
  }
  })
})


routes.get("/:username",middleware.isLoggedIn,middleware.isAdmin,function(req,res,next){
  if(req.params.username === req.user.username){
    next()
  }
  else{
    res.redirect("/"+req.user.username);
  }
}
,function(req,res){
  var username = req.params.username;
  users.findOne({username : username}).populate("medicine.id").exec(function(err,user){
    if(err){console.log(err);}
    else {
      res.render("user/show.ejs",{shopname: user});
    }
  });
});
//---------------------adding medicines----------------------------------
routes.get("/:username/addmedicine",middleware.isLoggedIn,middleware.isAdmin,function(req,res,next){
  if(req.params.username === req.user.username){
    next()
  }
  else{
    res.redirect("/"+req.user.username+"/addmedicine");
  }
}, function(req,res){
  users.findOne({username: req.params.username}, function(err,user){
    if(err){console.log(err);}
    else{
      res.render("user/addmedicine.ejs",{shopname: user});
    }
  });
});

routes.post("/:username/addmedicine",middleware.isLoggedIn,middleware.isAdmin,function(req,res,next){
  if(req.params.username === req.user.username){
    next()
  }
  else{
    res.redirect("/"+req.user.username+"/addmedicine");
  }
}, function(req,res){
  var medicine_name = req.body.medicine_name.toLowerCase();
  medicine.findOne({name : medicine_name},function(err,foundmed){
    if(err){
      console.log(err);
    }
    if(foundmed){
      users.findOne({username: req.params.username}, function(err,user){
        if(err){ console.log(err);}
        else{
          var flag = false;
          for(var i=0; i<user.medicine.length;i++){
            if(user.medicine[i].name==foundmed.name){
              flag = true;
              user.medicine[i].number = parseInt(user.medicine[i].number) + parseInt(req.body.medicine_count);
            }
          }
          if(!flag){
            user.medicine.push({id: foundmed, number : req.body.medicine_count});
          }
          user.save();
          flag = false;
          res.redirect("/"+user.username);
        }
      });
    }
    else{
      res.render("user/addnewmedicine.ejs",{count :req.body.medicine_count});
    }
    });
  });

  routes.get("/:username/addnewmedicine", middleware.isLoggedIn, middleware.isAdmin,function(req,res,next){
    if(req.params.username === req.user.username){
      next()
    }
    else{
      res.redirect("/"+req.user.username+"/addnewmedicine");
    }
  },function(req,res){
    res.render("user/addnewmedicine.ejs");
  });


routes.post("/:username/addnewmedicine", middleware.isLoggedIn, middleware.isAdmin,function(req,res,next){
  if(req.params.username === req.user.username){
    next()
  }
  else{
    res.redirect("/"+req.user.username+"/addnewmedicine");
  }
},function(req,res){
  var med_count = req.body.medicine_count;
  delete req.body.medicine_count;
  var data = {
    name: req.body.name.toLowerCase(),
    image: req.body.image,
    description: req.body.description,
    price: req.body.price}
  medicine.create(data,function(err,new_med){
    if(err){console.log(err);}
    else{
      users.findOne({username: req.params.username},function(err,foundUser){
        if(err){console.log(err);}
        else{
        foundUser.medicine.push({id: new_med, number : med_count});
        foundUser.save();
      }
      res.redirect("/"+foundUser.username);
    })
    }
  })
});
//---------------------------to view the order for thzt medicalshop-----------------
routes.get("/:username/vieworders", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
  carts.find({shopName: req.params.username}).populate("medicine.name").exec(function(err,foundCarts){
    if(err){console.log(err);}
    else{
      // console.log(foundCarts);
      res.render("user/vieworders.ejs",{foundCarts: foundCarts});
    }
  })
})

//--------------------------------to dispatch an order-------------------------------------
routes.post("/:username/dispatch", middleware.isLoggedIn, middleware.isAdmin,function(req,res){
  carts.findOne({_id:req.body.cartId}, function(err,foundCart){
    if(err){console.log(err);}
    else{
      foundCart.isDispatched = true;
      foundCart.save();
      res.redirect("/"+foundCart.shopName+"/vieworders");
    }
  })
})
//---------------------------------View previous orders----------------------------------
routes.get("/:username/vieworders/history",middleware.isLoggedIn, middleware.isAdmin,function(req,res){
  carts.find({shopName: req.user.username}).populate("medicine.name").exec(function(err,foundCart){
    if(err){console.log(err);}
    else{
      if(foundCart){
        res.render("user/history.ejs",{carts: foundCart});
      }
      else{
        res.redirect("/"+foundCart.shopName+"/vieworders");
      }
    }
  })
})

//----------------------------------------------------------------------------------------
module.exports = routes;
