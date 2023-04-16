var app = require('express')();
var express = require("express")
var archiver = require('archiver');
var parser = require('body-parser');
const { generateConfigMQTT, generateConfigWebSocket } = require('./utils')
const PORT = process.env.PORT || 3000;

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res) {
  const generator = req.query.generator || 'mqtt'
  res.render('pages/index', {generator});
});


app.get('/about', function(req, res) {
  res.render('pages/about');
});
//THANKS TO https://stackoverflow.com/questions/20107303/dynamically-create-and-stream-zip-to-client
app.post('/generate/mqtt', function(req, res) {
  var zip = archiver('zip');

  zip.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  zip.on('end', function() {
    console.log('Archive wrote %d bytes', zip.pointer());
  });

  res.attachment('esp01_mqtt.zip');
  zip.pipe(res);

  var form = {
    network_name : req.body.network_name,
    network_password : req.body.network_password,
    mqtt_server : req.body.mqtt_server,
    mqtt_port : req.body.mqtt_port,
    mqtt_user : req.body.mqtt_user,
    mqtt_password : req.body.mqtt_password,
    mqtt_input : req.body.mqtt_queue_input,
    mqtt_output : req.body.mqtt_queue_output,
    queue_interval: req.body.mqtt_interval,
    esp_ip : req.body.network_ip,
    esp_gateway : req.body.network_gateway,
    esp_subnet : req.body.network_subnet,
    esp_dns : req.body.network_dns

}
  zip.append(generateConfigMQTT(form), { name: 'config.h' })
  .file('files/esp01_mqtt.ino', { name: 'esp01_mqtt.ino' })
  .finalize();
});

app.post('/generate/websocket', function(req, res) {
  var zip = archiver('zip');

  zip.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  zip.on('end', function() {
    console.log('Archive wrote %d bytes', zip.pointer());
  });

  res.attachment('esp01_websocket.zip');
  zip.pipe(res);

  var form = {
    network_name : req.body.network_name,
    network_password : req.body.network_password,
    socket_port: req.body.socket_port,
    esp_ip : req.body.network_ip,
    esp_gateway : req.body.network_gateway,
    esp_subnet : req.body.network_subnet,
    esp_dns : req.body.network_dns

}
  zip.append(generateConfigWebSocket(form), { name: 'config.h' })
  .file('files/esp01_websocket.ino', { name: 'esp01_websocket.ino' })
  .finalize();
});



app.listen(PORT, () =>{
  console.log("PROJECT RUNNING AT %d", PORT)
});