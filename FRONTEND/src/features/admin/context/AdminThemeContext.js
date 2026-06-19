import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';

const AdminThemeContext = createContext();

// Dark mode has been removed. Theme is always 'light'. Sidebar state is
// preserved. `toggleTheme`/`setTheme` are no-ops kept for compatibility.
export const AdminThemeProvider = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return storage.getItem('adminSidebarCollapsed') === 'true';
        }
        return false;
    });

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(storage.getItem('adminSidebarWidth')) || 260;
        }
        return 260;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
    }, []);

    useEffect(() => {
        storage.setItem('adminSidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        storage.setItem('adminSidebarWidth', sidebarWidth);
    }, [sidebarWidth]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <AdminThemeContext.Provider value={{ 
            theme: 'light', 
            setTheme: () => {},
            toggleTheme: () => {}, 
            isSidebarCollapsed, 
            toggleSidebar,
            sidebarWidth,
            setSidebarWidth
        }}>
            {children}
        </AdminThemeContext.Provider>
    );
};

export const useAdminTheme = () => {
    const context = useContext(AdminThemeContext);
    if (!context) {
        throw new Error('useAdminTheme must be used within an AdminThemeProvider');
    }
    return context;
};
