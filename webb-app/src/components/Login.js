import React, { Component } from 'react';
import Signup from '../presentation/signup';
import ReactDOM from 'react-dom';
import '../general.css'
class Login extends Component {
    state = {  
        username: "",
        password:"",
        sesseion:''
    }
    handleUsernameChange=(e)=>{
        this.setState({username:e.target.value});
    }

    handlePasswordChange=(e)=>{
        this.setState({password:e.target.value});
    }
    displayPopup=event=>{
        event.preventDefault();
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('.bg-modal').style.display= 'flex';
    }

    closePopup = event =>{
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('.bg-modal').style.display= 'none';
    }
    handleLogin = e=>{
        e.preventDefault();
        let data = {username: this.state.username, pwd: this.state.password}
        fetch('https://iot-display.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => {
           return response.json();
        }).then(data =>{
            if (data.accepted){
                this.props.history.push(`/home/${data.session}`);
            }else {
                alert('username already taken try again');
            }
            console.log(data);
            
        }).catch(error =>{ 
            alert('username already taken try again');
            console.error('error', error)
        });
    }
    signupHandlar = event =>{
        event.preventDefault();
        let data = {username: this.state.username, pwd: this.state.password}
        fetch('https://iot-display.herokuapp.com/login/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => {
           return response.json();
        }).then(data =>{
            if (data.accepted){
                alert('successfuly created account');
                this.closePopup();
            }else {
                alert('username already taken try again');
            }
            console.log(data);
            
        }).catch(error =>{ 
            alert('username already taken try again');
            console.error('error', error)
        });
        
    }

    render() { 
        return (
            <div className="innerbox">
                 <form className ="username" onSubmit={this.handleLogin}>
                        <input  onChange ={this.handleUsernameChange} 
                            value={this.state.username}
                            placeholder="Enter username"
                            type="text"/>
                        <input  onChange ={this.handlePasswordChange} 
                            value={this.state.password}
                            placeholder="Enter passowrd..."
                            type="password"/>
                        <div>
                            <button className = "tbtn" onClick={this.handleLogin}>SIGN IN</button> 
                        </div>
                        <button className="tbtn" onClick={this.displayPopup}>Sign up</button>
                            
                    </form>
                <Signup
                    username={this.state.username}
                    password={this.state.password}
                    closePopup={this.closePopup}
                    handleUsernameChange={this.handleUsernameChange}
                    handlePasswordChange={this.handlePasswordChange}
                    signupHandlar = {this.signupHandlar}
                />

            </div> 
        );
    }
}
 
export default Login;