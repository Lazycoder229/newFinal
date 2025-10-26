// Layout.jsx
import React from "react";

export default function Layout({ sidebar, children }) {
  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 text-white">{sidebar}</aside>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-3 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
