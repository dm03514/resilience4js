const ms = require('../metrics/metrics.js');


class Retry {
    constructor(id, retryStrategy, metrics=null) {
        this.id = id;
        this.retryStrategy = retryStrategy;
        this.metrics = metrics || ms.New();
    }

    retrier(strategy, fn, ...args) {
        return fn(...args)
        .catch((err) => {
            if (strategy.shouldRetry(err)) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(
                            this.retrier(strategy, fn, ...args)
                        );
                    }, strategy.timeout());
                })
            }

            return new Promise((_, reject) => {
                reject(err)
            });
        });
    }

    decoratePromise(fn) {
        return {
            fn: (...wrappedArgs) => {
                const strategy = this.retryStrategy.New();
                return this.retrier(strategy, fn, ...wrappedArgs);
            }
        }
    }

}

module.exports = {
    New: (id, retryStrategy, metrics=null) => {
        return new Retry(id, retryStrategy, metrics);
    }
}
