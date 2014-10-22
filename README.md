# The most simple HttpComponent example

The following example demonstrates the most simple component sending a GET request to a HTTP resource. This is accomplished by defining [request](https://github.com/mikeal/request) options and passing them to ``HttpComponent.get``.    

````js
var HttpComponent = require('elasticio-node').HttpComponent;

// exporting the process function to be called by elastic.io runtime
exports.process = doProcess;

function doProcess(msg, cfg) {

    // creating requestion options
    var options = {
        url: 'http://foobarbazbarney.com/api',
        json: true
    };
    
    // sending GET request with given options
    new HttpComponent(this).get(options); 
}
````

Please note that ``HttpComponent.get`` sends a HTTP GET request. The response is checked to have a status codes ``200 OK`` or ``201 Created``. If so, the response's body will be be used as component's output. Any other status code will result in an error being thrown.

# Overriding the success handler

````js
var elasticio = require('elasticio-node');
var HttpComponent = elasticio.HttpComponent;
var messages = elasticio.messages;

exports.process = doProcess;

function doProcess(msg, cfg) {

    var self = this;

    var options = {
        url: 'http://foobarbazbarney.com/api',
        json: true
    };
    
    function onSuccess(response, body) {
        
        if (response.statusCode === 400) {
            throw new Error(JSON.stringify(body));
        }
        
        return messages.newMessageWithBody(body);
    }
    
    new HttpComponent(this).success(onSuccess).get(options); 
}
````
