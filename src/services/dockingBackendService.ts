import { DockingSetupConfig, DockingStrategy } from '../types';

export interface DockingBackendStatus {
  connected: boolean;
  endpoint: string;
  engineVersion?: string; // e.g. "AutoDock Vina 1.2.5"
  gpuAccelerated?: boolean;
  queueLength?: number;
  message: string;
}

export function generateVinaConfigFile(config: {
  receptorPdbqt: string;
  ligandPdbqt: string;
  gridCenter: { x: number; y: number; z: number };
  gridSize: { sizeX: number; sizeY: number; sizeZ: number };
  exhaustiveness?: number;
  energyRange?: number;
  numModes?: number;
  outputName?: string;
}): string {
  return `# =========================================================
# InSilicoRepurposer — AutoDock Vina Configuration File
# Generated for reproducible computational docking
# =========================================================

receptor = ${config.receptorPdbqt}
ligand   = ${config.ligandPdbqt}

# Binding Pocket Grid Box Center (Cartesian coordinates in Angstroms)
center_x = ${config.gridCenter.x.toFixed(3)}
center_y = ${config.gridCenter.y.toFixed(3)}
center_z = ${config.gridCenter.z.toFixed(3)}

# Search Space Dimensions (Angstroms)
size_x = ${config.gridSize.sizeX.toFixed(3)}
size_y = ${config.gridSize.sizeY.toFixed(3)}
size_z = ${config.gridSize.sizeZ.toFixed(3)}

# Search Parameters
exhaustiveness = ${config.exhaustiveness || 16}
energy_range   = ${config.energyRange || 3.0}
num_modes      = ${config.numModes || 9}

# Output Specification
out = ${config.outputName || 'docking_poses.pdbqt'}
log = docking_run.log
`;
}

export function generateVinaShellScript(config: {
  receptorPdbId: string;
  ligandId: string;
  configFile: string;
}): string {
  return `#!/usr/bin/env bash
# InSilicoRepurposer Automated Docking Workflow Script
# Prerequisites: MGLTools / ADFRsuite (prepare_receptor4.py, prepare_ligand4.py), AutoDock Vina

set -e

echo "[1/4] Preparing Target Receptor ${config.receptorPdbId}..."
# 1. Download PDB and remove waters, add polar hydrogens, assign Gasteiger charges:
# prepare_receptor4.py -r ${config.receptorPdbId}.pdb -o ${config.receptorPdbId}_prepared.pdbqt -A checkhydrogens -U nphs_lps_waters

echo "[2/4] Preparing Candidate Molecule ${config.ligandId}..."
# 2. Convert ligand 3D SDF/MOL2 to PDBQT with active rotatable bonds:
# prepare_ligand4.py -l ${config.ligandId}.sdf -o ${config.ligandId}_prepared.pdbqt

echo "[3/4] Executing AutoDock Vina Engine..."
vina --config ${config.configFile}

echo "[4/4] Docking Finished! Output poses saved to docking_poses.pdbqt"
`;
}

export async function checkDockingBackendHealth(endpointUrl: string = 'http://localhost:8000/api/v1/status'): Promise<DockingBackendStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(endpointUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        endpoint: endpointUrl,
        engineVersion: data.engine || 'AutoDock Vina 1.2.5 (Active)',
        gpuAccelerated: data.gpu || false,
        queueLength: data.queue || 0,
        message: 'Live computational docking backend connected and ready for execution.',
      };
    }
  } catch {
    // Expected when no local docking backend server is currently running
  }

  return {
    connected: false,
    endpoint: endpointUrl,
    message: 'Docking preparation complete. Docking execution unavailable — no calculated affinity reported.',
  };
}
