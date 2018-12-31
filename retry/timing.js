

class FixedInterval {
    constructor(intervalMS) {
        this.intervalMS = intervalMS;
    }

    timeout() {
        return this.intervalMS;
    }

    New() {
        return this;
    }
}

module.exports = {
    FixedInterval: {
        New: (intervalMS) => {
            return new FixedInterval(intervalMS);
        }
    }
}