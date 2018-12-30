const assert = require('assert');


describe('Retry', () => {
    it('does not retry on success', () => {
        assert.equal(1, 2);
    });

});
