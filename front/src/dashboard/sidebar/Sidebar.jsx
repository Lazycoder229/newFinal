import { React, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Users as GroupsIcon,
  MessagesSquare,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "User Management", icon: <Users size={20} /> },
  { name: "Mentor", icon: <CheckSquare size={20} /> },
  { name: "Groups", icon: <GroupsIcon size={20} /> },
  { name: "Forum", icon: <MessagesSquare size={20} /> },
  { name: "Announcement", icon: <Bell size={20} /> },
  { name: "Logs", icon: <FileText size={20} /> },
  { name: "System Settings", icon: <Settings size={20} /> },
];

export default function Sidebar({ active, onSelect }) {
  const [tooltip, setTooltip] = useState(null);

  const handleClick = (itemName) => {
    onSelect?.(itemName);

    if (window.innerWidth < 768) {
      setTooltip(itemName);

      // Auto-hide tooltip after 1 second
      setTimeout(() => {
        setTooltip(null);
      }, 1000);
    }
  };

  return (
    <aside className="h-screen bg-white text-black flex flex-col shadow-lg w-14 md:w-55 transition-all duration-300">
      {/* Logo / Brand */}
      <div className="p-4 md:p-5 flex items-center gap-2">
        <img src="./icon.png" alt="" className="w-6 h-6" />
        <h2 className="hidden md:block font-bold text-sm">PeerConnect</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.name} className="relative">
            <button
              onClick={() => handleClick(item.name)}
              className={`w-full flex items-center gap-2 md:gap-4 p-2 md:p-2 rounded-lg transition-colors duration-200 focus:outline-none
                ${
                  active === item.name
                    ? "bg-blue-100 text-blue-500"
                    : "text-black hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {item.icon}
              <span className="hidden md:inline text-sm">{item.name}</span>
            </button>
            {/* Tooltip for mobile */}
            <span
              className={`
    absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap
    opacity-0 pointer-events-none
    transform transition-all duration-300 ease-in-out
    ${tooltip === item.name ? "opacity-100 translate-x-1" : "-translate-x-2"}
    md:hidden 
  `}
            >
              {item.name}
            </span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-gray-500 text-xs">
        &copy; 2025 PeerConnect. All rights reserved.
      </div>
    </aside>
  );
}
