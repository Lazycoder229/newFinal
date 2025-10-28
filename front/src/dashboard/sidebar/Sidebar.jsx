import { React } from "react";
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
export default function Sidebar({ active, onSelect, collapsed }) {
  return (
    <aside className="flex flex-col flex-1 bg-white text-black">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 mt-3">
        <img src="./icon.png" alt="Logo" className="w-6 h-6" />
        <h2
          className={`font-bold text-sm transition-all duration-300 ${
            collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
          }`}
        >
          PeerConnect
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onSelect(item.name)}
            className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 ${
              active === item.name
                ? "bg-blue-100 text-blue-500"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <span className="flex justify-center w-6">{item.icon}</span>
            <span
              className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
              }`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      <div
        className={`p-3 text-xs text-gray-500 border-t transition-all duration-300 ${
          collapsed ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        © 2025 PeerConnect
      </div>
    </aside>
  );
}
