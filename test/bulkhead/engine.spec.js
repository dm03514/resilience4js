const assert = require('assert');
const Bulkhead = require('../../bulkhead/engine.js');


const hiFn = () => {
    return new Promise((resolve, _) => {
        resolve('hello');
    });
};

describe('Bulkhead', () => {
    it('throws error when maxConcurrentCalls is reached', () => {
        const bulkhead = Bulkhead.New(
            'global',
            0,
            metrics=null,
            enableStatusPolling=false,
        );

        let wrapped = bulkhead.decoratePromise(hiFn);

        return wrapped()
        .catch((err) => {
            assert.equal('no available calls', err.message);
        });
    });

    it('resets calls when promise is complete', () => {
        const bulkhead = Bulkhead.New(
            'global',
            1,
            metrics=null,
            enableStatusPolling=false,
        );
        let wrapped = bulkhead.decoratePromise(hiFn);

        return wrapped()
        .then(() => {
            assert.equal(1, bulkhead.availableConcurrentCalls())
        });
    });
});
