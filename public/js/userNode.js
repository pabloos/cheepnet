class UserNode {
  constructor ({id_str, screen_name, name, description, url, imageURL}) {
    [this.id, this.screen_name, this.name, this.description, this.URL, this.imageURL] = [id_str, screen_name, name, description, url, imageURL]
  }
}
