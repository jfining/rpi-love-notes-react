import React, {Component} from 'react';
import './App.css';
import MessageComponent from './components/MessageComponent';
import {Navbar, Button} from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
        <>
        <Navbar className="loveNoteNavbar">
          <Navbar.Brand>
            Love Notes
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button className="historyButton">
              <span className="historySpan">{"<3 All Love Notes <3"}</span>
            </Button>
          </Navbar.Collapse>
        </Navbar>
        <MessageComponent></MessageComponent>
        </>
    );
  }
}

export default App;

