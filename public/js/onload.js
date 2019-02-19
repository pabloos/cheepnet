window.onload = () => {
  const WS_URL = 'ws://localhost:8080'

  const model = new GraphModel(null)
  const view = new GraphView(model, document.querySelector('form > input[type=button]'))
  let websocket = new WebSocket(WS_URL)

  const controller = new GraphController(model, view, websocket)
}
