const rxjs = require('rxjs');
const StatsDSurfacer = require('./surfacers/statsd.js').StatsDSurfacer;

const MetricType = Object.freeze({
    COUNTER: 'counter',
});

class Metrics {
    constructor() {
        this.observable = new rxjs.Subject();
        this.type = MetricType;
    }

    emit(metric) {
        this.observable.next(metric);
    }

    subscribe(fn) {
        return this.observable.subscribe(fn);
    }
}

module.exports = {
    New: () => new Metrics(),
    Surfacers: {
        StatsD: StatsDSurfacer
    }
};
