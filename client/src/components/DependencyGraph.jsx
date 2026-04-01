import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DependencyGraph = ({ dependencies }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!dependencies || dependencies.length === 0) return;

    const width = 600;
    const height = 400;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%')
      .style('max-height', '400px');

    // Extract nodes and links
    const nodesMap = new Map();
    dependencies.forEach(d => {
      if (!nodesMap.has(d.source)) nodesMap.set(d.source, { id: d.source });
      if (!nodesMap.has(d.target)) nodesMap.set(d.target, { id: d.target });
    });

    const nodes = Array.from(nodesMap.values());
    const links = dependencies.map(d => ({ source: d.source, target: d.target, type: d.type }));

    // Create a simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(40));

    // Define arrow markers for directed links
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#10b981')
      .attr('d', 'M0,-5L10,0L0,5');

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 15)
      .attr('fill', '#84cc16')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(drag(simulation));

    // Labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('dy', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e5e7eb')
      .style('font-size', '12px')
      .text(d => d.id);

    // Simulation tick function
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => Math.max(15, Math.min(width - 15, d.x)))
        .attr('cy', d => Math.max(15, Math.min(height - 15, d.y)));

      label
        .attr('x', d => Math.max(15, Math.min(width - 15, d.x)))
        .attr('y', d => Math.max(15, Math.min(height - 15, d.y)));
    });

    // Drag behavior for nodes
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [dependencies]);

  if (!dependencies || dependencies.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 rounded-xl bg-dark-800 border border-gray-700">
        No dependency data available to visualize.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-dark-800 border border-gray-700">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DependencyGraph;
