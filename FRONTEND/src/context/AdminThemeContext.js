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
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
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
