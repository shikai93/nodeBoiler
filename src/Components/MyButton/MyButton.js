import React from 'react';
import { withRouter } from "react-router-dom";
import { Button} from 'react-bootstrap';
import './MyButton.css';
class MyButton extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    handler = () => {
        if (this.props.onClick instanceof Function) {
            this.props.onClick()
        }
        return
    }
    render(){
        return(
            <Button className="myBtn" onClick={this.handler}>{this.props.children}</Button>
        )
    }
}
export default withRouter(MyButton);