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



const newrecipeSchema = new mongoose.Schema({
    name:String,
    email: String,
    recipe_name: String,
    description: String,
    ingridients: String,
    category: String,
    image: String,
})
                
const Recipe = new mongoose.model('user_recipe',newrecipeSchema);
        




app.listen(5010, () => {
    console.log("server is live on 5010")
})

 module.exports = Recipe