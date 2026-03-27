import { useState } from 'react';
import Navbar from '../../components/Header/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

const Root = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Navbar sits at the very top, full width */}
            <Navbar onToggleSidebar={toggleSidebar} />
            
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar goes under Navbar on the left */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* Outlet wrapped in a scrollable area on the right */}
                <main className="flex-1 overflow-y-auto w-full">
                    <Outlet />
                </main>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}
            </div>
        </div>
    );
};

export default Root;