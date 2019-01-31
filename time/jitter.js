

class Jitter {
    constructor(decorated, minMS, maxMS) {
        this.minMS = minMS;
        this.maxMS = maxMS;
        this.decorated = decorated;
    }

    timeout() {
        this.decorated() + this.MS();
    }

    MS() {
        return 0
    }
}