import React, {Component} from 'react';
import './App.css';
import MessageComponent from './components/MessageComponent';
import {Navbar, Button, Toast, Modal} from 'react-bootstrap';
import uuid from 'uuid';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      messageArray: [],
      newNote: {
        message: "",
        author: ""
      },
      statusToast: {
        show: false,
        message: ""
      },
      onNewNoteModalShow: false
    };
  }

  componentDidMount() {
    this.setState({
      isLoaded: false,
      messages: {},
      messageArray: []
    });
    fetch(process.env.REACT_APP_API_GW_URL,
      {
          method: 'GET',
          crossDomain: true,
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(res => res.json())
      .then(result => {
          let tempMessages = {};
          let tempMessageArray = [];
          result.Items.forEach(element => {
              let newMessage = {};
              Object.keys(element).forEach(function(key) {
                    if (key === "ack" || key === "timestamp") {
                      newMessage[key] = JSON.parse(element[key].S);
                    }
                    else {
                      newMessage[key] = element[key].S;
                    }
              });
              tempMessages[newMessage["uuid"]] = newMessage;
              tempMessageArray.push(newMessage);
          });
        this.setState({
          isLoaded: true,
          messages: tempMessages,
          messageArray: tempMessageArray
        });
      });
  }

  ackMessage = (event) => {
    let uuid = event.target.value;
    fetch(process.env.REACT_APP_API_GW_URL,
      {
          method: 'POST',
          crossDomain: true,
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uuid: uuid,
            message: this.state.messages[uuid].message,
            timestamp: this.state.messages[uuid].timestamp,
            ack: "true",
            author: this.state.messages[uuid].author
          })
      })
      .then(res => res.json())
      .then(result => {
        console.log(result)
      })
      .then(() =>
        this.componentDidMount()
      )
  }

  generateMessageCard = (message) => {
    return (
      <MessageComponent key={message.uuid} message={this.state.messages[message.uuid]} ackButtonClick={this.ackMessage}></MessageComponent>
    )
  }

  onNewNoteClick = () => {
    this.setState({newNoteModalShow:true})
  }

  onNewNoteSubmit = () => {
    let newUuid = uuid.v4();
    fetch(process.env.REACT_APP_API_GW_URL,
      {
          method: 'POST',
          crossDomain: true,
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uuid: newUuid,
            message: this.state.newNote.message,
            timestamp: new Date().getTime(),
            ack: "false",
            author: this.state.newNote.author
          })
      })
      .then(res => res.json())
      .then(result => {
        this.setState({
          statusToast: {show: true, message: "Added!"},
          newNote: {message: "", author: ""},
          newNoteModalShow: false})
        })
      .then(() =>
        this.componentDidMount()
      )
  }

  handleNewNoteChange = (event) => {
    let newNote = Object.assign({}, this.state.newNote);
    newNote[event.target.name] = event.target.value; 
    this.setState({newNote: newNote})
  }

  newNoteModalOnHide = () => {
    this.setState({
      newNoteModalShow: false,
      newNote: {message: "", author: ""}
    })
  }

  statusToastOnHide = () => {
    this.setState({
      statusToast: {show: false, message: ""}
    })
  }
  
  render() {
    return (
        <>
        <Modal show={this.state.statusToast.show}>
          <Toast show={this.state.statusToast.show} delay={4000} autohide onClose={this.statusToastOnHide} style={{position: "absolute", top: "25%", right: "50%"}}>
            <Toast.Header>
              <strong>New Note Status</strong>
            </Toast.Header>
            <Toast.Body>
              {this.state.statusToast.message}
            </Toast.Body>
          </Toast>
        </Modal>
        <Modal show={this.state.newNoteModalShow} onHide={this.newNoteModalOnHide}>
          <Modal.Header>
            New Note
          </Modal.Header>
          <Modal.Body>
          <label>
            Author: 
            <input type="text" name={"author"} value={this.state.newNote.author} onChange={this.handleNewNoteChange}/>
          </label>
          <label>
            Message: 
            <input type="text" name={"message"} value={this.state.newNote.message} onChange={this.handleNewNoteChange}/>
          </label>
          <Button className="newNoteSubmitButton" onClick={this.onNewNoteSubmit}>Submit</Button> 
          </Modal.Body>
        </Modal>

        <Navbar className="loveNoteNavbar">
          <Navbar.Collapse className="justify-content-end">
            <Button className="newNoteButton" onClick={this.onNewNoteClick}>
              <span className="newNoteButtonSpan">{"<3 New Note <3"}</span>
            </Button>
          </Navbar.Collapse>
        </Navbar>
        {this.state.messageArray
          .sort(function(a,b) {
            return b.timestamp - a.timestamp
          })
          .map(this.generateMessageCard)}
        </>
    );
  }
}

export default App;

