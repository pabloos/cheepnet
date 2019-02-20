import { GraphModel } from './GraphModel.js'
import { GraphView } from './GraphView.js'
import { GraphController } from './GraphController.js'

window.onload = () => {
  const WS_URL = 'ws://localhost:8080'

  const sendButton = document.querySelector('form > input[type=button]')
  const textInput = document.querySelector('form > input[type=text]')

  const model = new GraphModel()
  const view = new GraphView(model, sendButton, textInput)
  const websocket = new WebSocket(WS_URL)

  const controller = new GraphController(model, view, websocket)
}
