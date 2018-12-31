const ms = require('../metrics/metrics.js');


class UntilLimit {
    constructor(timing, maxAttempts=3, metrics=null) {
        this.timing = timing;
        this.maxAttempts = maxAttempts;
        this.current = 0;
        this.metrics = metrics || ms.New();
    }

    shouldRetry(err) {
        const doRetry = this.current < this.maxAttempts;
        this.metrics.emit({
            event: 'retry',
            tags: {
                strategy: 'untillimit',
                doretry:  doRetry,
            },
            value: 1,
            type: this.metrics.type.COUNTER,
            component: 'retry',
        });
        return doRetry;
    }

    timeout() {
        this.current = this.current + 1;
        this.metrics.emit({
            event: 'call.num',
            tags: {
                strategy: 'untillimit',
            },
            value: this.current,
            type: this.metrics.type.GAUGE,
            component: 'retry'
        });
        const timeout = this.timing.timeout();
        this.metrics.emit({
            event: 'timeout',
            tags: {
                strategy: 'untillimit',
            },
            value: this.current,
            type: this.metrics.type.GAUGE,
            component: 'retry'
        });
        return timeout;
    }

    New() {
        return new UntilLimit(this.timing.New(), this.maxAttempts);
    }
}

module.exports = {
    UntilLimit: {
        New: (timing, maxAttempts=3) => {
            return new UntilLimit(timing, maxAttempts);
        }
    }
}