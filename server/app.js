const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))



app.listen(3000, function(req, res){
    console.log("Your server is up and running")
})

app.get('/', function(req, res){
    res.render("home")
})