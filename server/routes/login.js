const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/users');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) { // If user doesn't exists
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) { //If password doesn't match
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect'
                }
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.SEED, { expiresIn: process.env.EXPIRES_IN })
        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});

// Google Config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let google_user = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });

    User.findOne({ email: google_user.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            })
        }

        if (userDB) {
            if (userDB.google === false) { // No authenticated with google
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Should use normal authentication '
                    }
                })
            } else { // Remake the token
                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_IN })

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else { // User with google does not exist in DB
            let user = new User();

            user.name = google_user.name;
            user.email = google_user.email;
            user.img = google_user.picture;
            user.google = true;
            user.password = ':D'

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        err
                    })
                }

                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_IN })

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });

            })
        }
    })
})

module.exports = app