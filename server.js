'use strict'
const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/SeaBattle.html');
});
// app.get('/favicon.ico', function(req, res) {
// 	res.sendFile(__dirname + '/favicon.ico');
// });

app.listen(process.env.PORT || 3000, function() {
	console.log("App is running !!!");
});