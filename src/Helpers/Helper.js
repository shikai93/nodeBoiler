function ParseString(optionalString) {
    if (typeof optionalString === "string" && optionalString !== "") {
        return optionalString
    } else {
        return "not a string"
    }
}

function ParseFunction(optionalFunction) {
    if (optionalFunction instanceof Function) {
        return optionalFunction
    } else {
        return () => {}
    }
}

function JSDateToHTMLDateString(JSDate) {
    if (JSDate === undefined || !JSDate.getFullYear) {
        return ""
    }
    var datestring = JSDate.getFullYear()+'-'+ ("0"+(JSDate.getMonth()+1)).slice(-2) +'-'+ ("0" + JSDate.getDate()).slice(-2)
    return datestring
}
export {JSDateToHTMLDateString, ParseString, ParseFunction};