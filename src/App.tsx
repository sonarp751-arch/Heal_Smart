import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ResearchProjectProvider } from './context/ResearchProjectContext';
import { ScientificHeader, ResearchSidebar } from './components/common/ScientificHeader';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiseaseDiscoveryPage } from './pages/DiseaseDiscoveryPage';
import { DrugFirstRepurposingPage } from './pages/DrugFirstRepurposingPage';
import { OmicsAnalysisPage } from './pages/OmicsAnalysisPage';
import { TargetExplorerPage } from './pages/TargetExplorerPage';
import { NetworkAnalysisPage } from './pages/NetworkAnalysisPage';
import { PathwayExplorerPage } from './pages/PathwayExplorerPage';
import { StructureExplorerPage } from './pages/StructureExplorerPage';
import { DockingPlannerPage } from './pages/DockingPlannerPage';
import { MoleculeDiscoveryPage } from './pages/MoleculeDiscoveryPage';
import { MolecularOptimizationPage } from './pages/MolecularOptimizationPage';
import { AdmetWorkspacePage } from './pages/AdmetWorkspacePage';
import { LiteratureIntelligencePage } from './pages/LiteratureIntelligencePage';
import { NextBestExperimentPage } from './pages/NextBestExperimentPage';
import { ResearchReportPage } from './pages/ResearchReportPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans bg-scientific-grid">
      <ScientificHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex relative">
        {/* Research Sidebar (Hidden on landing page on desktop if desired, or always accessible) */}
        {!isLanding && (
          <ResearchSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${
            !isLanding ? 'lg:pl-72' : ''
          }`}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/disease" element={<DiseaseDiscoveryPage />} />
            <Route path="/drug-first" element={<DrugFirstRepurposingPage />} />
            <Route path="/repurposing" element={<DrugFirstRepurposingPage />} />
            <Route path="/omics" element={<OmicsAnalysisPage />} />
            <Route path="/targets" element={<TargetExplorerPage />} />
            <Route path="/network" element={<NetworkAnalysisPage />} />
            <Route path="/pathways" element={<PathwayExplorerPage />} />
            <Route path="/structures" element={<StructureExplorerPage />} />
            <Route path="/docking" element={<DockingPlannerPage />} />
            <Route path="/molecules" element={<MoleculeDiscoveryPage />} />
            <Route path="/optimization" element={<MolecularOptimizationPage />} />
            <Route path="/admet" element={<AdmetWorkspacePage />} />
            <Route path="/literature" element={<LiteratureIntelligencePage />} />
            <Route path="/experiments" element={<NextBestExperimentPage />} />
            <Route path="/report" element={<ResearchReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <SettingsProvider>
      <ResearchProjectProvider>
        <Router basename="/research">
          <AppLayout />
        </Router>
      </ResearchProjectProvider>
    </SettingsProvider>
  );
}

export default App;
