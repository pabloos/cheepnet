class GraphController {
  constructor (model, view, websocket) {
    [this.model, this.view, this.websocket] = [model, view, websocket]

    this.view.on('sendButtonClicked', () => this.websocket.send(this.model.twitterUser))

    this.websocket.onmessage = WSmessage => {
      const message = JSON.parse(WSmessage.data)

      this.messageHandler[message.type](message)
    }

    this.messageHandler = {
      'followersNumber': message => this.model.addNumFollowers(message.body),
      'count': message => this.model.sumCounter(),
      'twitterUser': message => this.model.addNode(message.body),
      'user': message => {
        this.model.addNode(message.body)

        this.model.addLink({
          source: this.model.twitterUser,
          target: message.body.screen_name,
          value: Math.random()
        })

        this.model.sumCounter()
      }
    }
  }
}
