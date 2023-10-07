import { FC, useState, createContext } from 'react';
type SidebarContextProps = {
  children: React.ReactNode;
  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SidebarContext = createContext({} as SidebarContextProps);

export const SidebarProvider: FC<SidebarContextProps> = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <SidebarContext.Provider
      value={{ children, sidebarToggle, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
