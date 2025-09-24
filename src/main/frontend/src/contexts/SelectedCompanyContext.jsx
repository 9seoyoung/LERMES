import { createContext, useContext, useEffect, useState } from "react";

const SelectedCompanyContext = createContext(null);
const KEY = "fixedSn";

export function SelectedCompanyProvider({ children }) {
  const [fixedSn, setFixedSn] = useState(() => {
    const raw = sessionStorage.getItem(KEY);
    return raw ? Number(raw) : null;
  });

  useEffect(() => {
    if (fixedSn == null) {
      sessionStorage.removeItem(KEY);
    } else {
      sessionStorage.setItem(KEY, String(fixedSn));
    }
  }, [fixedSn]);

  const clearFixedSn = () => setFixedSn(null);

  return (
    <SelectedCompanyContext.Provider value={{ fixedSn, setFixedSn, clearFixedSn }}>
      {children}
    </SelectedCompanyContext.Provider>
  );
}

export function useSelectedCompany() {
  const ctx = useContext(SelectedCompanyContext);
  if (!ctx) throw new Error("useSelectedCompany must be used within SelectedCompanyProvider");
  return ctx;
}