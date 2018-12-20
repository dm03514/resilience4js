const assert = require('assert');
const Bulkhead = require('../../bulkhead/engine.js').Bulkhead;


const hiFn = () => {
    return new Promise((resolve, _) => {
        resolve('hello');
    });
};

describe('Bulkhead', () => {
    it('throws error when maxConcurrentCalls is reached', () => {
        const bulkhead = new Bulkhead('global', 0);

        let wrapped = bulkhead.decoratePromise(hiFn);

        return wrapped()
        .catch((err) => {
            assert.equal('no available calls', err.message);
        });
    });

    it('resets calls when promise is complete', () => {
        const bulkhead = new Bulkhead('global', 1);
        let wrapped = bulkhead.decoratePromise(hiFn);

        return wrapped()
        .then(() => {
            assert.equal(1, bulkhead.availableConcurrentCalls())
        });
    });
});
