import React from 'react';
import { LogOut, User, Library, Menu } from 'lucide-react';
import Swal from 'sweetalert2';

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of the admin panel!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
        }).then((result) => {
            if (result.isConfirmed) {
                // Remove login status
                localStorage.removeItem("isLoggedIn");

                // Show success alert
                Swal.fire({
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#4f46e5',
                }).then(() => {
                    // Redirect to login
                    window.location.href = "/login";
                });
            }
        });
    };

    return (
        <div className="navbar bg-slate-900 border-b border-slate-800 z-40 w-full shadow-sm sticky top-0">
            <div className="flex-1 flex items-center px-4 md:px-6">
                {/* Hamburger Menu for Mobile */}
                <button 
                    className="mr-3 text-slate-300 hover:text-white lg:hidden"
                    onClick={onToggleSidebar}
                >
                    <Menu size={24} />
                </button>

                <Library className="text-indigo-400 mr-2 md:mr-3" size={24} />
                <a className="text-lg md:text-xl font-bold text-white tracking-wide cursor-pointer truncate hidden sm:block">Library Management</a>
            </div>
            
            <div className="flex-none px-4 md:px-6">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-slate-800 rounded-full text-slate-400 hidden sm:block">
                            <User size={18} />
                        </div>
                        <span className="text-slate-300 text-xs md:text-sm">
                            Welcome, <span className="font-semibold text-white">Admin</span>
                        </span>
                    </div>

                    <div className="h-6 w-px bg-slate-700 mx-1 md:mx-2"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 group cursor-pointer"
                    >
                        <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                        <span className="font-medium text-xs md:text-sm hidden sm:inline">Sign Out</span>
                        {/* Show only icon on very small screens if needed, but user asked for button to be present so keeping text on sm+ */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;