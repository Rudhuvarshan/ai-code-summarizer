import React, { useMemo } from 'react';

const NODE_W = 180;
const NODE_H = 48;
const V_GAP = 70;
const SVG_CX = 260; // center X

// Colours per node type
const TYPE_STYLE = {
  start:    { fill: '#065f46', stroke: '#34d399', text: '#ecfdf5' }, // Emerald-800/400/50
  end:      { fill: '#064e3b', stroke: '#10b981', text: '#d1fae5' }, // Emerald-900/500/100
  decision: { fill: '#365314', stroke: '#84cc16', text: '#ecfccb' }, // Lime-900/500/100
  io:       { fill: '#134e4a', stroke: '#14b8a6', text: '#ccfbf1' }, // Teal-900/500/100
  process:  { fill: '#064e3b', stroke: '#10b981', text: '#d1fae5' }, // Emerald-900/500/100
};

const truncate = (s, max = 24) => s && s.length > max ? s.slice(0, max - 1) + '…' : (s || '');

const FlowChart = ({ chart }) => {
  // Accept both old mermaid string (fallback) and new JSON object
  const data = useMemo(() => {
    if (!chart) return null;
    if (typeof chart === 'object' && chart.nodes) return chart;
    // Unknown format — skip gracefully
    return null;
  }, [chart]);

  if (!data || !data.nodes || data.nodes.length === 0) return null;

  // ── Layout: simple top-to-bottom ──────────────────────
  const placed = {};
  const positioned = data.nodes.map((node, idx) => {
    const n = { ...node, x: SVG_CX, y: 40 + idx * (NODE_H + V_GAP) };
    placed[node.id] = n;
    return n;
  });

  const svgH = 40 + data.nodes.length * (NODE_H + V_GAP) + 20;
  const svgW = 520;
  const arrowId = 'arr';

  return (
    <div className="w-full overflow-x-auto flex justify-center bg-dark-900 rounded-xl border border-gray-700 p-4">
      <svg width={svgW} height={svgH} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10z" fill="#10b981" />
          </marker>
        </defs>

        {/* ── Edges ── */}
        {(data.edges || []).map((edge, i) => {
          const f = placed[edge.from];
          const t = placed[edge.to];
          if (!f || !t) return null;
          const x1 = f.x, y1 = f.y + NODE_H;
          const x2 = t.x, y2 = t.y;
          const my = (y1 + y2) / 2;
          return (
            <g key={i}>
              <path
                d={`M${x1} ${y1} C${x1} ${my},${x2} ${my},${x2} ${y2}`}
                stroke="#10b981" strokeWidth="2" fill="none"
                markerEnd={`url(#${arrowId})`} opacity="0.75"
              />
              {edge.label && (
                <text x={(x1 + x2) / 2 + 8} y={my - 4}
                  fill="#94a3b8" fontSize="11" fontFamily="Inter,sans-serif">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {positioned.map((node) => {
          const style = TYPE_STYLE[node.type] || TYPE_STYLE.process;
          const cx = node.x, cy = node.y + NODE_H / 2;
          const label = truncate(node.label);

          if (node.type === 'decision') {
            // Diamond
            const hw = NODE_W / 2, hh = NODE_H / 2;
            const pts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
            return (
              <g key={node.id}>
                <polygon points={pts} fill={style.fill} stroke={style.stroke} strokeWidth="2" />
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fill={style.text} fontSize="12" fontFamily="Inter,sans-serif" fontWeight="500">
                  {label}
                </text>
              </g>
            );
          }

          if (node.type === 'start' || node.type === 'end') {
            // Pill / stadium
            return (
              <g key={node.id}>
                <rect x={cx - NODE_W / 2} y={node.y} width={NODE_W} height={NODE_H}
                  rx={NODE_H / 2} fill={style.fill} stroke={style.stroke} strokeWidth="2" />
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fill={style.text} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="600">
                  {label}
                </text>
              </g>
            );
          }

          // Default rectangle
          return (
            <g key={node.id}>
              <rect x={cx - NODE_W / 2} y={node.y} width={NODE_W} height={NODE_H}
                rx="10" fill={style.fill} stroke={style.stroke} strokeWidth="2" />
              <text x={cx} y={cy + 5} textAnchor="middle"
                fill={style.text} fontSize="13" fontFamily="Inter,sans-serif" fontWeight="500">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FlowChart;
