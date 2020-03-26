import React from 'react';
import { withRouter } from "react-router-dom";
import { Button} from 'react-bootstrap';
import './NavigatorButton.css';
class NavigatorButton extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    navigate = () => {
        let destination = this.props.destination
        if (this.props.onClick instanceof Function) {
            this.props.onClick()
        }
        switch (destination) {
            case "home" :
                this.props.history.push("/");
                break
            case "login" :
                this.props.history.push("/login");
                break
            default :
                break
        }
        return
    }
    render(){
        return(
            <Button className="navBtn" onClick={this.navigate}>{this.props.children}</Button>
        )
    }
}
export default withRouter(NavigatorButton);