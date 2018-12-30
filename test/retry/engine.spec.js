const assert = require('assert');
const Retry = require('../../retry/engine.js');
const Strategies = require('../../retry/strategies.js');
const Timing = require('../../retry/timing.js');


const failingFn = () => {
    return new Promise((_, reject) => {
        reject(new Error('original_failure'));
    });
};


describe('Retry', () => {
    it('retries until failure', () => {
        const retrier = Retry.New(
            'test',
            Strategies.UntilLimit.New(
               Timing.FixedInterval.New(100),
                3
            )
        );
        const wrappedFn = retrier.decoratePromise(failingFn);
        return wrappedFn()
        .catch((err) => {
            assert.equal('original_failure', err.message);
        })
        .finally(()  => {
            // assert that current
        })
    });

});
