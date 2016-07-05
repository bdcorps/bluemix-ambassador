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


var user = '0156ba37-b7b9-4d56-a150-f84e0386479a-bluemix'
  , password = 'b311e4092a9500b8d961617223d3b236f49b6f36c198dbd2ae7922b8fa17dbb3'

exports.connect = function(cb) {
    if (cloudant) {
        user = cloudant.username,
        password = cloudant.password
    }
    connection = Cloudant({account:user, password:password})
    if (cb) cb()
    return connection
}