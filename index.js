const { __routes } = require('Router');
var express = require('express')
var bodyParser = require('body-parser')

var app = express();

var user=require("./routes/rout.js")

app.use(bodyParser.json())

app.use('/users',user)

app.get("/",(req,res)=>{
  res.send("hello WORLD")
})
app.listen(4000,console.log("server is listining on post 4000"))