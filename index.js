'use strict';

var store = require('store');
var Promise = require('promise');
var escape = require('escape-html');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var serverStartTime = Math.floor(new Date() / 1);

// [START initialize]
// Initialize the app with a service account, granting admin privileges
// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyDKKFPMo4rj0lYzKL6Ou0-VFa-rpCoLvc8",
//   authDomain: "pattern-school.firebaseapp.com",
//   databaseURL: "https://pattern-school.firebaseio.com",
//   projectId: "pattern-school",
//   storageBucket: "pattern-school.appspot.com",
//   messagingSenderId: "66163373231"
// };
// firebase.initializeApp(config);
// [END initialize]

// Set our simple Express server to serve up our front-end files
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/creations', function(request, response) {
  var items = store.get('items')!=undefined ? store.get('items') : [];
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(items)); 
});

app.post("/create", function (request, response) {
  var requiredFields = ['speed', 'spacing', 'size', 'angle', 'colorScale', 'rotation'];
  var shouldSave = true;
  var items = store.get('items')!=undefined ? store.get('items') : [];
  var item = {
    query: {},
    timestamp: new Date().getTime()
  };
  for(var i=0; i<requiredFields.length; i++) {
    var field = request.body[requiredFields[i]];
    if( field == undefined || isNaN(field)) {
      shouldSave = false;
    } else {
      item.query[requiredFields[i]] = field;
    }
  }
  
  if(shouldSave) {
    items.push(item);
    store.set('items', items);
  }
  
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(items));    
    
});

app.post("/clear", function(request, response) {
  store.clearAll();
  var items = store.get('items')!=undefined ? store.get('items') : [];
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(items));    
});



// Listen for HTTP requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});