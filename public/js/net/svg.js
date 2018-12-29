var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', 'grey')
  .call(d3.zoom().on('zoom', () => {
    svg.attr('transform', d3.event.transform)
  }))
