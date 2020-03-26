import {ParseString, ParseFunction, JSDateToHTMLDateString} from "./Helper.js"
import React from 'react';
import { Col, Form} from 'react-bootstrap'
// optionData :
// {
//     value : string,
//     label : string
// }
function RenderOptions(fieldOptions) {
    var options = []
    if (fieldOptions instanceof Array) {
        fieldOptions.forEach((optionData,i) => {
            options.push(
                <option key={i} value={optionData.value}>{optionData.label}</option>
            )
        })
    }
    return options
}

// fieldData : 
// {
//     id : interfaceDeclaration,
//     label : string,
//     value : any,
//     type : string,
//     datafield : string,
//     onChange : function,
//     onFocus : function,
//     onBlur : function,
//     options : [optionData]
// }
function RenderFormFields(fieldsData) {
    var fieldElms = []
    if (fieldsData instanceof Array) {
        fieldsData.forEach((fieldData,i) => {
            var id = fieldData.id
            var label = fieldData.label
            var value = fieldData.value
            var type = ParseString(fieldData.type)
            var datafield = ParseString(fieldData.datafield)
            var onChange = ParseFunction(fieldData.onChange)
            var onFocus = ParseFunction(fieldData.onFocus)
            var onBlur = ParseFunction(fieldData.onBlur)
            switch (type) {
                case "select":
                    fieldElms.push(
                        <Form.Group key={i}>
                            <Form.Row>
                                <Col xs={4} md={2}>
                                    <Form.Label>{label} : </Form.Label>
                                </Col>
                                <Col xs={8} md={10}>
                                    <Form.Control as="select"
                                    defaultValue={value}
                                    data-datafield ={datafield}
                                    data-id = {id}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onChange={onChange} >
                                        {RenderOptions(fieldData.options)}
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>)
                    break;
                case "date":
                    fieldElms.push(
                        <Form.Group key={i}>
                            <Form.Row>
                                <Col xs={4} md={2}>
                                    <Form.Label>{label} : </Form.Label>
                                </Col>
                                <Col xs={8} md={10}>
                                    <Form.Control type="date" min="1990"
                                    defaultValue={JSDateToHTMLDateString(value)}
                                    data-datafield ={datafield}
                                    data-id = {id}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onChange={onChange} >
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>)
                    break;
                default:
                    fieldElms.push(
                        <Form.Group key={i}>
                            <Form.Row>
                                <Col xs={4} md={2}>
                                    <Form.Label>{label} : </Form.Label>
                                </Col>
                                <Col xs={8} md={10}>
                                    <Form.Control type={type}
                                    defaultValue={value}
                                    data-datafield ={datafield}
                                    data-id = {id}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onChange={onChange} >
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>)
                    break;
            }
        })
    }
    return fieldElms
}

function RenderForm(formData) {
    return (
        <Form>
            {RenderFormFields(formData.fields)}
        </Form>
    )
}
export {RenderForm};