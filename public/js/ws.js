let button = document.querySelector('form > input[type=button]')

let ws = new WebSocket('ws://localhost:8080')

ws.onmessage = (message) => {
//   console.log(JSON.parse(message.data).name)

  let nodes = d3.select('body > svg > .nodes')

  nodes.data().append('g').append('circle')
    .attr('r', 10)
    .attr('fill', (d) => color('red'))

  nodes.append('title').text((d) => d.id)
}

button.addEventListener('click', sendUsername)

function sendUsername () {
  button.style.display = 'none'

  const textInput = document.querySelector('form > input[type=text]')

  ws.send(textInput.value)
}
