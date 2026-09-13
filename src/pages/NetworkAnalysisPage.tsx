import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Filter, Layers, Network, Sparkles, Activity } from 'lucide-react';
import { BiologicalNetworkCanvas } from '../components/network/BiologicalNetworkCanvas';
import { NodeEvidenceModal } from '../components/network/NodeEvidenceModal';
import { DEMO_NETWORK_DATA } from '../data/demoNetworks';
import { NetworkNode } from '../types';

export const NetworkAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const handleSelectNode = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 04 • NETWORK BIOLOGY
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Multi-Partite Biological Interactome Graph
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Interactive network modeling protein-protein interactions (PPI), transcriptional regulation,
            Reactome pathway memberships, and small-molecule target pharmacology.
          </p>
        </div>

        <button
          onClick={() => navigate('/pathways')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Pathway Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Network Canvas Workspace */}
      <BiologicalNetworkCanvas
        data={DEMO_NETWORK_DATA}
        onSelectNode={handleSelectNode}
        selectedNodeId={selectedNode?.id}
        height="540px"
      />

      {/* Centrality Rankings & Graph Summary Table */}
      <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
            Network Centrality & Bottleneck Nodes
          </h3>
          <span className="text-xs font-mono text-slate-400">Ranked by Betweenness Centrality</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-2.5">Node Label</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Degree</th>
                <th className="p-2.5">Betweenness</th>
                <th className="p-2.5">Closeness</th>
                <th className="p-2.5">PageRank</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {DEMO_NETWORK_DATA.nodes.map((node) => (
                <tr
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-2.5 font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    <span>{node.label}</span>
                  </td>
                  <td className="p-2.5 uppercase text-slate-400">{node.type}</td>
                  <td className="p-2.5 text-cyan-300 font-bold">{node.degree}</td>
                  <td className="p-2.5 text-emerald-300 font-bold">{node.betweenness.toFixed(2)}</td>
                  <td className="p-2.5 text-purple-300">{node.closeness.toFixed(2)}</td>
                  <td className="p-2.5 text-amber-300">{node.pagerank.toFixed(3)}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Node Evidence Detail Modal */}
      <NodeEvidenceModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};
