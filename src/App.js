import React from 'react';
import './App.css';
import { Container, Col, Row} from 'react-bootstrap';
import {AuthProvider,AuthContext,logout} from './Helpers/auth/auth.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Messages, MessageProvider, MessageContext } from "./Helpers/messages/MessageRenderer.js";
import PrivateRoute from './Helpers/auth/privateRoute.js';
import Home from './Components/Pages/Home.js'
import LoginPage from "./Components/Auth/login.js"
import NavigatorButton from './Components/NavigatorButton/NavigatorButton.js'
import NewEvent from './Components/Pages/NewEvent';

function AccessControlButtons(authManager) {
  if (authManager.isAuthenticated) {
    return (
      <NavigatorButton destination="home" onClick={()=>{
        authManager.setAuthenticated(false);
        logout();}}>Log Out</NavigatorButton>
    )
  } else {
    return (
      <NavigatorButton destination="login">Log In</NavigatorButton>
    )
  }
}

function App() {
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <AuthProvider>
          <MessageProvider>
            <Router>
              <MessageContext.Consumer>
                { ({messages, setMessages}) => {
                  return(<Messages messages={messages} setMessages ={setMessages}></Messages>)}}
              </MessageContext.Consumer>
            <Container fluid={true}>
              <Row className="topHeader align-items-center" style={{textAlign : "left"}}>
                <Col xs={6}>
                  <h1>EmpireCode Tutor</h1>
                </Col>
                <Col xs={5} style={{textAlign : "right"}}>
                  <AuthContext.Consumer>
                    {authManager => (
                      <div>
                        {AccessControlButtons(authManager)}
                      </div>
                    )}
                  </AuthContext.Consumer>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row className="contentContainer">
                <Col>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" render={() => (
                        <LoginPage></LoginPage>
                  )}/>
                  <PrivateRoute exact path="/event/new" component={NewEvent} />
                </Col>
              </Row>
              </Container>
            </Router>
          </MessageProvider>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default App;
