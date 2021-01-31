const express = require('express');
const mongoose = require('mongoose');

const app = express();

// app.use use middlewares
app.use(require('./routes/user'));
require('./config/config');

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