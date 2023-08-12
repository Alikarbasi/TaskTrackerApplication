const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const Category = require('../models/category');
const passport = require('passport');

function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', IsLoggedIn, (req, res, next) => {
    const selectedCategory = req.query.category;

    Task.find(selectedCategory ? { category: selectedCategory } : {})
        .exec((err, tasks) => {
            if (err) {
                console.log(err);
                return res.redirect('/');
            }

        Category.find().sort({ name: -1 }).exec((errCategories, categories) => {
            if (errCategories) {
                console.log(errCategories);
                return res.redirect('/');
            }

            res.render('tasks/index', {
                title: 'Tasks',
                dataset: tasks,
                categories: categories,
                user: req.user
            });
        });
    });
});



router.get('/add', IsLoggedIn,(req,res,next)=>{
    // Get list of categories
    Category.find((err, categories) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('tasks/add', { title: 'Add a New Task', categories: categories, user: req.user });
        }
    }).sort({ name: -1 });
});

router.post('/add', IsLoggedIn,(req,res,next)=>{
    
    Task.create({
        date: req.body.date,
        category: req.body.category,
        name: req.body.name,
        duration: {
            hours : req.body.hours,
        minutes: req.body.minutes},
        comment: req.body.comment
    }, (err, newTask) => {
        if (err) {
            console.log(err);
        }
        else {
            // We can show a successful message by redirecting them to index
          res.redirect('/tasks');
        }
    });
   
});

// GET handler for Delete operations
// :_id is a placeholder for naming whatever is after the / in the path
router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
    // call remove method and pass id as a json object
    Task.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/tasks')
        }
    })
});


router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
    // Find the Project by ID
    // Find available courses
    // Pass them to the view
    Task.findById(req.params._id, (err, task) => {
        if (err) {
            console.log(err);
        }
        else {
            Category.find((err, categories) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('tasks/edit', {
                        title: 'Edit a Task',
                        task: task,
                        categories: categories,
                        user: req.user
                    });
                }
            }).sort({ name: 1 });
        }
    });
});

// POST handler for Edit operations
router.post('/edit/:_id', IsLoggedIn, (req,res,next) => {
    // find project based on ID
    // try updating with form values
    // redirect to /Projects
   Task.findOneAndUpdate({_id: req.params._id}, {
    date: req.body.date,
    category: req.body.category,
    name: req.body.name,
    duration: {
        hours : req.body.hours,
    minutes: req.body.minutes},
    comment: req.body.comment
    }, (err, updatedProject) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/tasks');
        }
    });
});
module.exports = router
