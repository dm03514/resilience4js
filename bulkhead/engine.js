

class Bulkhead {
    constructor(maxConcurrentCalls) {
        this.maxConcurrentCalls = maxConcurrentCalls;
        this.availableCalls = this.maxConcurrentCalls;
    }

    decoratePromise(fn) {
        return () => {
            if (this.availableCalls < 1) {
                return new Promise((_, reject) => {
                    reject(new Error('no available calls'));
                });
            }
            // remove the call and return the function
            this.availableCalls = this.availableCalls - 1;

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
