var express = require('express');
var router = express.Router();
var cloudant = require('../config/db').connect(function(err) {
    if (err) {
        console.log('ERROR: Router Unable to connect to Cloudant.');
        return err;
    }
});
var xlsx = require('node-xlsx');
var fs = require('fs');
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bluemix Ambassador Program' });
});

router.get('/getEvents', function(req, res, next) {
  var date = new Date();
  var options =  { 
    method: 'GET',
    url: 'https://ibm.box.com/shared/static/o7vlt0whjpe9ualh6q13dk9wu8m2lrzc.xlsx',
    followAllRedirects: true
  };

  fs.stat('meetup.xlsx', function(err, stats) {
    if (err) {
      request(options).pipe(fs.createWriteStream('meetup.xlsx')).on("close", function() {
        console.log(Date().toString() + ": events db updated");
        sendEvents();
      });
    }
    else {
      request(options).pipe(fs.createWriteStream('meetup.xlsx')).on("close", function() {
        console.log(Date().toString() + ": events db updated");
        sendEvents();
      });// check if file is a day old, if file is old, update
    }
  });
  var sendEvents = function () {
    var meetups = xlsx.parse('meetup.xlsx');
    // build the structure we send back, add new cities to cities array as we expand
    var cities = ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary", "Edmonton", "Halifax"];
    var events = {};
    cities.forEach(function(item) {
      events[item] = [];
    })
    for(var i = date.getMonth(); i < meetups.length; i++) {
      for(var _obj in meetups[i]["data"]) {
        var city = meetups[i]["data"][_obj][5];
        if (cities.indexOf(city) != -1){
          console.log(city);
          events[city].push(meetups[i]["data"][_obj]);
        }
      }
    }
    res.send(events);
  } 
})
router.post('/', function(req, res, next) {
  // check if ambassador already made response for this event, if so, update responses
  responses = cloudant.db.use("responses");
  response = {
    _id: req.body.eventid + "_" + req.body.email
  };
  responses.get(response._id, function(err, data) {
  if (data) {
    response = data;
  }});
  for (var _obj in req.body) response[_obj] = req.body[_obj];
  responses.insert(response);

  // Update/create ambassador profile with record of submission
  ambassadors = cloudant.db.use("ambassadors");
  ambassador = {
    _id: req.body.email,
    email: req.body.email,
    attended: [],
    responses: [],
    numAttended: 0,
    numResponses: 0,
  };
  ambassadors.get(ambassador._id, function(err, data) {
    if (data) ambassador = data;
  });
  ambassador.attended.push(response.eventid);
  ambassador.responses.push(response._id);
  ambassador.numAttended++;
  ambassador.numResponses++;
  ambassadors.insert(ambassador);

  res.render('confirmed', { title: 'Bluemix Ambassador Program', message: "INSERT DB POST SUCCESS/ERROR MESSAGE HERE..."})
});

module.exports = router;
