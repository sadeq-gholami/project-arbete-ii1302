import React, { Component } from 'react';
import{BrowserRouter as Router, Route} from "react-router-dom";
import Message from './components/message';
import About from './components/about';
import Displays from './components/displays';
import NavigationBar from './components/NavigationBar';
import Jumbo from './presentation/jumbo';
import Login from './components/Login'
class App extends Component {
  state = {  }
  render() { 
      return ( 
        <Router>
          <NavigationBar/>
          <Jumbo/>
          <Route exact path ='/' component = {Login}/>
          <Route exact path = '/home/:session' component={Displays}/>
          <Route path = '/about' component={About}/>
          <Route path = '/message/:selectedDisplay' component={Message}/>
        </Router>
    );
  }
}
 
export default App;


