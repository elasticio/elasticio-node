var request = require("request");
var Q = require("q");
var messages = require('./messages.js');

exports.HttpComponent = HttpComponent;

function HttpComponent(component) {
    this.component = component;
    this.responseHandler = null;
}

HttpComponent.prototype.onResponse = function onResponse(responseHandler) {
    this.responseHandler = responseHandler;

    return this;
};

HttpComponent.prototype.exec = function exec(method, requestOptions) {
    if (!this.responseHandler) {
        throw new Error("Response handler is required. Please set it through HttpComponent.onResponse");
    }

    var self = this;
    var emitter = this.component;

    Q.nfcall(request[method], requestOptions)
        .then(transformArrayToObject)
        .then(self.handleResponse)
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
        emitter.emit('data', msg);
    }

    function handleError(err) {
        console.log(err);
        emitter.emit('error', err);
    }

    function done() {
        emitter.emit('end');
    }
};