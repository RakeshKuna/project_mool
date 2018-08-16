export default class Menu {
    constructor(menu) {
        this.menu = menu
        this.subscriptions = []
    }

    setMenu(menu) {
        this.menu = menu
        this.subscriptions.forEach(f => f())
    }

    subscribe(f) {
        this.subscriptions.push(f)
    }
}
