class Cache {
  constructor (client) {
    this.client = client

    this.client.on('connect', () => {
      console.log('Redis client connected')
    })

    this.client.on('error', (err) => {
      console.log('Something went wrong ' + err)
    })
  }

  saveFollowerID (followerId) {
    this.client.sadd('followers', followerId, (error, result) => {
      if (error) {
        console.log(error)
        throw error
      }

      console.log('Add result ->' + result)
    })
  }

  saveFollowerObject (followerId, follower) {
    this.client.set(followerId, follower)
  }

  existID (followerId) {
    this.client.sismember('followers', followerId, (error, result) => {
      if (error) throw error

      if (result == '1') {

      } else {

      }
    })
  }

  getFollower (followerId) {
    this.client.get(followerId)
  }
}

module.exports = Cache
