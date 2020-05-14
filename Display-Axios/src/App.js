
import React, { Component } from 'react';
import './App.css';
const axios = require('axios');


class App extends Component{
  constructor(props){
    super(props);
    this.state={
      text: "",
      currenttime:new Date().toLocaleString().slice(12.0),
      senttime:"",
      displaylink:"https://iot-display.herokuapp.com/display/get/",
      displayid: ""
      
    }
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    },this.checkFields);
  };


componentWillMount(){
setInterval(() => {
  getu(this.state.displaylink + this.state.displayid)
  var test = stateModule.getState();
 
  if(test!==this.state.text&& test!== undefined){
    var event = {
      target: {
        name: "senttime",
        value: new Date().toLocaleString().slice(12.0)
      }
    };
    this.handleChange(event)

  }

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

  handlechange=(e)=>{
    this.setState({displayid:e.target.value})

}
handleSubmitbtn=(e)=>{
  this.setState({text:"Connecting to Display"})
  console.log("hej")
}
onKeyPress(event) {
  if (event.which === 13 /* Enter */) {
    event.preventDefault();
  }
}
    
render(){
  
  return (
    <div className="App">
      <header className="App-header">

                <h5>Enter Diplay ID</h5>
               < form onKeyPress={this.onKeyPress}>
                    <input id="input" onChange ={ this.handlechange} 
                        value={this.state.displayid}
                        placeholder="Enter ID"
                        type="text"/>
                        <button type ="button" onClick={e=>this.handleSubmitbtn()} className="send"> 
                        <img  width="35"
                            src ={ require('./pictures/search.png')}
                            alt ={"could not load"}/>
                        </button>
                        </form>
                        
            
      




        <div className="screen">
        <div className = "text ">
          <p></p> 
        <div id="text">{this.state.text}</div>
        </div>
        <div className = "currenttime ">
        <p>Current Time</p> 
          <div id="">{this.state.currenttime}
          </div>
          </div>
        <div className = "senttime ">
        <p>Recieved Time</p> 
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


const getu = async url => {
  try {
    const response = await axios.get(url);
      var  myData = myData = response.data.display.message.text;
      stateModule.changeState(myData)
  } catch (error) {
    console.error(error);
  }
};

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




