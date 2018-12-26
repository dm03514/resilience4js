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
            tags: {
                id: this.id
            },
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
            .finally(() => {
                this.availableCalls = this.availableCalls + 1;
            });
        }
    }

    availableConcurrentCalls() {
        return this.availableCalls;
    }

    utilizationPercentage() {
        return (this.maxConcurrentCalls - this.availableCalls) / this.maxConcurrentCalls;
    }
}

/**
 * Instantiates a bulkhead and begins emitting availableCall metrics
 * @param id
 * @param maxConcurrentCalls
 * @param metrics
 * @constructor
 */
const New = (id, maxConcurrentCalls, metrics=null, enableStatusPolling=true) => {
    const bulkhead = new Bulkhead(id, maxConcurrentCalls, metrics);
    if (enableStatusPolling) {
        setInterval(() => {
            bulkhead.metrics.emit({
                event: 'available_calls',
                tags: {
                    id: bulkhead.id,
                },
                type: bulkhead.metrics.type.GAUGE,
                value: bulkhead.availableConcurrentCalls(),
                component: 'bulkhead'
            });

            bulkhead.metrics.emit({
                event: 'max_calls',
                tags: {
                    id: bulkhead.id,
                },
                type: bulkhead.metrics.type.GAUGE,
                value: bulkhead.maxConcurrentCalls,
                component: 'bulkhead'
            });

            bulkhead.metrics.emit({
                event: 'utilization',
                tags: {
                    id: bulkhead.id,
                },
                type: bulkhead.metrics.type.GAUGE,
                value: bulkhead.utilizationPercentage(),
                component: 'bulkhead'
            })
        }, 5000);
    }
    return bulkhead;
};

module.exports = {
    New: New,
};
