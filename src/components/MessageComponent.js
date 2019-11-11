import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

class MessageComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div class="container">
                <div class="card-deck mb-3 text-center">
                    <div class="loveNoteCard card mb-4 box-shadow">
                        <div class="card-header">Latest Note</div>
                        <div class="loveNoteCardBody card-body d-flex flex-column">
                            <span class="loveNoteCardSpan">Body</span>
                            <Button className="heartButton mt-auto" size="lg" block>
                                <img className="heartImg" src="/purple-heart.png" alt="purple heart"></img>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageComponent;

