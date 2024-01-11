const mongoose = require ('mongoose');
//const connect = mongoose.connect("mongodb+srv://staysafepets:qx3CGosFbkJJEpvf@cluster0.zyrfa8z.mongodb.net")
const express = require('express');
const app = express();

const db = () => {
    mongoose.connect('mongodb+srv://staysafepets:qx3CGosFbkJJEpvf@cluster0.zyrfa8z.mongodb.net').then(() => {
        console.log("Connected to the database!");
    }).catch((err) => {
        console.log("Cannot connect to the database!", err);
    })
}

module.exports=db;