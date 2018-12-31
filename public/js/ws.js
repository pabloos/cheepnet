const button = document.querySelector('form > input[type=button]')
const textInput = document.querySelector('form > input[type=text]')

let ws = new WebSocket('ws://localhost:8080')

var gnodes = []
var glinks = []

var numFollowersLeft = 99999999999
var numFollowers = 0

ws.onmessage = (message) => {
  if (!isNaN(message.data)) {
    if (message.data < 0) {
      numFollowersLeft--
    } else {
      console.log('llego el numero')
      numFollowersLeft = message.data
    }
  } else {
    numFollowers++

    let data = JSON.parse(message.data)

    data.id = data.name

    console.log(data)

    gnodes.push(data)
    glinks.push({ source: textInput.value, target: data.name, value: Math.random() })

    if (numFollowers === numFollowersLeft) {
      const finalGraph = {
        nodes: gnodes,
        links: glinks
      }

      newGraph(finalGraph, numFollowers)
    }
  }
}

button.addEventListener('click', sendUsername)

function sendUsername () {
  button.style.display = 'none'

  ws.send(textInput.value)
}
