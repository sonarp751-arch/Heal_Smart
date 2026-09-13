import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsState {
  openRouterModel: string;
  dockingBackendUrl: string;
  uniprotEndpoint: string;
  rcsbPdbEndpoint: string;
  europePmcEndpoint: string;
  chemblEndpoint: string;
  enableLiveExternalApis: boolean;
  setOpenRouterModel: (model: string) => void;
  setDockingBackendUrl: (url: string) => void;
  setEnableLiveExternalApis: (enable: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  openRouterModel: 'meta-llama/llama-3.3-70b-instruct:free',
  dockingBackendUrl: 'http://localhost:8000/api/v1/status',
  uniprotEndpoint: 'https://rest.uniprot.org/uniprotkb',
  rcsbPdbEndpoint: 'https://data.rcsb.org/rest/v1/core/entry',
  europePmcEndpoint: 'https://www.ebi.ac.uk/europepmc/webservices/rest',
  chemblEndpoint: 'https://www.ebi.ac.uk/chembl/api/data',
  enableLiveExternalApis: true,
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openRouterModel, setOpenRouterModel] = useState<string>(() => {
    return localStorage.getItem('insilico_openrouter_model') || defaultSettings.openRouterModel;
  });

  const [dockingBackendUrl, setDockingBackendUrl] = useState<string>(() => {
    return localStorage.getItem('insilico_docking_url') || defaultSettings.dockingBackendUrl;
  });

  const [enableLiveExternalApis, setEnableLiveExternalApis] = useState<boolean>(() => {
    const stored = localStorage.getItem('insilico_live_apis');
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('insilico_openrouter_model', openRouterModel);
  }, [openRouterModel]);

  useEffect(() => {
    localStorage.setItem('insilico_docking_url', dockingBackendUrl);
  }, [dockingBackendUrl]);

  useEffect(() => {
    localStorage.setItem('insilico_live_apis', String(enableLiveExternalApis));
  }, [enableLiveExternalApis]);

  const resetToDefaults = () => {
    setOpenRouterModel(defaultSettings.openRouterModel);
    setDockingBackendUrl(defaultSettings.dockingBackendUrl);
    setEnableLiveExternalApis(true);
    localStorage.removeItem('insilico_openrouter_model');
    localStorage.removeItem('insilico_docking_url');
    localStorage.removeItem('insilico_live_apis');
  };

  return (
    <SettingsContext.Provider
      value={{
        openRouterModel,
        dockingBackendUrl,
        uniprotEndpoint: defaultSettings.uniprotEndpoint,
        rcsbPdbEndpoint: defaultSettings.rcsbPdbEndpoint,
        europePmcEndpoint: defaultSettings.europePmcEndpoint,
        chemblEndpoint: defaultSettings.chemblEndpoint,
        enableLiveExternalApis,
        setOpenRouterModel,
        setDockingBackendUrl,
        setEnableLiveExternalApis,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
