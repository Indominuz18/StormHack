const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const ejs = require('ejs');
const cookieParser = require('cookie-parser')
const uuid = require('uuid/v4');
const { send } = require('process');


const app = express()
app.use(cookieParser());
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(express.json());

// giving data - frontend {}
// store somewhere local

// think how to receive the data 
// store the data for eg user login something
// 


app.listen(3000, function(req, res){
    console.log("Your server is up and running")
})

var sessions = {"123": 'Manmeet'}
const random_num = uuid
var user_info = {'admin': '1234', 'manmeet': '1234'};


app.post( '/api/v1/login',function(req, res){
    var username = req.body.username
    if(req.body.password == user_info[req.body.username]){
        res.send("ok")  // create a random number 
                        // sessions index the random number store the username
    }else{
        res.send("error")
    }
    user_info[username] = req.body.password
    sessions[random_num] = username
})


app.get('/api/v1/me', function(req, res){

    // username here  after that i check if the correct user is logged in 
    if(req.body.user == sessions[random_num]){    // change user here afterwards
        console.log("yes the user is same")
    }
})


var user_assignments = {
    "Manmeet":{
        "assignment- id": [
            {'1': 'cs assign'}, {'2': ' math assignmenr'}, {'3': 'node assignment'}
        ]
    }
}; 


assign_info = {}

// map the assignment ids

app.get('/api/v1/assignments/:id', function(req, res){
    if (req.body.user == sessions[random_num]){
        const id = req.params.id
        var assignment_id = {id: [] }
        user_assignments[sessions[random_num]] = 'kndkj'
    }
    // how to assign the id to the username
})

app.patch('/api/v1/assignments/:id' ,function(req, res){
    var assign_id = req.params.id;         // {id : 'jdbjdbfj'}       assignments[id] = request.body
})




app.post("/api/v1/assignments/new", function(req, res){
    const info = {}
    var assign = req.body.assignment        // the assignment info will be stored here 
    var course = assign.course
    var name = assign.name
    var dueDate = assign.dueDate
    info['course'] = course
    info['name'] = name
    info['dueDate'] = dueDate
    res.end()
})

app.get('/api/v1/assignments/for-range?from=${date}&to=${datE}', function(req, res){
    const data = {}
    const start = req.params.from
    const end = req.params.to
    data['end'] = end
    data['free'] = free
    res.send(data)
})

app.get('/api/v1/assignments/:id/sessions', function(req, res){

})


app.patch('/api/v1/assignments/:id/sessions', function(req, res){

    // res.end
})