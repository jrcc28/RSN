const express = require('express');
const bodyParser = require('body-parser');

let { verifyAdminRole, verifyToken } = require('../middlewares/authentication')
let app = express();
let Category = require('../models/category')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

/**
 * Return all categories
 */
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email') // search for objectId
        // .populate('user', 'name email') // If we need to populate another scheme
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Needs the same params of method find
            Category.countDocuments({}, (err, counter) => {
                res.json({
                    ok: true,
                    total: counter,
                    categories
                });
            })
        });
});

/**
 * Return one category identified by id.
 */
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

/**
 * Create new category
 * Return an error or the new Category.
 */
app.post('/category', verifyToken, (req, res) => {
    // Get data from body in post:
    let body = req.body;

    // Create a new instance of category (Scheme)
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) { // If category wasn't created
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

/**
 * Update category
 * Receive an id value from params and data to update from body.
 */
app.put('/category/:id', verifyToken, (req, res) => {
    // Get data from body in post:
    let body = req.body;

    let id = req.params.id;

    // let data = {
    //     description: body.description,
    //     user: req.user._id
    // }

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false },
        (err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoryDB) { // If category wasn't created
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                category: categoryDB
            });

        })
})

/**
 * Delete category
 * Just an admin can delete categories.
 * The delete set status of category = false
 */
app.delete('/category/:id', [verifyAdminRole, verifyToken], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => { // Lost some functionality, for ex id that doesn't exists
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    })
})

module.exports = app