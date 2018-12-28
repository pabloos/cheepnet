'use strict'

const Twit = require('twit')
const express = require('express')
const redis = require('redis')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

// const Cache = require('./cache.js')

const webport = 80

var twitterClient = new Twit(
  {
    consumer_key: 'JXsD8Tcmy2e5QatKkPZIlSHL3',
    consumer_secret: '92UKymLUR8AUsHOBJGvfZyOPkil7A9QA6484L5bGDg2hOmZgNv',
    access_token: '2155770324-fsTnJRtolPYJiVcxuJLVz1KIceU1WdrkA0GV6Eq',
    access_token_secret: '4inWdlosKJkHrfGxgBrjS7uS7Rd6oS07UYr2upPZUTemm',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  }
)

function getFollowers (username, cursor = -1, cache, ws) { // -1 as default for open the first page
  twitterClient.get('followers/ids', { screen_name: username, count: 5000, cursor: cursor }, (err, data) => {
    if (err) throw err

    data.ids.forEach((followerId) => {
      cache.sismember('followers', followerId, (error, result) => {
        if (error) throw error

        if (result == '1') { // the user is cached
          cache.get(followerId, (error, userObject) => { // get the user object from the cache
            if (error) throw error

            // console.log('obteniendo de la cache ' + followerId)

            ws.send(JSON.stringify(userObject))
          })
        } else {
          twitterClient.get('users/show', { user_id: followerId }, (error, userObject) => { // get the userobject from the API
            if (error) {
              if (error.code === 50) { // error.message: User not found.
                console.log('Usuario: ' + followerId + ' no encontrado')
              } else {
                throw error
              }
            } else {
              // console.log('obteniendo de la api ' + followerId)

              cache.sadd('followers', followerId)
              cache.set(followerId, JSON.stringify(userObject))

              ws.send(JSON.stringify(userObject))
            }
          })
        }
      })
    })

    if (data.next_cursor !== 0) { // for pagination we need to use recursion
      getFollowers(username, data.next_cursor)
    }
  })
}

(async () => {
  /*  let cache = new Cache(redis.createClient(6379, 'cache.cheepnet.com'))

  cache.client.on('connect', () => {
    cache.saveFollowerID('000000')

    if (cache.existID('000000')) console.log('id exists')
  }) */

  const app = express()
  const cache = redis.createClient(6379, 'cache.cheepnet.com')

  app.use(express.static('public'))

  app.get('/getFollowers/:id', (req, res) => {
    wss.on('connection', (ws) => {
      getFollowers(req.params.id, -1, cache, ws)
    })
  })

  app.listen(webport, () => console.log('Serving...'))
})()
