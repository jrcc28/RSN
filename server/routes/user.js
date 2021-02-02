const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const bodyParser = require('body-parser');

const User = require('../models/users');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

// MiddleWare is the second argument
app.get('/user', verifyToken, (req, res) => {
    // Now exists a property with name: user in req
    // req.user.name

    let from = req.query.from || 0; // needs validation to be a number
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ estado: true }, 'name email estado google role img') // second argument is a special condition, specified which fields we want
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Needs the same params of method find
            User.countDocuments({ estado: true }, (err, counter) => {
                res.json({
                    ok: true,
                    total: counter,
                    users
                });

            })

        });

    // res.json('Get user local');
});


app.post('/user', [verifyToken, verifyAdminRole], (req, res) => { // Create new documents
    // In postman need to use x-www-form-urlencoded
    // Get data from body in post:
    let body = req.body;

    // Create a new instance of user (Scheme)
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
            // img: body.img
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;
        // Another way is to change it in user Scheme

        res.json({
            ok: true,
            user: userDB
        });
    })
})

app.put('/user/:id', [verifyToken, verifyAdminRole], (req, res) => { // Update documents with param id
    let id = req.params.id;

    // Opt2: underscore:
    let body = _.pick(req.body, ['name', // valid fields
        'email',
        'img',
        'role',
        'estado',
    ]);

    // Option1: Don't want this fields to update:
    // delete body.password;
    // delete body.role;

    // User.findById(id, (err, userDB) => {
    //     userDB.save()
    // })

    // Can change role, password, google, state,etc...
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => { // Lost some functionality, for ex id that doesn't exists
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    })
})

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => { // Update documents
    let id = req.params.id;

    let newState = {
        estado: false
    }

    User.findByIdAndUpdate(id, newState, { new: true }, (err, userDB) => { // Lost some functionality, for ex id that doesn't exists
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    })

    // User.findByIdAndRemove(id, (err, deletedUser) => { // remove store document in DB
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!deletedUser) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 Message: 'User not found'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: deletedUser
    //     });
    // });


})

// with module.exports = {app} throw an error
module.exports = app