export default class BreadCrum {
    constructor(data) {
        this.data = data;
        this.subscriptions = []
    }

    updateBreadCrum(data) {
        this.data = data
        this.subscriptions.forEach(f => f())
    }

    subscribe(f) {
        this.subscriptions.push(f)
    }
}
