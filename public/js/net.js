var simulation

function newGraph (data, numFollowers) {
  let div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'grey')
    .call(
      d3.zoom().on('zoom', () => {
        svg.attr('transform', d3.event.transform)
      })
    )

  const color = d3.scaleOrdinal(d3.schemeCategory20)

  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => d.id))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2)) // esto es donde esta el centro

  let link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke-width', (d) => Math.sqrt(d.id)) // value

  let node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(data.nodes)
    .enter()
    .append('g')

  let circles = node.append('circle')
    .attr('r', 5)
    .attr('fill', (d) => color(d.group))
    .call(
      d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    )

    .on('mouseover', (d) => {
      // console.log(d.id)

      div.transition()
        .duration(200)
        .style('opacity', 0.9)

      div.html(getUserCard(d))
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY - 28}px`)
    })

    .on('mouseout', (d) => {
      div.transition()
        .duration(500)
        .style('opacity', 0)
    })

  let lables = node.append('text')
    .text((d) => d.name)
    .attr('x', -30)
    .attr('y', 15)

  node.append('title').text((d) => d.name)

  simulation.nodes(data.nodes).on('tick', ticked)

  simulation.force('link').links(data.links)

  function ticked () {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    node.attr('transform', (d) => `translate(${d.x},${d.y})`)
  }
}
