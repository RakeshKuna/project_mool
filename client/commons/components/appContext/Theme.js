export default class Theme {
  constructor(theme) {
    this.theme = theme
    this.subscriptions = []
  }

  setTheme(theme) {
    this.theme = theme
    this.subscriptions.forEach(f => f())
  }

  subscribe(f) {
    this.subscriptions.push(f)
  }
}
