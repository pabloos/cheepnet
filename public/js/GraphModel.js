import { EventEmitter } from './eventEmitter.js'
import { UserNode } from './userNode.js'
import { Link } from './link.js'

export class GraphModel extends EventEmitter {
  constructor (nodes, links, username) {
    super()

    [this.nodes = [], this.links = [], this.twitterUser = ''] = [nodes, links, username]

    this.linksCounter = 0
  }

  /**
   * @param {string} username
   */
  set username (username) { // defensive programing here
    this.twitterUser = removeAroba(username)
  }

  addNode (node) {
    this.nodes.push(new UserNode(node))
  }

  addLink (source, target) {
    this.links.push(new Link(source, target))
  }

  addNumFollowers (numFollowers) {
    this.numFollowers = numFollowers
  }

  sumCounter () {
    if (isGraphComplete(++this.linksCounter, this.numFollowers)) this.emit('graphComplete')
  }
}

function isGraphComplete (followersCount, totalFollowers) {
  return followersCount === totalFollowers
}

function removeAroba (name) {
  return (name.charAt(0) === '@') ? name.substr(1) : name
}
