import mongoose from "mongoose" ;

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

     
},{timestamps:true})

//Creating a model
export const userModel = mongoose.model('User',userSchema);

//Database connection
 const connection = mongoose.connect('mongodb://0.0.0.0/data').then(()=>{
    console.log("conected to database")
})

module.exports= connection;
 