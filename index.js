'use strict'

const Twit = require('twit')
const express = require('express')
const redis = require('redis')
const WebSocket = require('ws')
const getFollowers = require('./getFollowers.js')

const wss = new WebSocket.Server({ port: 8080 })

const twitterClient = new Twit(
  {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  }
)

const webport = 80;

(async () => {
  const app = express()
  const cache = redis.createClient(6379, 'redisservice')

  app.use(express.static('public'))

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      getFollowers(message, -1, cache, ws, twitterClient)
    })
  })

  app.listen(webport, () => console.log('Serving...'))
})()
