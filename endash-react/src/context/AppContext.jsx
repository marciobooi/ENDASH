import React, { createContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    language: 'EN',
    geos: 'BE', // Can be a string or an array, initial REF has it as string
    unit: 'KWH',
    dataset: 'nrg_ind_eff', // Default dataset from REF
    chartId: 'chart_1',
    indicator: '',
    indicator2: '',
    indicator_type: '',
    indicator2_type: '',
    title: '', // Will be set by chart or page
    compare: false,
    year: '2021',
    percentage: 0,
    chartType: 'lineChart', // Default chart type
    chartCreated: false,
    chartExpanded: false,
    share: 'false', // String 'false' as in REF
    meta: '',
    labels: {}, // For storing loaded translation labels
    translations: {}, // For storing general translations from translations.json
  });

  // Function to change language
  const changeLanguage = useCallback(async (langCode) => {
    if (['EN', 'DE', 'FR'].includes(langCode.toUpperCase())) {
      try {
        const labelsResponse = await fetch(`/data/labels_${langCode.toUpperCase()}.json`);
        if (!labelsResponse.ok) {
          throw new Error(`Failed to load labels for ${langCode}: ${labelsResponse.statusText}`);
        }
        const labelsData = await labelsResponse.json();

        setAppState(prevState => ({
          ...prevState,
          language: langCode.toUpperCase(),
          labels: labelsData,
        }));
      } catch (error) {
        console.error("Error loading language labels:", error);
        // Fallback or error handling - e.g., keep old labels or set to default
        setAppState(prevState => ({ ...prevState, language: langCode.toUpperCase() }));
      }
    } else {
      console.warn(`Language code ${langCode} not supported.`);
    }
  }, []);

  // Function to load general translations (translations.json)
  const loadGeneralTranslations = useCallback(async () => {
    try {
      const response = await fetch('/data/translations.json');
      if (!response.ok) {
        throw new Error(`Failed to load general translations: ${response.statusText}`);
      }
      const data = await response.json();
      setAppState(prevState => ({ ...prevState, translations: data }));
    } catch (error) {
      console.error("Error loading general translations:", error);
    }
  }, []);

  // Load initial labels and general translations on component mount
  useEffect(() => {
    loadGeneralTranslations();
    changeLanguage(appState.language); // Load labels for the initial language
  }, [loadGeneralTranslations, changeLanguage, appState.language]);

  // Translation function 't'
  const t = useCallback((key) => {
    // Try labels specific to current language first
    if (appState.labels && appState.labels[key]) {
      return appState.labels[key];
    }
    // Fallback to general translations if key not found in language-specific labels
    // This assumes translations.json might have a structure like { "EN": { "KEY": "Value" } }
    // or a flat structure if keys are unique across languages.
    // For simplicity, let's assume translations.json provides general fallbacks or UI elements not in labels_XX.json
    // The original code's `languageNameSpace.labels` was a merged object.
    // Here, we prioritize appState.labels (from labels_XX.json)
    // A more robust system might merge translations.json content appropriately on language change.
    // For now, if you need a key from translations.json, ensure it's loaded and accessed,
    // perhaps by checking appState.translations[appState.language]?.[key] or similar.
    // The original `languageNameSpace.labels` was populated by merging.
    // Let's simplify: if not in specific labels, return key.
    // console.warn(`Translation key "${key}" not found in language "${appState.language}".`);
    return key; // Fallback to key if not found
  }, [appState.labels, appState.language, /* appState.translations */]);

  // Function to update other parts of the state if needed
  const updateAppState = useCallback((updates) => {
    setAppState(prevState => ({ ...prevState, ...updates }));
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, changeLanguage, t, updateAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
