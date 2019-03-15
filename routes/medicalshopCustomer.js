var express = require("express"),
    routes   = express.Router();
    users    = require("../models/user.js");
    medicine = require("../models/medicine.js")
    middleware = require("../middleware/index.js"),
    carts  = require("../models/cart.js");


//-------------------------------order received ----------------------------------
routes.post("/home/cart/received",function(req,res){
  carts.findOne({_id:req.body.cartId},function(err,foundCart){
    if(err){console.log(err);}
    else{
      foundCart.isReceived = true;
      foundCart.save();
      res.redirect("/home/cart/view");
    }
  });
});

//-------------------------------order received ----------------------------------
routes.get("/home/cart/history",middleware.isLoggedIn, middleware.isCustomer,function(req,res){
  carts.find({customerName: req.user.username}).populate("medicine.name").exec(function(err,foundCart){
    if(err){console.log(err);}
    else{
      if(foundCart){
        res.render("medicalshop/history.ejs",{carts: foundCart});
      }
      else{
        res.redirect("/home/cart/view");
      }
    }
  })
})

    //----------------------------------view cart-----------------------------------
    routes.get("/home/cart/view",middleware.isLoggedIn, middleware.isCustomer,function(req,res){
      // console.log("entered cart route");
      carts.find({customerName:req.user.username}).populate("medicine.name").exec(function(err,foundCart){
        if(err){console.log(err);}
        else{
          // console.log(foundCart);
          if(foundCart.length>0){
          // console.log("found cart "+foundCart.count);
          users.findOne({username: foundCart[0].shopName},function(err,foundShop){
            if(err){console.log(err);}
            else{
              // console.log("found user"+ foundShop);
              res.render("medicalshop/viewcart.ejs",{carts: foundCart, shop: foundShop});
            }
          });
        }
        else{
          console.log("No cart available for the user ")
          res.redirect("/home");
        }
      }
    });
  });

//-----------------------------place order-----------------------------------------
routes.post("/home/cart/placeorder",middleware.isLoggedIn, middleware.isCustomer,function(req,res){
  carts.findOne({_id:req.body.cartId},function(err,foundCart){
    if(err){console.log(err);}
    else{
      foundCart.isCheckedOut = true;
      foundCart.address = req.body.address;
      foundCart.save();
      res.redirect("/home/cart/view");
    }
  });
});

//------------------------------delete cart---------------------------------------------
routes.post("/home/cart/delete",middleware.isLoggedIn, middleware.isCustomer,function(req,res){
  console.log(req.body.id);
  carts.deleteOne({_id: req.body.id}, function(err){
    if(err){console.log(err);}
    else{
      console.log("deleted Succecfully");
      res.redirect("back");
    }
  })

})


//-------------------------------------------------------------------------------------
routes.get("/home/:shopname",middleware.isLoggedIn, middleware.isCustomer,function(req,res){
  users.findOne({username: req.params.shopname}).populate("medicine.id").exec(function(err,foundShop){
    res.render("medicalshop/show.ejs",{shopname: foundShop});
  });
});

//-------------------------------------add to cart-------------------------------------
routes.post("/home/:shopname/:medicineId",function(req,res){
  carts.find({customerName: req.user.username,shopName: req.params.shopname}).populate("medicine.name").exec(function(err,foundCarts){
    var checkedOut = null;
    if(err){console.log(err);}
    else{
      console.log(foundCarts);
      medicine.findOne({_id: req.params.medicineId},function(err,med){
          if(foundCarts){
            var flag = false;
            foundCarts.forEach(function(foundCart){
              if(!foundCart.isCheckedOut){
                checkedOut = false;
            foundCart.medicine.forEach(function(medicine){
              console.log(medicine.name,med._id);
              if(medicine.name.name == med.name){
                // console.log(toString(medicine.name.name) ,toString(med.name),toString(medicine.name.name) == toString(med.name));
                medicine.count =  medicine.count + parseInt(req.body.count,10);
                flag = true;
              }
            });
            if(!flag){
              foundCart.medicine.push({name:med, count: req.body.count});
            }
            flag = false;
            foundCart.save();

          }
        });
            }
          if(!foundCarts || checkedOut==null){
          carts.create({customerName: req.user.username,shopName: req.params.shopname}, function(err,newCart){
            if(err){console.log(err);}
            else{
              newCart.isCheckedOut = false;
              newCart.isDispatched = false;
              newCart.isReceived = false;
              newCart.medicine.push({name:med, count: req.body.count});
              newCart.save();
            }
          });
        }
      });
      users.findOne({username: req.params.shopname}).populate("medicine.id").exec(function(err,foundUser){
        if(err){console.log(err);}
        else{
          foundUser.medicine.forEach(function(medicine){
            if(medicine.id._id == req.params.medicineId){
              medicine.number = medicine.number- req.body.count;
            }
          });
          foundUser.save();
        }
          });
          res.redirect("/home/"+req.params.shopname);
        }
      });
});
module.exports = routes;
