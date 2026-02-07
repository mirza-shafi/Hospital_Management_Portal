import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return storage.getItem('adminTheme') || 'light';
        }
        return 'light';
    });
    
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
        storage.setItem('adminTheme', theme);
    }, [theme]);

    useEffect(() => {
        storage.setItem('adminSidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        storage.setItem('adminSidebarWidth', sidebarWidth);
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
