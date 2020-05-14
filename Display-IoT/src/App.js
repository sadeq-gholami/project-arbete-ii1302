
import React, { Component } from 'react';
import './App.css';

var IoTDevice = require ('./device/device.js');

/* Edit these lines to reflect your IoT platform config. */
const ORG_ID = "cl3hm5";
const ACCESS_TOKEN = "secure_token_ibm";
var device = new IoTDevice(ORG_ID, ACCESS_TOKEN);


class App extends Component{
  constructor(props){
    super(props);
    this.state={
      text: "",
      currenttime:new Date().toLocaleString().slice(12.0),
      senttime:""

    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    },this.checkFields);
  };


componentWillMount(){
setInterval(() => {
  /* This pushes / publishes data to Watson IoT*/
  device.Push('getCurrentMessage');
  var test = device.getMessage()
  if(test!==this.state.text&& test !== undefined){
    var event = {
      target: {
        name: "senttime",
        value: new Date().toLocaleString().slice(12.0)
      }
    };
    this.handleChange(event)
  }
  console.log(test)
  console.log(device.IsConnected())
  var event = {
    target: {
      name: "text",
      value: test
    }
  };
  this.handleChange(event)
}, 10000);}

  
componentDidMount(){
  this.intervalID = setInterval(
    () => this.tick(),
    1000
  );
}

  tick() {
    var event = {
      target: {
        name: "currenttime",
        value: new Date().toLocaleString().slice(12.0)
      }
    };
    this.handleChange(event)

  }
    
render(){
  
  return (
    <div className="App">
      <header className="App-header">
     
        <div className="screen">
        <div className = "text ">
          <p>Message:</p> 
        <div id="text">{this.state.text}</div>
        </div>
        <div className = "currenttime ">
        <p>Current Time</p> 
          <div id="">{this.state.currenttime}
          </div>
          </div>
        <div className = "senttime ">
        <p>Sent Time</p> 
          <div id="">{this.state.senttime}
          </div>
          </div>
        </div>
      </header>
    </div>
  );
}
}

export default App;
