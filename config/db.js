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


var user = '6200342e-3149-4ba6-bf0e-1e26721ad2bf-bluemix'
  , password = 'e8682a13c052aaea9d71480d93ae4aa2b41ddb026bdd91baf72641643cbcffd3'

exports.connect = function(cb) {
    if (cloudant) {
        user = cloudant.username,
        password = cloudant.password
    }
    connection = Cloudant({account:user, password:password})
    if (cb) cb()
    return connection
}