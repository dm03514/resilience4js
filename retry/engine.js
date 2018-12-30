



class Retry {
    constructor(id, strategy, metrics=null) {
        this.id = id;
        this.strategy = strategy;
        this.metrics = metrics;
    }

    decoratePromise(fn) {
        const retry = this.strategy.New();

        return (...wrappedArgs) => {
            return fn(...wrappedArgs)
            .catch((err) => {

            });

            new Promise((resolve, reject) => {
                // resolved if there is no exception
            });
            while (retry.shouldRetry()) {
                fn(...wrappedArgs)
                    .catch()


                // return when finally complete
            }
            // execute the function
            fn(...wrappedArgs)
            .catch((err) => {
                if (retry.shouldRetry(err)) {
                    return new Promise((resolve, reject) => {
                        setTimetout(
                            fn.bind(null, ...wrappedArgs),
                            retry.timeout());
                    }).catch((err => {
                        if (retry.shouldRetry(err)) {
                            return new Promise((resolve, reject) => {
                                setTimetout(
                                    fn.bind(null, ...wrappedArgs),
                                    retry.timeout());
                            });
                        }
                    }))
                }
            });

            // catch any errors

            // if retry.CanRetry()
                // setTimeout(fn.bind(...wrappedArgs)
        }
    }

}
