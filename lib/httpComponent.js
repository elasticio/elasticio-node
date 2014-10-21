var request = require("request");
var Q = require("q");
var _ = require("underscore");
var messages = require('./messages.js');

exports.HttpComponent = HttpComponent;

function HttpComponent(component) {
    this.component = component;
    this.onSuccess = null;
}

HttpComponent.prototype.success = function success(onSuccess) {
    this.onSuccess = onSuccess;

    return this;
};

HttpComponent.prototype.get = function get(requestOptions) {
    doRequest.apply(this, ['get', requestOptions]);
};

HttpComponent.prototype.put = function get(requestOptions) {
    doRequest.apply(this, ['put', requestOptions]);
};

HttpComponent.prototype.post = function get(requestOptions) {
    doRequest.apply(this, ['post', requestOptions]);
};

function doRequest(method, requestOptions) {
    if (!this.onSuccess) {
        throw new Error("Response handler is required. Please set it through HttpComponent.success");
    }

    var self = this;
    var emitter = this.component;

    Q.nfcall(request[method], requestOptions)
        .spread(self.onSuccess)
        .then(emitMessage)
        .fail(handleError)
        .done(done);

    function emitMessage(msg) {
        if (msg) {
            emitter.emit('data', msg);
        } else {
            console.log('Component produced no data');
        }
    }

    function handleError(err) {
        emitter.emit('error', err);
    }

    function done() {
        emitter.emit('end');
    }
}