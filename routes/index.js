var express = require('express');
var router = express.Router();
var cloudant = require('../config/db').connect(function(err) {
    if (err) {
        console.log('ERROR: Router Unable to connect to Cloudant.');
        return err;
    }
});
var xlsx = require('node-xlsx');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bluemix Ambassador Program' });
});

router.get('/getEvents', function(req, res, next) {
  var workSheetsFromFile = xlsx.parse('./meetup.xlsx');
  var cities = ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary", "Edmonton", "Halifax"];
  var events = {};
  for(var i = 0; i < cities.length; i++) {
    events[cities[i]] = {};
    for(var _obj in workSheetsFromFile[i]) events[cities[i]][_obj] = workSheetsFromFile[i][_obj];
  }
  res.send(events);
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
