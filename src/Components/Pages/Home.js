import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button} from 'react-bootstrap'

class Home extends React.Component { 
    render() {
        return (
            <Container>
                <Row style={{marginBottom : '30px'}}>
                    <Col style={{textAlign : 'center'}}>
                        <h1>Empirecode tutor</h1>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(Home);