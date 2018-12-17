

class Bulkhead {
    constructor(maxConcurrentCalls) {
        this.maxConcurrentCalls = maxConcurrentCalls;
        this.availableCalls = this.maxConcurrentCalls;
    }

    decoratePromise(fn) {
        return () => {

            // the bulkhead is saturated reject the promise
            if (this.availableCalls < 1) {
                return new Promise((_, reject) => {
                    reject(new Error('no available calls'));
                });
            }

            // the bulkhead has capacity, record that this
            // function is now being invoked
            this.availableCalls = this.availableCalls - 1;

            // invoke the function and then free up a call
            return fn()
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
