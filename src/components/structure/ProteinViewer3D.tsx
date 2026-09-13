import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Maximize2,
  RefreshCw,
  RotateCw,
  Scan,
  Sparkles,
  Layers,
  CheckCircle,
  Download,
} from 'lucide-react';
import { BindingPocket, ProteinStructureEntity } from '../../types';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface ProteinViewer3DProps {
  structure: ProteinStructureEntity | null;
  activePocket?: BindingPocket | null;
  height?: string;
  showControls?: boolean;
}

export const ProteinViewer3D: React.FC<ProteinViewer3DProps> = ({
  structure,
  activePocket,
  height = '420px',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const [renderStyle, setRenderStyle] = useState<'cartoon' | 'surface' | 'stick' | 'sphere'>('cartoon');
  const [colorScheme, setColorScheme] = useState<'spectrum' | 'chain' | 'ss' | 'element'>('spectrum');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPocketBox, setShowPocketBox] = useState(true);

  // Initialize and load structure via 3Dmol.js
  useEffect(() => {
    if (!containerRef.current || !structure) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    const initViewer = async () => {
      try {
        // Wait briefly if $3Dmol CDN is loading
        let attempts = 0;
        while (!window.$3Dmol && attempts < 20) {
          await new Promise((r) => setTimeout(r, 100));
          attempts++;
        }

        if (!window.$3Dmol) {
          throw new Error('3Dmol.js WebGL library not detected in window.');
        }

        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const viewer = window.$3Dmol.createViewer(containerRef.current, {
          backgroundColor: '#070B14',
          antialias: true,
          defaultcolors: window.$3Dmol.rasmolElementColors,
        });
        viewerRef.current = viewer;

        // Fetch PDB coordinates from RCSB PDB or AlphaFold
        const pdbId = structure.pdbId;
        const pdbUri = `https://files.rcsb.org/download/${pdbId}.pdb`;

        const res = await fetch(pdbUri);
        if (!res.ok) throw new Error(`Could not fetch PDB coordinates for ${pdbId}`);
        const pdbData = await res.text();

        if (!isMounted) return;

        viewer.addModel(pdbData, 'pdb');
        applyStyles(viewer, renderStyle, colorScheme, activePocket, showPocketBox);
        viewer.zoomTo();
        viewer.render();

        setIsLoading(false);
      } catch (err: any) {
        if (isMounted) {
          console.warn('[3Dmol Viewer Warning]', err);
          setErrorMsg(err.message || 'Unable to render WebGL PDB structure.');
          setIsLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [structure?.pdbId]);

  // Re-apply style when state changes
  useEffect(() => {
    if (viewerRef.current) {
      applyStyles(viewerRef.current, renderStyle, colorScheme, activePocket, showPocketBox);
      viewerRef.current.render();
    }
  }, [renderStyle, colorScheme, activePocket, showPocketBox]);

  const applyStyles = (
    viewer: any,
    style: string,
    color: string,
    pocket?: BindingPocket | null,
    drawBox: boolean = true
  ) => {
    if (!viewer) return;

    viewer.setStyle({}, {}); // Clear style

    // Color mapper
    let styleObj: any = {};
    if (style === 'cartoon') {
      if (color === 'spectrum') styleObj = { cartoon: { color: 'spectrum' } };
      else if (color === 'chain') styleObj = { cartoon: { colorscheme: 'chain' } };
      else if (color === 'ss') styleObj = { cartoon: { colorscheme: 'ssJmol' } };
      else styleObj = { cartoon: { color: '#22D3EE' } };
    } else if (style === 'surface') {
      styleObj = { cartoon: { color: '#0E7490' } };
      viewer.addSurface(window.$3Dmol.SurfaceType.MS, {
        opacity: 0.75,
        color: '#14B8A6',
      });
    } else if (style === 'stick') {
      styleObj = { stick: { colorscheme: 'element' } };
    } else if (style === 'sphere') {
      styleObj = { sphere: { scale: 0.3, colorscheme: 'element' } };
    }

    viewer.setStyle({ hetflag: false }, styleObj);

    // Highlight heteroatoms / bound ligands with bright sticks
    viewer.setStyle(
      { hetflag: true },
      {
        stick: {
          colorscheme: 'greenCarbon',
          radius: 0.28,
        },
      }
    );

    // If active binding pocket coordinates exist and box is requested, draw grid bounding box
    if (pocket && drawBox && pocket.centerCoords) {
      const c = pocket.centerCoords;
      const s = pocket.boxDimensions;
      viewer.addBox({
        center: { x: c.x, y: c.y, z: c.z },
        dimensions: { w: s.sizeX, h: s.sizeY, d: s.sizeZ },
        color: '#22D3EE',
        opacity: 0.4,
        wireframe: true,
      });

      // Highlight catalytic key residues if identified
      if (pocket.keyResidues && pocket.keyResidues.length > 0) {
        pocket.keyResidues.forEach((resStr) => {
          const resNum = parseInt(resStr.replace(/\D/g, ''), 10);
          if (resNum) {
            viewer.addStyle(
              { resi: resNum },
              {
                stick: { color: '#F59E0B', radius: 0.22 },
                label: { text: resStr, fontSize: 10, fontColor: '#FDE047', backgroundOpacity: 0.6 },
              }
            );
          }
        });
      }
    }
  };

  const handleToggleSpin = () => {
    if (!viewerRef.current) return;
    if (isSpinning) {
      viewerRef.current.spin(false);
      setIsSpinning(false);
    } else {
      viewerRef.current.spin('y', 1);
      setIsSpinning(true);
    }
  };

  const handleResetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  };

  const handleCaptureScreenshot = () => {
    if (viewerRef.current) {
      const dataUri = viewerRef.current.pngURI();
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = `${structure?.pdbId || 'structure'}_3dmol_view.png`;
      a.click();
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-slate-800 flex flex-col relative group">
      {/* Top Overlay Header */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-bold text-slate-100">{structure?.pdbId || 'No PDB'}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 truncate max-w-[200px]">{structure?.geneSymbol || 'Receptor'}</span>
          {structure?.resolution && (
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {structure.resolution}
            </span>
          )}
        </div>

        {/* Quick Style Toggles */}
        {showControls && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRenderStyle('cartoon')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                renderStyle === 'cartoon' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Cartoon
            </button>
            <button
              onClick={() => setRenderStyle('surface')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                renderStyle === 'surface' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Surface
            </button>
            <button
              onClick={() => setRenderStyle('stick')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                renderStyle === 'stick' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Sticks
            </button>
          </div>
        )}
      </div>

      {/* 3Dmol.js WebGL Container */}
      <div className="relative w-full bg-[#070B14]" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070B14]/80 text-xs font-mono text-cyan-400">
            <RefreshCw className="w-6 h-6 animate-spin mb-2" />
            <span>Fetching 3D Coordinates from RCSB PDB...</span>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070B14]/90 p-6 text-center text-xs font-mono text-amber-300">
            <p className="mb-2">{errorMsg}</p>
            <p className="text-slate-400 text-[11px]">
              WebGL context active. Ensure internet access to download PDB files from RCSB.
            </p>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Action Controls */}
        {showControls && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300">
            <button
              onClick={handleToggleSpin}
              className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${isSpinning ? 'text-cyan-400 bg-cyan-500/10' : ''}`}
              title={isSpinning ? 'Stop Rotation' : 'Auto-Rotate'}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded hover:bg-slate-800 transition-colors"
              title="Reset Camera Zoom"
            >
              <Scan className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowPocketBox(!showPocketBox)}
              className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${showPocketBox ? 'text-amber-400' : 'text-slate-500'}`}
              title="Toggle Grid Pocket Box"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={handleCaptureScreenshot}
              className="p-1.5 rounded hover:bg-slate-800 transition-colors text-slate-300 hover:text-cyan-300"
              title="Save View Screenshot"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Pocket Tag */}
        {activePocket && showPocketBox && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Pocket: {activePocket.pocketName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
