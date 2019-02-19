module.exports = getFollowers

function getFollowers (username, cursor = -1, cache, ws, twitterClient) { // -1 as default for open the first page
  twitterClient.get('users/show', { screen_name: username }, (error, user) => {
    if (error) {
      if (error.code === 88) { // 'Rate limit exceeded'
        console.log('Se ha excedido el num de usuarios que se pueden obtener')
      } else {
        throw error
      }
    }

    ws.send(JSON.stringify({
      type: 'twitterUser',
      body: JSON.stringify(user)
    }))
  })

  twitterClient.get('followers/ids', { screen_name: username, count: 5000, cursor: cursor }, (err, data) => {
    if (err) throw err

    ws.send(JSON.stringify({
      type: 'followersNumber',
      body: data.ids.length
    }))

    data.ids.forEach((followerId) => {
      cache.sismember('followers', followerId, (error, result) => {
        if (error) throw error

        if (result == '1') { // the user is cached
          cache.get(followerId, (error, user) => { // get the user object from the cache
            if (error) throw error

            console.log('follower: ' + followerId + ' is cached')

            ws.send(JSON.stringify({
              type: 'user',
              body: JSON.parse(user)
            })) // we will parse in client
          })
        } else { // the user is not cached
          twitterClient.get('users/show', { user_id: followerId }, (error, userObject) => { // get the userobject from the API
            if (error) {
              if (error.code === 50) { // error.message: 'User not found'
                console.log('Usuario: ' + followerId + ' no encontrado')

                ws.send(JSON.stringify({
                  type: 'count',
                  number: -1
                }))
              } else {
                if (error.code === 88) { // error.message: 'Rate limit exceeded'
                  console.log('Se ha excedido el num de usuarios que se pueden obtener')
                } else {
                  console.log(error)
                }
              }
            } else {
              cache.sadd('followers', followerId)
              cache.set(followerId, JSON.stringify(userObject))

              ws.send(JSON.stringify({
                type: 'user',
                body: userObject
              }))
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
