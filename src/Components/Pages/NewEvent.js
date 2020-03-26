import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import { RenderForm } from "../../Helpers/FormRenderer.js"
// import {ExcelRenderer} from 'react-excel-renderer';
import "../../App.css"
class NewEvent extends React.Component { 
    constructor(props, context) {
        super(props, context)
        this.state = { 
            event : "",
            attendees : [],
            tempAttendees : [],
        }
    }
    handleDataChange(event, field=null, val=null) {
        let oldState = this.state;
        if (event !== undefined) {
            field = event.target.dataset.datafield
            val = event.target.value
        }
        switch (field) {    
            case "event" :
                oldState.event = val
                break
            case "attendees" :
                oldState.attendees = val
                break
            case "attendee" :
                var id = event.target.dataset.id
                oldState.attendees[id] = val
                break
            default :
                break
        }
        this.setState(oldState)
    }
    onFileHandler = (event)=>{
        // let fileObj = event.target.files[event.target.files.length - 1];
        // let acceptableTypes = ["application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        // if (!(acceptableTypes.includes(fileObj.type))) {
        //     alert("Please upload only csv, xls or xlsx files")
        //     return
        // }
        // ExcelRenderer(fileObj, (err, resp) => {
        //   if(err){
        //     return         
        //   }
        //   else{
        //     var newTemp = []
        //     for (var row in resp.rows) {
        //         if (resp.rows[row][0] === '') {
        //             continue
        //         }
        //         newTemp.push(resp.rows[row][0])
        //     }
        //     let oldState = this.state;
        //     oldState.tempAttendees = newTemp
        //     this.setState(oldState)
        //   }
        // });
    }
    pushTempAttendeees = () => {
        let oldState = this.state
        for (var i in oldState.tempAttendees) {
            oldState.attendees.push(oldState.tempAttendees[i])
        }
        oldState.tempAttendees = []
        this.setState(oldState)
    }
    addAttendee = () => {
        let oldState = this.state
        oldState.attendees.push("")
        this.setState(oldState) 
    }
    removeAttendee = (event) => {
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.attendees.splice(id,1)
        this.setState(oldState) 
    }
    RenderAttendees = () => {
        let attendeeElms = []
        for (var i=0; i < this.state.attendees.length; i++) {
            var name = this.state.attendees[i]
            attendeeElms.push(
                <Row key={i} className="align-items-center" style={{paddingTop : '5px', paddingBottom : '5px'}}>
                    <Col xs={{span : 6, offset : 4}} md={{span : 8,offset : 2}}>
                        <Form.Control 
                            type='text'
                            defaultValue={name}
                            data-datafield ='attendee'
                            data-id = {i}
                            onChange={this.handleDataChange.bind(this)} >
                        </Form.Control>
                    </Col>
                    <Col xs={2} style={{textAlign : "right"}}>
                        <Button data-id ={i} variant='danger' 
                            // style={{padding : '0 .4rem'}} 
                            onClick={this.removeAttendee}>x</Button>
                    </Col>
                </Row>
            )
        }
        return attendeeElms
    }
    render () {
        var formDataTop = {
            fields : [{
                label : "Event Name",
                value : this.state.event,
                type : "text",
                datafield : "event",
                onChange : this.handleDataChange.bind(this),
                options : this.state.event
            }]
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="formHeader">New Event</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={{span : 10, offset : 1}}>
                        {RenderForm(formDataTop)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={{span : 10, offset : 1}}>
                        {this.RenderAttendees()}
                        <Row>
                            <Col xs={12} style={{textAlign : "right", marginTop : '20px'}}>
                                <span style={{margin : '0 10px'}}>Add Attendee</span>
                                <Button variant="success" onClick={this.addAttendee}>+</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} style={{textAlign : "left", marginTop : "50px"}} >
                        <Row style={{padding : "10px 0px"}}><Col><input type="file" accept=".xlsx, .xls, .csv" onChange={this.onFileHandler}/></Col></Row>
                        <Row><Col>
                            <Button 
                                variant="info" 
                                onClick = {this.pushTempAttendeees}
                                disabled={this.state.tempAttendees.length === 0}>Import Attendee CSV List</Button>
                        </Col></Row>
                        <Row><Col xs={3} style={{fontSize : '0.75rem'}}>
                            <div>You can import attendees of the event as a csv file containing all the attendee's name in a single column with no headers</div>
                        </Col></Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(NewEvent);