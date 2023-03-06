const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://rahulghatge:rahul@chetan@cluster0.fmsf1ib.mongodb.net/backend_project?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err){
            console.log('There is an err',err)
        }else{
            console.log("Codes runs successful")
        }
    }
)


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    mobile_num: String,
    email: String,
    password: String,
})

const User = new mongoose.model('food_blog_users',userSchema);



app.listen(5001,() => {
    console.log('Database server is live on port 5001')
})

module.exports = User;
//module.exports = Recipe;

