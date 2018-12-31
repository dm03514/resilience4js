const client = require('prom-client');


class Prometheus {
    constructor(metrics, client=null) {
        this.metrics = metrics;
        this.client = client || {};
    }

    surface() {
        this.metrics.subscribe(this.handleMetric.bind(this))
    }

    handleMetric(metric) {
        const metricName = metric.component + '_' + metric.event;

        switch (metric.type) {
            case this.metrics.type.COUNTER:
                this.client[metricName].inc(metric.tags, metric.value);
                break;
            case this.metrics.type.GAUGE:
                this.client[metricName].set(metric.tags, metric.value);
                break;
            case this.metrics.type.HISTOGRAM:
                this.client[metricName].observe(metric.tags, metric.value);
                break;
            default:
                throw new Error('not implemented');
        }
    }

    /*
    client(name, metric) {
        if (this.client.hasOwnProperty(name)) {
            return this.client[name]
        }

        // else lazy instantiate
    }
    */
}

module.exports = {
    Prometheus: Prometheus,
};
