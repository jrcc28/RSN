const express = require('express');
const app = express();
const bodyParser = require('body-parser')

require('./config/config')

// parse application/x-www-form-urlencoded
// app.use mean middlewares
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/user', function(req, res) {
    res.json('Get user');
})

app.post('/user', function(req, res) { // Create new documents
    // In postman need to use x-www-form-urlencoded
    // Get data from body in post:
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        });
    } else {
        res.json({
            person: body
        });
    }

})

app.put('/user/:id', function(req, res) { // Update documents with param id
    let id = req.params.id;
    res.json({
        id
    });
})

app.delete('/user', function(req, res) { // Update documents
    res.json('Delete user');
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})