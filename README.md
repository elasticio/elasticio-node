# The most simple HttpComponent example

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
    
    new HttpComponent(this).get(options); 
}
````

# Overriding the success handler

````js
var api = require('elasticio-node-api');
var HttpComponent = api.HttpComponent;
var messages = api.messages;

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
