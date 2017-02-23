const uuid = require('uuid');

exports.newEmptyMessage = newEmptyMessage;
exports.newMessageWithBody = newMessageWithBody;
exports.emitData = emitData;
exports.emitError = emitError;
exports.emitEnd = emitEnd;
exports.emitSnapshot = emitSnapshot;

function newEmptyMessage() {

    const msg = {
        id: uuid.v4(),
        attachments: {},
        body: {},
        headers: {},
        metadata: {}
    };

    return msg;
}

function newMessageWithBody(body) {

    const msg = newEmptyMessage();

    msg.body = body;
    
    return msg;
}

function emitData(data) {
    this.emit('data', exports.newMessageWithBody(data));
}

function emitError(err) {
    this.emit('error', err);
}

function emitEnd() {
    this.emit('end');
}

function emitSnapshot(snapshot) {
    this.emit('snapshot', snapshot);
}
