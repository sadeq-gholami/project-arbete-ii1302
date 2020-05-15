import React from 'react';
import {Jumbotron, Container} from 'react-bootstrap';
import Styled from 'styled-components';
import techImage from '../images/tech.jpeg';

const Styles = Styled.div `
    .jumbo {
        background: url(${techImage}) no-repeat fixed bottom;
        background-size: cover;
        color:#ccc;
        height: 200px;
        position: relative;
        z-index: -2;
    }

    .overlay{
        background-color: #000;
        opacity: 0.6;
        position: absolute;
        top:0;
        right:0;
        bottom: 0;
        left: 0;
        z-index: -1;

    }
`;
const Jumbo =()=>(
    <Styles>
        <Jumbotron fluid className="jumbo">
            <div className="overlay"></div>
            <Container>
                <h1>Welcome</h1>
                <p>Here you can send message to all your displays</p>
            </Container> 
        </Jumbotron>
    </Styles>
);
export default Jumbo;