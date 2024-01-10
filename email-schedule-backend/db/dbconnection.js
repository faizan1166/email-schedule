const mongoose =require('mongoose')
// require("dotenv").config()

mongoose.connect("mongodb+srv://faizan:faizan123@cluster0.tai5b58.mongodb.net/email_schedules?retryWrites=true&w=majority",{useUnifiedTopology:true},(err,res)=>{
    if(err){
        console.log('connection error',err);
    }
    else{
        console.log("Databse connection established");
    }
})
