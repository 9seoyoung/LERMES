import { createContext, useContext, useEffect, useState } from "react";

const SelectedCompanyContext = createContext(null);
const KEY = "selectedCompanySn";

export function SelectedCompanyProvider({ children }) {
  const [selectedCompanySn, setSelectedCompanySn] = useState(() => {
    const raw = sessionStorage.getItem(KEY);
    return raw ? Number(raw) : null;
  });

  useEffect(() => {
    if (selectedCompanySn == null) {
      sessionStorage.removeItem(KEY);
    } else {
      sessionStorage.setItem(KEY, String(selectedCompanySn));
    }
  }, [selectedCompanySn]);

  const clearSelectedCompany = () => setSelectedCompanySn(null);

  return (
    <SelectedCompanyContext.Provider value={{ selectedCompanySn, setSelectedCompanySn, clearSelectedCompany }}>
      {children}
    </SelectedCompanyContext.Provider>
  );
}

export function useSelectedCompany() {
  const ctx = useContext(SelectedCompanyContext);
  if (!ctx) throw new Error("useSelectedCompany must be used within SelectedCompanyProvider");
  return ctx;
}