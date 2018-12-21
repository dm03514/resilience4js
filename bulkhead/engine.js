const metrics = require('../metrics/metrics.js');


class Bulkhead {
    constructor(id, maxConcurrentCalls, bulkheadMetrics=null) {
        this.maxConcurrentCalls = maxConcurrentCalls;
        this.availableCalls = this.maxConcurrentCalls;
        this.id = id;
        this.metrics = bulkheadMetrics || metrics.New();
    }

    decoratePromise(fn) {
        this.metrics.emit({
            event: 'decorate',
            tags: [
                {id: this.id},
            ],
            type: this.metrics.type.COUNTER,
            value: 1,
            component: 'bulkhead'
        });

        return (...wrappedArgs) => {
            // the bulkhead is saturated reject the promise
            if (this.availableCalls < 1) {

                this.metrics.emit({
                    event: 'exhausted',
                    tags: {
                        id: this.id,
                    },
                    type: this.metrics.type.COUNTER,
                    value: 1,
                    component: 'bulkhead'
                });

                return new Promise((_, reject) => {
                    reject(new Error('no available calls'));
                });
            }

            // the bulkhead has capacity, record that this
            // function is now being invoked
            this.availableCalls = this.availableCalls - 1;

            // invoke the function and then free up a call
            return fn(...wrappedArgs)
            .then((...args) => {
                this.availableCalls = this.availableCalls + 1;

                return new Promise((resolve, _) => {
                    resolve(...args);
                });
            });
        }
    }

    availableConcurrentCalls() {
        return this.availableCalls;
    }
}

module.exports = {
    Bulkhead: Bulkhead,
};
