var express = require('express');
var router = express.Router();
var cloudant = require('../config/db').connect(function(err) {
    if (err) {
        console.log('ERROR: Router Unable to connect to Cloudant.');
        return err;
    } 
});
var xlsx = require('node-xlsx');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "Bluemix Ambassador Program"});
});

router.get('/:id', function(req, res, next) {

  res.render('event');
})

module.exports = router;
