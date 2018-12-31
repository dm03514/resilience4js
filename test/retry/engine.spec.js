const assert = require('assert');
const Retry = require('../../retry/engine.js');
const Strategies = require('../../retry/strategies.js');
const Timing = require('../../retry/timing.js');


const failingFn = (msg) => {
    return new Promise((_, reject) => {
        reject(new Error(msg + '_failure'));
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
        const {fn, strategy} = retrier.decoratePromise(failingFn);
        return fn('original')
        .catch((err) => {
            assert.equal('original_failure', err.message);
        })
        .finally(()  => {
            // assert that current
            assert.equal(3, strategy.current);
        });
    });

});
