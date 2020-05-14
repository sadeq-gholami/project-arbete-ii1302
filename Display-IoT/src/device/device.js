
var iotf = require('ibmiotf');

//onst axios = require('axios');
class Device {
  constructor(org, token) {
    const device_config = {
      "org": org,
      "domain": "internetofthings.ibmcloud.com",
      "type": "IBM-KTH",
      "id": "0",
      "auth-method": "token",
      "auth-token": token,
      "use-client-certs": false
    };
    this.device = new iotf.IotfManagedDevice(device_config);
    this._setup();
  }
  
  Push(id) {
    this.device.publishHTTPS(id, 'json', JSON.stringify('Any new messages?'), 0);
  }

 getMessage(){
   return stateModule.getState();
 }


  _setup(){
    var that = this;

    /* Connect it to Watson IoT! */
    this.device.connect();

    /* When your device has connected, setup listeners and callbacks. */
    this.device.on('connect', function(parent){
      that.device_connected = true;  

      /* If the device disconnects, we do not need to panic. */
      that.device.on('disconnect', function(){
        that.device_connected = false;
        console.log('Disconnected');
      });
      
      /* Errors are pretty bad, right? */
      that.device.on('error', function (argument) {
        console.log(argument);
        process.exit(1);
      });
    });

      /* When a command is recieved execute code */
      that.device.on("command", function (commandName,format,payload,topic) {
        if(commandName === "currentMessage") {
            console.log(commandName + ':'); 
            console.log(JSON.parse(payload))
            stateModule.changeState(JSON.parse(payload));
        } else {
            console.log("Command not supported.. " + commandName);
        }
    });
  }
  
  IsConnected() {
    return this.device_connected;
  }
  
}


var stateModule = (function () {
  var state; // Private Variable

  var pub = {};// public object - returned at end of module

  pub.changeState = function (newstate) {
      state = newstate;
  };

  pub.getState = function() {
      return state;
  }

  return pub; // expose externally
}());

module.exports = Device;


