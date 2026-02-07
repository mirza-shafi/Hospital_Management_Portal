import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';

const DoctorThemeContext = createContext();

export const DoctorThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return storage.getItem('doctorTheme') || 'light';
        }
        return 'light';
    });
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return storage.getItem('doctorSidebarCollapsed') === 'true';
        }
        return false;
    });

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(storage.getItem('doctorSidebarWidth')) || 260;
        }
        return 260;
    });

    useEffect(() => {
        // Apply theme to root
        const root = window.document.documentElement;
        const body = window.document.body;
        
        // Remove potentially conflicting classes
        root.classList.remove('light', 'dark');
        body.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.add('light');
            body.classList.add('light');
            root.style.colorScheme = 'light';
        }
        storage.setItem('doctorTheme', theme);
    }, [theme]);

    useEffect(() => {
        storage.setItem('doctorSidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        storage.setItem('doctorSidebarWidth', sidebarWidth);
    }, [sidebarWidth]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <DoctorThemeContext.Provider value={{ 
            theme, 
            setTheme,
            toggleTheme, 
            isSidebarCollapsed, 
            toggleSidebar,
            sidebarWidth,
            setSidebarWidth
        }}>
            {children}
        </DoctorThemeContext.Provider>
    );
};

export const useDoctorTheme = () => {
    const context = useContext(DoctorThemeContext);
    if (!context) {
        throw new Error('useDoctorTheme must be used within a DoctorThemeProvider');
    }
    return context;
};
