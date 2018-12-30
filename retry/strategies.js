
class UntilLimit {
    constructor(timing, maxAttempts=3) {
        this.timing = timing;
        this.maxAttempts = maxAttempts;
        this.current = 0;
    }

    shouldRetry(err) {
        return this.current < this.maxAttempts;
    }

    timeout() {
        this.current = this.current + 1;
        console.log({
            name: 'UntilLimit',
            method: 'timeout()',
            current: this.current
        });
        return this.timing.timeout();
    }

    New() {
        return new UntilLimit(this.timing, this.maxAttempts);
    }
}

module.exports = {
    UntilLimit: {
        New: (timing, maxAttempts=3) => {
            return new UntilLimit(timing, maxAttempts);
        }
    }
}