const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app=express();
const _ = require('loadsh');
var port = process.env.PORT || 8080;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//connect to database
mongoose.connect('mongodb+srv://admin-anmol:anmol123@cluster0.07hga.mongodb.net/TodolistDB',{useNewUrlParser:true});
//mongoose.connect('mongodb://localhost:27017/TodolistDB');
//create schema
const itemSchema={
  name:String
};

//create model
const Item_Model=mongoose.model("Item",itemSchema);


//insert recode
const i1= new Item_Model({
  name:"anmol"
});
const i2= new Item_Model({
  name:"k"
});
const i3= new Item_Model({
  name:"parmar"
});
const default_item = [i1,i2,i3];
// Item_Model.insertMany(default_item, function(error, docs) {
//   if(error)
//   {
//     console.log("error in fjaebkjbv");
//   }
//   else
//   {
//     console.log(docs);
//   }
// });

const listSchema={
  name:String,
  items:[itemSchema]
};
const List_Model=mongoose.model("List",listSchema);



app.use(express.static("public"));
var item_array=[];
var work_item_array=[];
var today = new Date();
var option={
  weekday:"long",
  day:"numeric",
  month:"long"
};
var day=today.toLocaleDateString("en-US",option);
app.get("/",function(req,res){

  Item_Model.find({},function(error, foundItem) {
    if(error)
    {
    }
    else
    {
      console.log(foundItem);
      res.render("list",{ListItem:day,item_array:foundItem});
    }
  });

});
app.post("/",function(req,res){
  var item_get=_.capitalize(req.body.newItem);
  var list_button=req.body.list_button;
  const insert_Item=new Item_Model({
    name:item_get
  });


  if(req.body.list_button === day)
  {
    console.log("insert_Item");
    insert_Item.save();
    res.redirect("/");
  }
  else
  {
    List_Model.findOne({name:list_button},function(error,foundItem){
      if(error)
      {

      }
      else
      {
        foundItem.items.push(insert_Item);
        foundItem.save();
        res.redirect("/"+foundItem.name);
      }
    });

  }

});

//delete data
app.post("/delete",function(req,res){
   var item_get_id=req.body.delete_button;
   var itemitem_name=req.body.list_name_get;
   if(itemitem_name===day)
   {
     Item_Model.findByIdAndRemove(item_get_id,function(error){
       if(!error)
       {
         res.redirect("/");
       }
     });
   }
   else
   {
      List_Model.findOneAndUpdate({name:itemitem_name},{$pull:{items:{_id:item_get_id}}},function(error,foundItem){
        if(!error)
        {
          res.redirect("/"+itemitem_name);
        }
      });
   }
  // if(req.body.list_button === "Work List")
  // {
  //   work_item_array.push(item_get);
  //   res.redirect("/work");
  // }
  // else
  // {
  //   const insert_Item=new Item_Model({
  //     name:item_get
  //   });
  //   insert_Item.save();
  //   // item_array.push(item_get);
  //   res.redirect("/");
  // }


});





app.get("/:custome_list_name",function(req,res){
  var custome_list_name= _.capitalize(req.params.custome_list_name);
  List_Model.findOne({name:custome_list_name},function(error,foundItem){
    if(!error)
    {
      console.log(foundItem);
      if(!foundItem)
      {
        console.log("if");
        const new_list= new List_Model({
          name:custome_list_name,
          items:[]
        });
        new_list.save();
        res.redirect("/"+custome_list_name);
      }
      else
      {
        console.log("else");
        res.render("list",{ListItem:foundItem.name,item_array:foundItem.items});
      }
    }
  });
});
// app.post("/work",function(req,res){
//   var work_item_get=req.body.newItem;
//   work_item_array.push(work_item_get);
//   res.redirect("/work");
// });

// app.listen(port, function(){
//   console.log("server started on port 3000");
// });
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
