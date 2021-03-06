var app = require('express')();
var express = require("express")
var archiver = require('archiver');
var parser = require('body-parser');
const { generateConfig } = require('./utils')

var p = require('path');
const PORT = process.env.PORT || 3000;

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
 
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('pages/index');
});


app.get('/about', function(req, res) {
  res.render('pages/about');
});
//THANKS TO https://stackoverflow.com/questions/20107303/dynamically-create-and-stream-zip-to-client
app.post('/generate', function(req, res) {
  var zip = archiver('zip');

  zip.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  zip.on('end', function() {
    console.log('Archive wrote %d bytes', zip.pointer());
  });

  res.attachment('esp01homeassistant.zip');
  zip.pipe(res);

  var form = {
    network_name : req.body.frede,
    network_password : req.body.frede_senha,
    mqtt_server : req.body.fmqttserver,
    mqtt_port : req.body.fmqttserverport,
    mqtt_user : req.body.fmqttuser,
    mqtt_password : req.body.fmqttpass,
    mqtt_input : req.body.fMQTTQUEUEINPUT,
    mqtt_output : req.body.fMQTTQUEUEOUTPUT,
    queue_interval: req.body.fmqtt_interval,
    esp_ip : req.body.fesp_ip,
    esp_gateway : req.body.fesp_gateway,
    esp_subnet : req.body.fesp_subnet,
    esp_dns : req.body.fesp_dns

}
console.log(form)  
  zip.append(generateConfig(form), { name: 'config.h' })
  .file('files/esp01homeassistant.ino', { name: 'esp01homeassistant.ino' })
  .finalize();
});

app.listen(PORT);