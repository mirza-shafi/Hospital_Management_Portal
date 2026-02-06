import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'light');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        localStorage.getItem('adminSidebarCollapsed') === 'true'
    );
    const [sidebarWidth, setSidebarWidth] = useState(
        parseInt(localStorage.getItem('adminSidebarWidth')) || 260
    );

    useEffect(() => {
        const root = window.document.documentElement;
        console.log(`[AdminThemeContext] Switching theme to: ${theme}`);
        
        // Remove any existing theme classes to avoid conflicts
        root.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.add('light'); // Optional, but good for specificity
            root.style.colorScheme = 'light';
        }
        localStorage.setItem('adminTheme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('adminSidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        localStorage.setItem('adminSidebarWidth', sidebarWidth);
    }, [sidebarWidth]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <AdminThemeContext.Provider value={{ 
            theme, 
            setTheme,
            toggleTheme, 
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
