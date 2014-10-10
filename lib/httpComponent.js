var request = require("request");
var Q = require("q");
var _ = require("underscore");
var messages = require('./messages.js');

exports.HttpComponent = HttpComponent;

function HttpComponent(component) {
    this.component = component;
    this.statusCodesToRebound = [];
    this.handleResponse = null;
}

HttpComponent.prototype.success = function success(handleResponse) {
    this.handleResponse = handleResponse;

    return this;
};

HttpComponent.prototype.reboundOnStatusCode = function reboundOnStatusCode(statusCodes) {

    var newCodes = typeof statusCodes === 'number' ? [statusCodes] : statusCodes;

    if (!Array.isArray(newCodes)) {
        throw new Error(statusCodes + ' must be either a number or an array of numbers');
    }

    var codes = this.statusCodesToRebound.concat(newCodes);

    this.statusCodesToRebound = _.uniq(codes);

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
    if (!this.handleResponse) {
        throw new Error("Response handler is required. Please set it through HttpComponent.success");
    }

    var self = this;
    var emitter = this.component;

    Q.nfcall(request[method], requestOptions)
        .spread(self.handleResponse)
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
        console.log(err);
        var statusCode = err.statusCode;

        if (~self.statusCodesToRebound.indexOf(statusCode)) {
            emitter.emit('error', err);
        } else {
            emitter.emit('rebound', 'API responded with HTTP status code: '+statusCode);
        }

        emitter.emit('end');
    }

    function done() {
        emitter.emit('end');
    }
}