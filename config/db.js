//database config for cloudant
var appEnv = require('cfenv').getAppEnv()
var Cloudant = require('cloudant')
var cloudant;
if (process.env.hasOwnProperty("VCAP_SERVICES")) {
  // Running on Bluemix. Parse out the port and host that we've been assigned.
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var host = process.env.VCAP_APP_HOST; 
  var port = process.env.VCAP_APP_PORT;

  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

  // Also parse out Cloudant settings.
  cloudant = env['cloudantNoSQLDB'][0].credentials;  
}


var user = '201e5aa1-05cb-4a9e-9237-5ac1d8263f62-bluemix',
	password = '7a0bf1cbed0e24191743cfc1e8af1c3bc112a5f99485f1580de4e5937ff646ff'

exports.connect = function(cb) {
    if (cloudant) {
        user = cloudant.username,
        password = cloudant.password
    }
    connection = Cloudant({account:user, password:password})
    if (cb) cb()
    return connection
}
