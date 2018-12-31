function getUserCard (data) {
  return `${'<div class=\'card\' style=\'width:18rem;\'><img class=\'card-img-top\' src="" alt=\'Card image cap\'> <div class=\'card-body0\'>' +
  '<h5 class=\'card-title\'>'}${data.id}${'</h5><p class=\'card-text\'>Some quick example text to build on the card title and make up the bulk of the card\'s content.</p> <a href=\'#\' class=\'btn btn-primary\'>'}${data.id}</a> </div> </div>`
}
