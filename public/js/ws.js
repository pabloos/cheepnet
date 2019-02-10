const button = document.querySelector('form > input[type=button]')
const textInput = document.querySelector('form > input[type=text]')

let ws = new WebSocket('ws://localhost:8080')

var gnodes = []
var glinks = []

var numFollowersLeft = 99999999999
var numFollowers = 0

ws.onmessage = (WSmessage) => {
  const message = JSON.parse(WSmessage.data)

  if (message.type === 'followersNumber') { // the followers number has arrived
    numFollowersLeft = message.body
  } else if (message.type === 'count') { // a number has arrived
    numFollowers++
  } else if (message.type === 'twitterUser') {
    let us = JSON.parse(message.body)

    us.id = us.screen_name

    gnodes.push(us)
  } else if (message.type === 'user') { // a user has arrived
    message.body.id = message.body.screen_name

    gnodes.push(message.body)

    numFollowers++

    glinks.push({
      source: textInput.value,
      target: message.body.screen_name,
      value: Math.random()
    })

    console.log(message)

    console.log(message.body.screen_name)
  }

  if (numFollowers === numFollowersLeft) { // is the graph completed?
    const finalGraph = {
      nodes: gnodes,
      links: glinks
    }

    newGraph(finalGraph, numFollowers)
  }
}

button.addEventListener('click', sendUsername)

function sendUsername () {
  button.style.display = 'none'

  ws.send(textInput.value)
}
