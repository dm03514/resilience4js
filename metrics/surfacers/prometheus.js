
class Prometheus {
    constructor(metrics, client) {
        this.metrics = metrics;
        this.client = client;
    }

    surface() {
        this.metrics.subscribe(this.handleMetric.bind(this, this.metrics, this.client))
    }

    handleMetric(metrics, client, metric) {
        const metricName = metric.component + '_' + metric.event;

        switch (metric.type) {
            case metrics.type.COUNTER:
                client[metricName].inc(metric.tags, metric.value);
                break;
            case metrics.type.GAUGE:
                client[metricName].set(metric.tags, metric.value);
                break;
            case metrics.type.HISTOGRAM:
                client[metricName].observe(metric.tags, metric.value);
                break;
            default:
                throw new Error('not implemented');
        }
    }
}

module.exports = {
    Prometheus: Prometheus,
};
