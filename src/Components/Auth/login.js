import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import {AuthContext, authenticate} from '../../Helpers/auth/auth.js'
import { Messages, MessageContext } from "../../Helpers/messages/MessageRenderer.js";
import './login.css'
class LoginPage extends React.Component { 
    constructor(props, context) {
        super(props, context)
        this.username = React.createRef(); 
        this.password = React.createRef(); 
     }
    login = (authManager,setMessages) => {
        authenticate(this.username.value, this.password.value, authManager,
            (success) => {
                if (success) {
                    var path = undefined
                    if (this.props.location.state !== undefined) {
                        path = this.props.location.state.referrer
                    }
                    if (path === undefined) {
                        this.props.history.push('/')
                    } else {
                        this.props.history.push(path)
                    }
                } else {
                    setMessages([{type : "danger", message : "Error : Invalid username and password"}])
                }
            })
    }
    render(){
        return(
        <AuthContext.Consumer>
            {authManager => (
            <Container>
                <MessageContext.Consumer>
                    { ({messages, setMessages}) => {
                    return(
                    <>
                    <Messages messages={messages} setMessages ={setMessages}></Messages>
                    <Row>
                    <Col xs={12} sm = {{span: 10, offset : 1}}>
                        <Form>
                            <Form.Group controlId="username" >
                                <Form.Row>
                                    <Col xs={4} md={2}>
                                        <Form.Label>Username : </Form.Label>
                                    </Col>
                                    <Col xs={8} md={10}>
                                        <Form.Control ref={(ref) => {this.username = ref}} type="text"  placeholder="Username" autoComplete="username">
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group controlId="password" >
                                <Form.Row>
                                    <Col xs={4} md={2}>
                                        <Form.Label>Password : </Form.Label>
                                    </Col>
                                    <Col xs={8} md={10}>
                                        <Form.Control ref={(ref) => {this.password = ref}} type="password" placeholder="Password" autoComplete="current-password">
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Form>
                        <Row>
                            <Col style={{textAlign : 'right'}}>
                                <Button variant="primary" onClick={() => this.login(authManager,setMessages)} >Log In</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                    </>)}}
                </MessageContext.Consumer>
                
            </Container>
            )}
        </AuthContext.Consumer>
        )
    }
}
export default withRouter(LoginPage);