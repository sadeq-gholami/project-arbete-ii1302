const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

/* Include routes */
const message = require('./api/routes/message');
const display = require('./api/routes/display');
const login = require('./api/routes/login');

/* Connect to Mongoose */
mongoose.connect("mongodb+srv://kth10:" + 
process.env.MONGO_ATLAS_PW +
"@cluster0-wqtf8.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* Handle Mongoose connection */
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("mongoose connected!");
});

//app.use('/resources',express.static('resources'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

/* Pass routes */
app.use('/message', message);
app.use('/display', display);
app.use('/login', login);


module.exports = app;
