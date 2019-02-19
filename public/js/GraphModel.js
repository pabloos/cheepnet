class GraphModel extends EventEmitter {
  constructor (nodes, links, username) {
    super()

    this.twitterUser = username

    this.nodes = nodes || []
    this.links = links || []

    this.linksCounter = 0
  }

  addNode (node) {
    this.nodes.push(node)
  }

  addLink (link) {
    this.links.push(link)

    /*     function sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    await sleep(300) */
  }

  addNumFollowers (numFollowers) {
    this.numFollowers = numFollowers
  }

  sumCounter () {
    this.linksCounter++

    if (isGraphComplete(this.linksCounter, this.numFollowers)) this.emit('graphComplete')
  }
}

function isGraphComplete (followersCount, totalFollowers) {
  return followersCount === totalFollowers
}
