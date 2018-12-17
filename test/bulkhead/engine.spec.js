const assert = require('assert');
const Bulkhead = require('../../bulkhead/engine.js').Bulkhead;


const hiFn = () => {
    return new Promise((resolve, _) => {
        resolve('hello');
    });
}

describe('Bulkhead', () => {
    it('throws error when maxConcurrentCalls is reached', (done) => {
        const bulkhead = new Bulkhead(0);

        let wrapped = bulkhead.decoratePromise(hiFn);

        wrapped()
        .catch((err) => {
            assert.equal('no available calls', err.message);
        })
        .finally(done);
    });

    it('resets calls when promise is complete', (done) => {
        const bulkhead = new Bulkhead(1);
        let wrapped = bulkhead.decoratePromise(hiFn);

        wrapped()
        .then(() => {
            assert.equal(1, bulkhead.availableConcurrentCalls())
        })
        .finally(done);
    });
});
