class Link {
  constructor (source, target) { // strings, not objects
    [this.source, this.target, this.value] = [source, target, Math.random()]
  }
}
