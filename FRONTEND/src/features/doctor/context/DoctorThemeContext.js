import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';

const DoctorThemeContext = createContext();

// Dark mode has been removed. Theme is always 'light'. Sidebar state is
// preserved. `toggleTheme`/`setTheme` are no-ops kept for compatibility.
export const DoctorThemeProvider = ({ children }) => {
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
        const root = window.document.documentElement;
        const body = window.document.body;
        root.classList.remove('dark');
        body.classList.remove('dark');
        root.classList.add('light');
        body.classList.add('light');
        root.style.colorScheme = 'light';
    }, []);

    useEffect(() => {
        storage.setItem('doctorSidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        storage.setItem('doctorSidebarWidth', sidebarWidth);
    }, [sidebarWidth]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <DoctorThemeContext.Provider value={{ 
            theme: 'light', 
            setTheme: () => {},
            toggleTheme: () => {}, 
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
