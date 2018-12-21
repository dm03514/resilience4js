
class StatsDSurfacer {
    constructor(metrics, client) {
        this.metrics = metrics;
        this.client = client;
    }

    surface() {
        this.metrics.subscribe(this.handleMetric.bind(this, this.metrics, this.client))
    }

    handleMetric(metrics, client, metric) {
        switch (metric.type) {
            case metrics.type.COUNTER:
                client.increment(
                    metric.component + '.' + metric.event,
                    metric.tags);
                break;
            default:
                throw new Error('not implemented');
        }
    }
}


module.exports = {
    StatsDSurfacer: StatsDSurfacer,
};
