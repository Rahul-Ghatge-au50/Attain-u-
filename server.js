const { urlencoded } = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./database.js');
const Recipe = require('./recipedatabase.js');
const verifytoken = require('./verifytoken.js');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set('view engine','hbs')
app.use(express.static('public'))
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());



app.get('/home',(req,res) => {
    res.sendFile(__dirname + '/home.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})


app.get('/about', verifytoken ,(req,res) => {
    res.sendFile(__dirname + '/about.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})

// app.get('/about',(req,res) => {
//     res.sendFile(__dirname + '/about.html',(err) => {
//         if(err){
//             res.send('File is cracked',err);
//         }
//     })
// })


app.get('/mainpage',(req,res) => {
    res.sendFile(__dirname + '/mainpage.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})

app.get('/login',(req,res) => {
    res.sendFile(__dirname + '/login.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})

app.get('/signup',(req,res) => {
    res.sendFile(__dirname + '/signup.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})


app.get('/recipeForm', verifytoken, (req,res) => {
    res.sendFile(__dirname + '/submit.html',(err) => {
        if(err){
            res.send('File is cracked');
        }
    })
})

app.post('/Login',async (req,res) => {
    const data = req.body;
    let user_email = data.email;
    let user_password = data.password;

    const user_data = await User.findOne({email: user_email})
    if(!user_data){
        res.status(400);
        //res.send('User is not registered');
        res.render('login',{email: user_email})
        //res.redirect('/home')
        return
    }
    let database_password = user_data.password;
    const valid = await bcrypt.compare(user_password,database_password);
    if(!valid){
        res.status(400);
        //res.send('Password is incorrect');
        res.render('login',{password: user_password})
        return;
    }else{
        const user_token = jwt.sign({id:user_data._id},"chetanRahul",{expiresIn: "1h"})
        res.cookie('my_token',user_token)
        res.redirect('/home');
        return 
    }
})

app.post('/SignUp',async (req,res) => {
    const data = req.body;

    if(data.password !== data.cpassword){
        //res.send('Please enter the same password as above');
        res.render('signup',{password: data.password})
        return;
    }
    let first_name = data.first_name;
    let last_name = data.last_name;
    let mobile_num = data.mobile_num;
    let user_email = data.email;
    let user_password = data.password;
    if(!first_name || !last_name || !mobile_num || !user_email || !user_password){
        res.status(400);
        //res.send('Fill all the needed information');
        res.render('signup',{first_name: first_name,last_name: last_name, mobile_num: mobile_num, email: user_email, password: user_password})
        return
    }
    
    const user_data = await User.findOne({email: user_email});
    if(user_data){
        //res.send('Email is already registered');
        res.render('signup',{email: user_email})
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user_password,salt);
    const food_blog_users = new User ({first_name: first_name, last_name: last_name, mobile_num: mobile_num, 
                            email: user_email, password: hash_password});
    
    const result = await food_blog_users.save();
    //res.send('Login Successful');
    res.redirect('/login')
    return
})





app.post('/submitrecipe', async (req,res) => {
    const data = req.body;
    let user_name = data.name;
    let user_email = data.email;
    let user_recipe = data.recipe_name;
    let description = data.description;
    let ingridients = data.ingridients;
    let category = data.category;
    let image = data.image;
    // if(!user_name || !user_email || !user_recipe || !description || !ingridients || !category){
    //     res.status(400);
    //     //res.send('Fill Every Needed Information');
    //     res.render('submit',{name: user_name, email: user_email, recipe_name: user_recipe, description: description, category: category, image: image})
    //     return
    // }

    const recipe_name = await Recipe.findOne({recipe_name: user_recipe})
    if(recipe_name){
        res.status(400);
        //res.send("Recipe is already there");
        res.render('submit',{recipe_name: user_recipe})
        return
    }else{
        const recipe_data = new Recipe({user_name: user_name, user_email: user_email, user_recipe: user_recipe, description: description, ingridients: ingridients,
                    category: category, image: image})
        const result = await recipe_data.save()
        res.redirect('/home')
        return
    }
})

app.get('/',(req,res) => {
    res.send('Hello Welcome to Food Recipe Blog')
})





app.listen(5000,() => {
    console.log('Server is live on port 5000')
})