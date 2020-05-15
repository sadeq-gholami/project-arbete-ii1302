import React, { Component } from 'react';
import {Form, Container, Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
class Displays extends Component {
    state = {
        selectedDisplay: "",
        displayName:"",
        displays:[],
        session: this.props.match.params.session
      }
    componentDidMount() {
        sessionStorage.setItem('session', this.state.session)
        let data = {session: this.state.session}
        fetch('https://iot-display.herokuapp.com/display/get/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => {
           return response.json();
        }).then(data =>{
            console.log(data.displays); 
            this.setState({displays:data.displays}) 
            if(data.displays.length > 0){
                this.setState({selectedDisplay:data.displays[0]._id})
                sessionStorage.setItem('display', this.state.selectedDisplay);
            }  
        }).catch(error =>{ 
            console.error('error', error)
        });
    }
    handlechange =(e)=>{
        this.setState({selectedDisplay: e.target.children[e.target.selectedIndex].id});
        sessionStorage.setItem('display', this.state.selectedDisplay);
    }
    handleDispNameChange= e=>{
        this.setState({displayName:e.target.value})
    }

    handleSubmit = (event) =>{
        this.props.history.push(`/message/${this.state.selectedDisplay}`)
    }

    displayPopup=event=>{
        event.preventDefault();
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('.bg-modal').style.display= 'flex';
    }
    createDisplay=event =>{
        event.preventDefault()
        let data = {name:this.state.displayName, session:this.props.match.params.session}
        fetch('https://iot-display.herokuapp.com/display/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => {
           return response.json();
        }).then(data =>{
            this.closePopup()
            window.location.reload();
            console.log(data); 
        }).catch(error =>{ 
            alert('username already taken try again');
            console.error('error', error)
        });
    }
    closePopup = event =>{
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('.bg-modal').style.display= 'none';
    }
    render() { 
        return (
            <div>
                <Container>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Select your display</Form.Label>
                            <Form.Control as="select" onChange= {this.handlechange}>
                            {this.state.displays.length > 0
                                ?this.state.displays.map(display =>{
                                return<option id={display._id} key= {display._id}>{display.name}</option>
                                })
                                :<option>no display</option>
                            }
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Button className="btn" onClick={this.handleSubmit} variant="primary">select</Button>
                    <Button  onClick= {this.displayPopup} variant="primary">create new display</Button>
                    
                    <div className={"bg-modal"}>
                        <div className={"modal-pop-up"}>
                        <div className="close"  onClick={this.closePopup}>+</div>
                            <form className ="username">
                                <input
                                    onChange ={this.handleDispNameChange} 
                                    value={this.state.displayName}
                                    placeholder="enter name..."
                                    type="text"/>
                                <button  onClick = {this.createDisplay} className={"tbtn"}>
                                        create
                                </button>   
                            </form>
                        </div>
                    </div>
                </Container>
            </div>
         );
    }
}
 
export default Displays;