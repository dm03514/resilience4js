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
            event: 'shouldretry',
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
        const timeout = this.timing.timeout();
        this.metrics.emit({
            event: 'attempt',
            tags: {
                strategy: 'untillimit',
                number: this.current,
            },
            value: 1,
            type: this.metrics.type.COUNTER,
            component: 'retry'
        });
        return timeout;
    }

    New() {
        return new UntilLimit(
            this.timing.New(),
            this.maxAttempts,
            this.metrics,
        );
    }
}

module.exports = {
    UntilLimit: {
        New: (timing, maxAttempts=3, metrics=null) => {
            return new UntilLimit(timing, maxAttempts, metrics);
        }
    }
}
