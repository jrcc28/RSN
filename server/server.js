const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// app.use use middlewares
// Global routes config:
app.use(require('./routes/index'));

require('./config/config');

// Able to access public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Connection to DB
// useNew, useCreate y demas se debe quedar.
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, resp) => {
        if (err) throw Error;

        console.log(`Connection to MongoDB Up!!`);
    });

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})