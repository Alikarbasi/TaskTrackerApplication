const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const passport = require('passport');
function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', IsLoggedIn,(req,res,next)=>{
    Category.find((err, categories)=>{
        if(err){
            console.log(err);
        }else{
            res.render('./categories/index',{title : "Categories",dataset: categories, user: req.user})
        }
    })
});
router.get('/add', IsLoggedIn,(req,res,next)=>{
    res.render('./categories/add',{title:"Add a Category"})
});

router.post('/add', IsLoggedIn,(req,res,next)=>{
    
    Category.create({

        name: req.body.name,
        icon : req.body.icon
    }, (err, newProject) => {
        if (err) {
            console.log(err);
        }
        else {
            // We can show a successful message by redirecting them to index
          res.redirect('/categories');
        }
    });
   
});

// GET handler for Delete operations
// :_id is a placeholder for naming whatever is after the / in the path
router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
    // call remove method and pass id as a json object
    Category.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/categories')
        }
    })
});
module.exports = router
