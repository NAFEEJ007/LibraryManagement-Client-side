import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BookPlus,
  Users,
  UserPlus,
  ClipboardCheck,
  RotateCcw
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Assign Book", icon: <ClipboardCheck size={20} />, path: "/assign-book" },
    { name: "Return Book", icon: <RotateCcw size={20} />, path: "/return-book" },
    { name: "Books", icon: <BookOpen size={20} />, path: "/books" },
    { name: "Add Book", icon: <BookPlus size={20} />, path: "/add-book" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Add User", icon: <UserPlus size={20} />, path: "/add-user" }
  ];

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >


      {/* Menu */}
      <div className="p-4 space-y-2 mt-4 lg:mt-0">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={onClose} // Close sidebar on navigate (mobile)
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition duration-200"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;