
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
            case metrics.type.GAUGE:
                client.gauge(
                    metric.component + '.' + metric.event,
                    metric.value,
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
