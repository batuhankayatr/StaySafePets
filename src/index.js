const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../src/config')
const registerRouter = require('./routes/auth.js');
const reservationsRouter = require('./routes/reservation.js');
const app = express();

app.use(express.json({extended : true}));


app.use( '/',registerRouter);
app.use('/', reservationsRouter);
db();
const port = 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
module.exports = app;