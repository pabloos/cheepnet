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

        // in the follower of followers case we need to pass the follower origin as argument
        this.model.addLink(this.model.twitterUser, message.body.screen_name)

        this.model.sumCounter()
      }
    }
  }
}
