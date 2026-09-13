import React, { useEffect, useRef, useState } from 'react';
import { NetworkNode, NetworkLink, BiologicalNetworkData } from '../../types';
import { Filter, Layers, Maximize2, Move, RefreshCw, ZoomIn, ZoomOut, Activity } from 'lucide-react';

interface NetworkCanvasProps {
  data: BiologicalNetworkData;
  onSelectNode?: (node: NetworkNode) => void;
  selectedNodeId?: string;
  height?: string;
}

export const BiologicalNetworkCanvas: React.FC<NetworkCanvasProps> = ({
  data,
  onSelectNode,
  selectedNodeId,
  height = '500px',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node positions initialized in layout
  const positionsRef = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  // Setup layout positions
  useEffect(() => {
    const width = 800;
    const height = 500;
    const positions = new Map<string, { x: number; y: number; vx: number; vy: number }>();

    data.nodes.forEach((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const radius = node.type === 'disease' ? 20 : node.type === 'target' ? 120 : node.type === 'pathway' ? 200 : 260;
      const x = width / 2 + radius * Math.cos(angle) + (Math.random() - 0.5) * 40;
      const y = height / 2 + radius * Math.sin(angle) + (Math.random() - 0.5) * 40;
      positions.set(node.id, { x, y, vx: 0, vy: 0 });
    });

    positionsRef.current = positions;
  }, [data]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const positions = positionsRef.current;

      // Draw Edges
      data.links.forEach((link) => {
        const p1 = positions.get(link.source);
        const p2 = positions.get(link.target);
        if (!p1 || !p2) return;

        // Skip if filtered out
        const node1 = data.nodes.find((n) => n.id === link.source);
        const node2 = data.nodes.find((n) => n.id === link.target);
        if (activeFilter !== 'ALL' && node1?.type !== activeFilter && node2?.type !== activeFilter) {
          return;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle =
          link.evidenceType === 'experimental'
            ? 'rgba(16, 185, 129, 0.4)'
            : 'rgba(34, 211, 238, 0.25)';
        ctx.lineWidth = Math.max(1, link.confidenceScore * 2.5);
        ctx.stroke();
      });

      // Draw Nodes
      data.nodes.forEach((node) => {
        const pos = positions.get(node.id);
        if (!pos) return;

        if (activeFilter !== 'ALL' && node.type !== activeFilter) {
          return;
        }

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const radius = isSelected || isHovered ? node.val + 4 : node.val;

        // Draw Glow
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 6, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }

        // Draw Node Body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#38BDF8';
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.strokeStyle = isSelected ? '#FFFFFF' : '#0F172A';
        ctx.stroke();

        // Draw Node Label
        ctx.font = `${isSelected ? 'bold ' : ''}11px JetBrains Mono, monospace`;
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + radius + 12);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [data, hoveredNode, selectedNodeId, activeFilter, zoom, offset]);

  // Handle Mouse Events for Pan and Node Click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Transform mouse coordinates into canvas world space
    const worldX = (clientX - (canvas.width / 2 + offset.x)) / zoom + canvas.width / 2;
    const worldY = (clientY - (canvas.height / 2 + offset.y)) / zoom + canvas.height / 2;

    let found: NetworkNode | null = null;
    data.nodes.forEach((node) => {
      const pos = positionsRef.current.get(node.id);
      if (!pos) return;
      const dist = Math.hypot(worldX - pos.x, worldY - pos.y);
      if (dist <= node.val + 6) {
        found = node;
      }
    });

    setHoveredNode(found);
    canvas.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-slate-800 flex flex-col relative">
      {/* Network Header Controls */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100">Biological Multi-Partite Graph</span>
          <span className="text-slate-400">
            ({data.summary.totalNodes} nodes, {data.summary.totalEdges} interactions)
          </span>
        </div>

        {/* Node Type Filters */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'target', 'gene', 'pathway', 'drug'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors ${
                activeFilter === type
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full bg-[#070B14]" style={{ height }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        />

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="p-1.5 rounded hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 rounded hover:bg-slate-800"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Evidence Badge */}
        {hoveredNode && (
          <div className="absolute top-3 left-3 p-3 rounded-xl glass-panel-glow border border-cyan-400/40 text-xs font-mono space-y-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
              <span className="font-bold text-slate-100">{hoveredNode.label}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] uppercase bg-slate-800 text-slate-300">
                {hoveredNode.type}
              </span>
            </div>
            <div className="text-slate-400">
              Degree: <strong className="text-cyan-300">{hoveredNode.degree}</strong> | PageRank: <strong className="text-emerald-300">{hoveredNode.pagerank.toFixed(3)}</strong>
            </div>
            <div className="text-[11px] text-slate-400">Click node to inspect deep evidence chain</div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Disease
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Prioritized Target
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Gene
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Pathway
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Repurposed Drug
          </span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Modularity: <strong className="text-slate-200">{data.summary.modularity}</strong>
        </div>
      </div>
    </div>
  );
};
