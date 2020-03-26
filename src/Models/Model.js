const axios = require('axios');

class Model {
    constructor() {
        this.apiEndPoint = "http://127.0.0.1:4001"
    }
    
    get(path, params, callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        axios
        .get(
            this.apiEndPoint + path, 
            { 
                params : params ,
                headers : {
                    'Authorization' : AuthStr
                }
            })
        .then(function (res) {
            callback(res.data, null)
            return
        }).catch(function (error) {
            callback(null, error)
            return
        });
    }
    postReq(path, body, callback){
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        axios.post(
            this.apiEndPoint + path,
            body,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : AuthStr
                }
            })
        .then(function (response) {
            if (response !== null) {
                callback(response.data, null)
                return
            }
        })
        .catch(function (error) {
            console.log(error)
            callback(null, error)
            return
        });
    }
}
export default Model;