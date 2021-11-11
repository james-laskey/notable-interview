const express = require("express")
var React = require('react')
var ReactDOM = require('react-dom');
var bodyParser = require('body-parser')
let  app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }))
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('src'));
const PORT = process.env.PORT || 3000
var server = app.listen(PORT || 3000, function() {
  console.log("listening on port number %d", server.address().port);
});
const {Pool, Client} = require('pg');
const connectionString = 'postgres://ahukvvyknoxzpt:04a89c236f2629882d4d3d0f1f99a1e247872654f5c3adc6d5338c071c4ffaf6@ec2-44-199-40-188.compute-1.amazonaws.com:5432/de41q0ab073dfn'
const client = new Client({
  connectionString: connectionString,
   ssl: {require:true, rejectUnauthorized: false },
})
try {
    client.connect()
} catch(er){
    console.log('db error')
}

app.get('/', (req, res) => res.sendFile(__dirname+"/src/index.html"));
app.get('/getPhysicians', function(req,res){
   client.query("SELECT * FROM scheduler.physician",function(err, results){
    if(err){
        console.log(err)
        res.send({physicians:false})
    } else{
        res.send({physicians:results.rows})
    }
   })
})
app.get('/getAppointments', function(req,res){
   var pid = req.query.pid
   client.query("SELECT * FROM scheduler.appointments WHERE pid='"+pid+"'",function(err, results){
    if(err){
        console.log(err)
        res.send({appointments:false})
    } else{
        res.send({appointments:results.rows})
    }
   })
})