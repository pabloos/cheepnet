class GraphController {
  constructor (model, view, websocket) {
    this.model = model
    this.view = view

    this.view.on('sendButtonClicked', () => this.websocket.send(this.textInput.value))

    this.websocket = websocket

    this.websocket.onmessage = (WSmessage) => {
      const message = JSON.parse(WSmessage.data)

      this.messageHandler[message.type](message)
    }

    this.textInput = document.querySelector('form > input[type=text]')

    this.messageHandler = {
      'followersNumber': (message) => this.model.addNumFollowers(message.body),
      'count': (message) => this.model.sumCounter(),
      'twitterUser': (message) => {
        let us = JSON.parse(message.body)

        us.id = us.screen_name

        this.model.addNode(us)
      },
      'user': (message) => {
        message.body.id = message.body.screen_name

        this.model.addNode(message.body)

        this.model.addLink({
          source: this.textInput.value,
          target: message.body.screen_name,
          value: Math.random()
        })

        this.model.sumCounter()
      }
    }
  }
}
