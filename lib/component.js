var request = require("request");
var Q = require("q");
var messages = require('./messages.js');

exports.simpleHttpRequestComponent = simpleHttpRequestComponent;

function simpleHttpRequestComponent(method, requestOptions, handleResponse) {
    var self = this;

    Q.nfcall(request[method], requestOptions)
        .then(transformArrayToObject)
        .then(handleResponse)
        .then(emitMessage)
        .fail(handleError)
        .done(done);

    function transformArrayToObject(output) {
        return Q({
            response : output[0],
            body : output[1]
        });
    }

    function emitMessage(msg) {
        self.emit('data', msg);
    }

    function handleError(err) {
        console.log(err);
        self.emit('error', err);
    }

    function done() {
        self.emit('end');
    }
}