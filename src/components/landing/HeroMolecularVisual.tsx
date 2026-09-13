import React, { useEffect, useRef } from 'react';

export const HeroMolecularVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    // Simulated 3D Protein & Ligand Atoms
    const atoms = [
      { x: 0, y: 0, z: 0, r: 10, color: '#22D3EE', label: 'Cα Hinge' },
      { x: 45, y: -25, z: 30, r: 7, color: '#10B981', label: 'Ligand H-Bond' },
      { x: -40, y: 35, z: -20, r: 8, color: '#38BDF8', label: 'Met793' },
      { x: 70, y: 20, z: -35, r: 6, color: '#F59E0B', label: 'Pocket Cleft' },
      { x: -60, y: -45, z: 40, r: 7, color: '#A855F7', label: 'Thr854' },
      { x: 30, y: 65, z: 15, r: 6, color: '#22D3EE', label: 'Cys797' },
      { x: -20, y: -70, z: -25, r: 8, color: '#10B981', label: 'Pharmacophore' },
      { x: 85, y: -40, z: 20, r: 6, color: '#38BDF8', label: 'Leu718' },
    ];

    const bonds = [
      [0, 1], [0, 2], [1, 3], [2, 4], [0, 5], [0, 6], [1, 7], [3, 5], [4, 6]
    ];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = 420;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angle += 0.008;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosB = Math.cos(angle * 0.7);
      const sinB = Math.sin(angle * 0.7);

      // Project atoms into 2D with 3D rotation
      const projected = atoms.map((atom) => {
        // Rotate around Y and X
        const x1 = atom.x * cosA - atom.z * sinA;
        const z1 = atom.x * sinA + atom.z * cosA;
        const y2 = atom.y * cosB - z1 * sinB;
        const z2 = atom.y * sinB + z1 * cosB;

        const fov = 350;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { ...atom, px, py, scale, z: z2 };
      });

      // Sort by depth
      projected.sort((a, b) => b.z - a.z);

      // Draw Binding Pocket Grid Coordinate Box
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 130, cy - 110, 260, 220);

      // Draw Grid Ticks
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.fillText('Grid Center (28.45, 34.12, 12.88) Å', cx - 120, cy - 90);
      ctx.fillText('Search Volume: 1120 Å³', cx - 120, cy + 95);

      // Draw Chemical Bonds
      bonds.forEach(([i, j]) => {
        const p1 = projected.find((p) => p.label === atoms[i].label);
        const p2 = projected.find((p) => p.label === atoms[j].label);
        if (!p1 || !p2) return;

        const grad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
        grad.addColorStop(0, p1.color);
        grad.addColorStop(1, p2.color);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, 2 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      });

      // Draw Atoms & Labels
      projected.forEach((atom) => {
        const rad = atom.r * atom.scale;

        // Glow
        ctx.beginPath();
        ctx.arc(atom.px, atom.py, rad + 4, 0, 2 * Math.PI);
        ctx.fillStyle = `${atom.color}25`;
        ctx.fill();

        // Atom Body
        ctx.beginPath();
        ctx.arc(atom.px, atom.py, rad, 0, 2 * Math.PI);
        ctx.fillStyle = atom.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#070B14';
        ctx.stroke();

        // Label
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#CBD5E1';
        ctx.textAlign = 'center';
        ctx.fillText(atom.label, atom.px, atom.py + rad + 12);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/30 p-2 relative shadow-2xl bg-[#090F1C]/80">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-xs font-mono font-bold text-slate-200">
          Target Pocket & Pharmacophore In Silico Simulation
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-[420px]" />
    </div>
  );
};
