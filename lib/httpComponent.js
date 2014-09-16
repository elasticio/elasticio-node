var request = require("request");
var Q = require("q");
var _ = require("underscore");
var messages = require('./messages.js');

exports.HttpComponent = HttpComponent;

function HttpComponent(component) {
    this.component = component;
    this.statusCodesToRebound = [];
    this.responseHandler = null;
}

HttpComponent.prototype.success = function success(responseHandler) {
    this.responseHandler = responseHandler;

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
            response: output[0],
            body: output[1]
        });
    }

    function emitMessage(msg) {
        emitter.emit('data', msg);
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
};