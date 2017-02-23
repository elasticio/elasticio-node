const events = require("events");
const StreamCounter = require('stream-counter');
const util = require("util");

const HEARTBEAT_PERIOD = 10 * 1000; // 10 secs

const HeartBeatStream = function(heartBeatEmitter) {
    if (heartBeatEmitter instanceof events.EventEmitter) {
        this.emitter = heartBeatEmitter;
    }
    events.EventEmitter.call(this);
};

util.inherits(HeartBeatStream, events.EventEmitter);

HeartBeatStream.prototype.start = function start(stream) {

    let lastHeartbeatTime = 0;

    const that = this;

    const counter = new StreamCounter();

    counter.on('progress', function() {

        const now = new Date().getTime();

        if ((now - lastHeartbeatTime) > HEARTBEAT_PERIOD) {
            console.log(counter.bytes + " bytes read so far");

            lastHeartbeatTime = now;

            if (that.emitter) {
                that.emitter.emit('heartbeat')
            }

            that.emit('heartbeat');
        }

    });

    stream.pipe(counter);
};

exports.HeartBeatStream = HeartBeatStream;