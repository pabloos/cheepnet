import { EventEmitter } from './eventEmitter.js'

const width = window.innerWidth
const height = window.innerHeight

var simulation

export class GraphView extends EventEmitter {
  constructor (model, sendButton, textInput) {
    super()

    this.model = model.on('graphComplete', () => this.buildGraph())

    sendButton.addEventListener('click', () => this.emit('sendButtonClicked'))
    textInput.addEventListener('input', () => this.model.setUsername(textInput.value))

    this.svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', 'grey')
      .call(
        d3.zoom().on('zoom', () => this.svg.attr('transform', d3.event.transform))
      )

    this.tooltip = d3.select('body').append('div').attr('class', 'tooltip')

    this.color = d3.scaleOrdinal(d3.schemeCategory20)
  }

  buildGraph () {
    simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.screen_name))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2)) // esto es donde esta el centro

    let link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.model.links)
      .enter()
      .append('line')
      .attr('stroke-width', d => Math.sqrt(d.id)) // value

    let node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.model.nodes)
      .enter()
      .append('g')

    let circles = node.append('circle')
      .attr('r', 5)
      .attr('fill', d => this.color(d.group))
      .call(
        d3.drag()
          .on('start', this.dragstarted)
          .on('drag', dragged)
          .on('end', this.dragended)
      )

      .on('mouseover', d => {
        this.tooltip.transition().duration(200).style('opacity', 0.9)

        this.tooltip.html(getUserCard(d))
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY - 28}px`)
      })

      .on('mouseout', d => this.tooltip.transition().duration(500).style('opacity', 0))

    let lables = node.append('text')
      .text(d => d.name)
      .attr('x', -30)
      .attr('y', 15)

    node.append('title').text(d => d.name)

    simulation.nodes(this.model.nodes).on('tick', ticked)

    simulation.force('link').links(this.model.links)

    function ticked () {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    }
  }

  dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()

    d.fx = d.x
    d.fy = d.y
  }

  dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0)

    d.fx = null
    d.fy = null
  }
}

function getUserCard (data) {
  return `${'<div class=\'card\' style=\'width:18rem;\'><img class=\'card-img-top\' src="" alt=\'Card image cap\'> <div class=\'card-body0\'>' +
  '<h5 class=\'card-title\'>'}${data.id}${'</h5><p class=\'card-text\'>Some quick example text to build on the card title and make up the bulk of the card\'s content.</p> <a href=\'#\' class=\'btn btn-primary\'>'}${data.id}</a> </div> </div>`
}

function dragged (d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}
