import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

class MessageComponent extends Component {

    render() {
        return(
            <div className="container">
                <div className="card-deck mb-3 text-center">
                    <div className="loveNoteCard card mb-4 box-shadow">
                        <div className="loveNoteCardHeader card-header">
                            <span className="float-left">From: {this.props.message.author}</span>
                            <span className="float-right">{
                                new Date(this.props.message.timestamp).toLocaleDateString("en-US")
                                + " "
                                + new Date(this.props.message.timestamp).toLocaleTimeString("en-US")
                            }</span>
                        </div>
                        <div className="loveNoteCardBody card-body d-flex flex-column">
                            <span className="loveNoteCardSpan">{this.props.message.message}</span>
                            {this.props.message.ack ? "" :
                            <Button onClick={this.props.ackButtonClick} value={this.props.message.uuid} className="heartButton mt-auto" size="lg" block>
                                <img className="heartImg" src="/purple-heart.png" alt="purple heart"></img>
                            </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageComponent;
