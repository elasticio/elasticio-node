# HttpComponent example

````js
var api = require('elasticio-node-api');
var HttpComponent = api.HttpComponent;
var messages = api.messages;

exports.process = doProcess;

function doProcess(msg, cfg) {

    var options = {
        url: 'http://foobarbazbarney.com/api',
        json: true
    };
    
    function handleResponse(response, body) {
        return messages.newMessageWithBody(body);
    }
    
    new HttpComponent(this).success(handleResponse).get(options); 
}
````
